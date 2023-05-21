package com.huddle.api.session;

import com.huddle.core.payload.MessageResponse;
import com.huddle.api.security.jwt.JwtUtils;
import com.huddle.api.security.services.UserDetailsImpl;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserResponse;
import com.huddle.api.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/session")
public class SessionController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserService userService;

    @PostMapping("")
    public ResponseEntity<?> authenticateUser(
            HttpServletResponse response,
            @Valid @RequestBody LoginRequest loginRequest
    ) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Cookie jwtTokenCookie = new Cookie("huddle_session", jwt);

        jwtTokenCookie.setMaxAge(86400);
        jwtTokenCookie.setHttpOnly(true);

        response.addCookie(jwtTokenCookie);

        return ResponseEntity.ok(
                new JwtResponse(
                        jwt,
                        userDetails.getId(),
                        userDetails.getFirstName(),
                        userDetails.getLastName(),
                        userDetails.getUsername(),
                        userDetails.getEmail()
                )
        );
    }

    @GetMapping("")
    public ResponseEntity<?> getSelfFromToken(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userService.getUser(userDetails.getId());

        return ResponseEntity.ok(new UserResponse(dbUser));
    }

    @DeleteMapping("")
    public ResponseEntity<?> deleteToken(HttpServletResponse response) {
        Cookie jwtTokenCookie = new Cookie("huddle_session", null);

        jwtTokenCookie.setMaxAge(0);
        jwtTokenCookie.setHttpOnly(true);

        response.addCookie(jwtTokenCookie);

        return ResponseEntity.ok(new MessageResponse("Logged out."));
    }
}
