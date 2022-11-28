package com.huddle.backend.user;

import com.huddle.backend.team.*;
import com.huddle.backend.session.SignupRequest;
import com.huddle.backend.payload.response.*;
import com.huddle.backend.security.jwt.JwtUtils;
import com.huddle.backend.teammember.TeamMember;
import com.huddle.backend.teammember.TeamMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TeamMemberRepository teamMemberRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("")
    public ResponseEntity<?> createUser(
            HttpServletResponse response,
            @Valid @RequestBody SignupRequest signUpRequest
    ) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Username is already taken!"));
        }

        if (userRepository.existsByEmailIgnoreCase(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Email is already in use!"));
        }

        User user = new User(
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword())
        );

        user = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signUpRequest.getUsername(),
                        signUpRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Cookie jwtTokenCookie = new Cookie("huddle_session", jwt);

        jwtTokenCookie.setMaxAge(86400);
        jwtTokenCookie.setHttpOnly(true);

        response.addCookie(jwtTokenCookie);

        return ResponseEntity.ok(
                new UserResponse(user)
        );
    }

    @GetMapping("")
    public ResponseEntity<?> getUsers(@RequestParam String username) {
        List<User> users = userRepository.findByUsernameStartsWithIgnoreCase(username);

        List<UserResponse> responseUsers = users
                .stream()
                .map(
                        user ->
                                new UserResponse(user)
                )
                .toList();

        return ResponseEntity.ok(new UsersResponse(responseUsers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        return ResponseEntity.ok(new UserResponse(user));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @Valid @RequestBody UserRequest userRequest,
            @PathVariable Long id
    ) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());

        userRepository.save(user);

        return ResponseEntity.ok(new UserResponse(user));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isEmpty()) return ResponseEntity
                .badRequest()
                .body(new MessageResponse("No user exists with this id."));

        userRepository.delete(user.get());

        return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
    }

    @GetMapping("/{id}/teams")
    public ResponseEntity<?> getTeams(
            Authentication authentication,
            @PathVariable Long id
    ) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        // Which method is better?
        Set<TeamMember> memberTeams = user.getMemberTeams();

        //      List<TeamMember> memberTeams = teamMemberRepository.findAllByMemberId(id);

        List<Team> teams = memberTeams
                .stream()
                .map(memberTeam -> memberTeam.getTeam())
                .toList();

        List<TeamResponse> responseTeams = teams
                .stream()
                .map(
                        team ->
                                new TeamResponse(team)
                )
                .toList();

        return ResponseEntity.ok(new TeamsResponse(responseTeams));
    }
}
