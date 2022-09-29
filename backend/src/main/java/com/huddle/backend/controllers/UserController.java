package com.huddle.backend.controllers;

import com.huddle.backend.models.Team;
import com.huddle.backend.models.TeamMember;
import com.huddle.backend.models.User;
import com.huddle.backend.payload.request.SignupRequest;
import com.huddle.backend.payload.request.UserRequest;
import com.huddle.backend.payload.response.*;
import com.huddle.backend.repository.TeamMemberRepository;
import com.huddle.backend.repository.UserRepository;
import com.huddle.backend.security.jwt.JwtUtils;
import com.huddle.backend.security.services.UserDetailsImpl;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
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

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
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

    userRepository.save(user);

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
    jwtTokenCookie.setSecure(true);
    jwtTokenCookie.setHttpOnly(true);

    response.addCookie(jwtTokenCookie);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    return ResponseEntity.ok(
      new UserResponse(
        userDetails.getId(),
        userDetails.getFirstName(),
        userDetails.getLastName(),
        userDetails.getUsername(),
        userDetails.getEmail()
      )
    );
  }

  @GetMapping("")
  public ResponseEntity<?> getUsers(@RequestParam String username) {
    List<User> users = userRepository.findByUsernameStartsWith(username);

    List<UserResponse> responseUsers = users
      .stream()
      .map(
        user ->
          new UserResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getUsername(),
            user.getEmail()
          )
      )
      .toList();

    return ResponseEntity.ok(new UsersResponse(responseUsers));
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getUser(@PathVariable Long id) {
    Optional<User> user = userRepository.findById(id);

    if (user.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No user exists with this id."));

    return ResponseEntity.ok(
      new UserResponse(
        user.get().getId(),
        user.get().getFirstName(),
        user.get().getLastName(),
        user.get().getUsername(),
        user.get().getEmail()
      )
    );
  }

  @PatchMapping("/{id}")
  public ResponseEntity<?> updateUser(
    @Valid @RequestBody UserRequest userRequest,
    @PathVariable Long id
  ) {
    Optional<User> user = userRepository.findById(id);

    if (user.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No user exists with this id."));

    user.get().setFirstName(userRequest.getFirstName());
    user.get().setLastName(userRequest.getLastName());

    userRepository.save(user.get());

    return ResponseEntity.ok(
      new UserResponse(
        user.get().getId(),
        user.get().getFirstName(),
        user.get().getLastName(),
        user.get().getUsername(),
        user.get().getEmail()
      )
    );
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
    Optional<User> user = userRepository.findById(id);

    if (user.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No user exists with this id."));

    // Which method is better?
    Set<TeamMember> memberTeams = user.get().getMemberTeams();

    //      List<TeamMember> memberTeams = teamMemberRepository.findAllByMemberId(id);

    List<Team> teams = memberTeams
      .stream()
      .map(memberTeam -> memberTeam.getTeam())
      .toList();

    List<TeamResponse> responseTeams = teams
      .stream()
      .map(
        team ->
          new TeamResponse(
            team.getId(),
            team.getName(),
            new UserResponse(
              team.getManager().getId(),
              team.getManager().getFirstName(),
              team.getManager().getLastName(),
              team.getManager().getUsername(),
              team.getManager().getEmail()
            ),
            team.getSport()
          )
      )
      .toList();

    return ResponseEntity.ok(new TeamsResponse(responseTeams));
  }
}
