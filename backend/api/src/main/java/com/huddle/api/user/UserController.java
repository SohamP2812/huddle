package com.huddle.api.user;

import com.huddle.api.payload.response.MessageResponse;
import com.huddle.api.security.jwt.JwtUtils;
import com.huddle.api.security.services.UserDetailsImpl;
import com.huddle.api.session.SignupRequest;
import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamResponse;
import com.huddle.api.team.TeamsResponse;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.api.teammember.TeamMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

        DbUser dbUser = new DbUser(
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword())
        );

        dbUser = userRepository.save(dbUser);

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
                new UserResponse(dbUser)
        );
    }

    @GetMapping("")
    public ResponseEntity<?> getUsers(@RequestParam String username) {
        List<DbUser> dbUsers = userRepository.findByUsernameStartsWithIgnoreCase(username);

        List<UserResponse> responseUsers = dbUsers
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
        DbUser dbUser = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        return ResponseEntity.ok(new UserResponse(dbUser));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateUser(
            Authentication authentication,
            @Valid @RequestBody UserRequest userRequest,
            @PathVariable Long id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if (userDetails.getId() != id) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("You do not have the authority to make this change."));
        }

        DbUser dbUser = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        dbUser.setFirstName(userRequest.getFirstName());
        dbUser.setLastName(userRequest.getLastName());

        userRepository.save(dbUser);

        return ResponseEntity.ok(new UserResponse(dbUser));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(
            HttpServletResponse response,
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody DeleteUserRequest deleteUserRequest
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userDetails.getUsername(),
                        deleteUserRequest.getPassword()
                )
        );

        if (userDetails.getId() != id) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("You do not have the authority to make this change."));
        }

        Optional<DbUser> user = userRepository.findById(id);

        if (user.isEmpty()) return ResponseEntity
                .badRequest()
                .body(new MessageResponse("No user exists with this id."));

        userRepository.delete(user.get());

        Cookie jwtTokenCookie = new Cookie("huddle_session", null);

        jwtTokenCookie.setMaxAge(0);
        jwtTokenCookie.setHttpOnly(true);

        response.addCookie(jwtTokenCookie);

        return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
    }

    @GetMapping("/{id}/teams")
    public ResponseEntity<?> getTeams(
            Authentication authentication,
            @PathVariable Long id
    ) {
        DbUser dbUser = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        // Which method is better?
        Set<DbTeamMember> memberTeams = dbUser.getMemberTeams();

        //      List<TeamMember> memberTeams = teamMemberRepository.findAllByMemberId(id);

        List<DbTeam> dbTeams = memberTeams
                .stream()
                .map(memberTeam -> memberTeam.getTeam())
                .toList();

        List<TeamResponse> responseTeams = dbTeams
                .stream()
                .map(
                        team ->
                                new TeamResponse(team)
                )
                .toList();

        return ResponseEntity.ok(new TeamsResponse(responseTeams));
    }
}
