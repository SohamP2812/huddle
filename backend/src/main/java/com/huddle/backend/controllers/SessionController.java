package com.huddle.backend.controllers;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.huddle.backend.models.User;
import com.huddle.backend.payload.response.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.huddle.backend.payload.request.LoginRequest;
import com.huddle.backend.payload.response.JwtResponse;
import com.huddle.backend.repository.UserRepository;
import com.huddle.backend.security.jwt.JwtUtils;
import com.huddle.backend.security.services.UserDetailsImpl;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/session")
public class SessionController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("")
    public ResponseEntity<?> authenticateUser(HttpServletResponse response, @Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Cookie jwtTokenCookie = new Cookie("huddle_session", jwt);

        jwtTokenCookie.setMaxAge(86400);
        jwtTokenCookie.setSecure(true);
        jwtTokenCookie.setHttpOnly(true);

        response.addCookie(jwtTokenCookie);

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                userDetails.getUsername(),
                userDetails.getEmail()));
    }

    @GetMapping
    public ResponseEntity<?> getSelfFromToken(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<User> user = userRepository.findById(userDetails.getId());

        if(user.isEmpty()) return ResponseEntity.badRequest().body("No user exists with this id.");

        return ResponseEntity.ok(new UserResponse(
                user.get().getId(),
                user.get().getFirstName(),
                user.get().getLastName(),
                user.get().getUsername(),
                user.get().getEmail()));
    }
}