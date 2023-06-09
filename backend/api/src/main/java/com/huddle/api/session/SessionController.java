package com.huddle.api.session;

import com.huddle.api.application.security.jwt.JwtUtils;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserDetails;
import com.huddle.api.user.UserResponse;
import com.huddle.api.user.UserService;
import com.huddle.core.payload.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/session")
public class SessionController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("")
    public ResponseEntity<?> authenticateUser(
            HttpServletResponse response,
            @Valid @RequestBody LoginRequest loginRequest
    ) {
        DbUser dbUser = userService.getUserByEmailOrUsername(loginRequest.getUsername());

        if (!this.passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword())) {
            throw new BadCredentialsException("Invalid credentials.");
        }

        String jwt = jwtUtils.generateJwtToken(dbUser);

        Cookie jwtTokenCookie = new Cookie("huddle_session", jwt);

        jwtTokenCookie.setMaxAge(86400);
        jwtTokenCookie.setHttpOnly(true);

        response.addCookie(jwtTokenCookie);

        return ResponseEntity.ok(null);
    }

    @GetMapping("")
    public ResponseEntity<?> getSelfFromToken(@AuthenticationPrincipal UserDetails userDetails) {
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
