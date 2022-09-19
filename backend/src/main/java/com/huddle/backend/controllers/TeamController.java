package com.huddle.backend.controllers;

import javax.validation.Valid;

import com.huddle.backend.models.Team;
import com.huddle.backend.models.TeamMember;
import com.huddle.backend.payload.request.TeamRequest;
import com.huddle.backend.payload.response.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.huddle.backend.models.User;
import com.huddle.backend.payload.request.LoginRequest;
import com.huddle.backend.payload.request.SignupRequest;
import com.huddle.backend.repository.UserRepository;
import com.huddle.backend.repository.TeamMemberRepository;
import com.huddle.backend.repository.TeamRepository;
import com.huddle.backend.security.jwt.JwtUtils;
import com.huddle.backend.security.services.UserDetailsImpl;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/teams")
public class TeamController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    TeamRepository teamRepository;

    @PostMapping("")
    public ResponseEntity<?> createTeam(Authentication authentication, @Valid @RequestBody TeamRequest teamRequest) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<User> user = userRepository.findById(userDetails.getId());

        if(user.isEmpty()) return ResponseEntity.ok(new MessageResponse("No user exists with this id."));

        Team team = new Team(teamRequest.getName(), user.get());

        teamRepository.save(team);

        return ResponseEntity.ok(new MessageResponse("Team created successfully!"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTeam(@PathVariable Long id) {
        Optional<Team> team = teamRepository.findById(id);

        if(team.isEmpty()) return ResponseEntity.ok(new MessageResponse("No team exists with this id."));

        return ResponseEntity.ok(new TeamResponse(
                team.get().getId(),
                team.get().getName(),
                new UserResponse(
                        team.get().getManager().getId(),
                        team.get().getManager().getUsername(),
                        team.get().getManager().getEmail()
                )));
    }
}