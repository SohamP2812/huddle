package com.huddle.api.user;

import com.huddle.api.security.jwt.JwtUtils;
import com.huddle.api.security.services.UserDetailsImpl;
import com.huddle.api.session.SignupRequest;
import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamResponse;
import com.huddle.api.team.TeamsResponse;
import com.huddle.core.exceptions.UnauthorizedException;
import com.huddle.core.payload.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserService userService;

    @PostMapping("")
    public ResponseEntity<?> createUser(
            HttpServletResponse response,
            @Valid @RequestBody SignupRequest signUpRequest
    ) {
        DbUser dbUser = userService.createUser(signUpRequest);

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
        List<DbUser> dbUsers = userService.getUsers(username);

        List<UserResponse> responseUsers = dbUsers
                .stream()
                .map(
                        UserResponse::new
                )
                .toList();

        return ResponseEntity.ok(new UsersResponse(responseUsers));
    }

    @DeleteMapping("/password")
    public ResponseEntity<?> resetPassword(
            HttpServletRequest request,
            @Valid @RequestBody ResetPasswordRequest resetPasswordRequest
    ) {
        userService.resetPassword(request, resetPasswordRequest);

        return ResponseEntity.ok(new MessageResponse("Reset email sent."));
    }

    @PostMapping("/password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody NewPasswordRequest newPasswordRequest) {
        userService.setNewPassword(newPasswordRequest);

        return ResponseEntity.ok(new MessageResponse("Password reset successfully!"));
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<?> getUser(@PathVariable Long user_id) {
        DbUser dbUser = userService.getUser(user_id);

        return ResponseEntity.ok(new UserResponse(dbUser));
    }

    @PatchMapping("/{user_id}")
    public ResponseEntity<?> updateUser(
            Authentication authentication,
            @Valid @RequestPart UserRequest user,
            @RequestPart(required = false) MultipartFile profilePictureImage,
            @PathVariable Long user_id
    ) throws IOException {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if (userDetails.getId() != user_id) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        DbUser dbUser = userService.updateUser(user, profilePictureImage, user_id);

        return ResponseEntity.ok(new UserResponse(dbUser));
    }

    @DeleteMapping("/{user_id}")
    @Transactional
    public ResponseEntity<?> deleteUser(
            HttpServletResponse response,
            Authentication authentication,
            @Valid @RequestBody DeleteUserRequest deleteUserRequest,
            @PathVariable Long user_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userDetails.getUsername(),
                        deleteUserRequest.getPassword()
                )
        );

        if (userDetails.getId() != user_id) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        userService.deleteUser(user_id);

        Cookie jwtTokenCookie = new Cookie("huddle_session", null);

        jwtTokenCookie.setMaxAge(0);
        jwtTokenCookie.setHttpOnly(true);

        response.addCookie(jwtTokenCookie);

        return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
    }

    @GetMapping("/{user_id}/teams")
    public ResponseEntity<?> getTeams(
            Authentication authentication,
            @PathVariable Long user_id
    ) {
        List<DbTeam> dbTeams = userService.getTeams(user_id);

        List<TeamResponse> responseTeams = dbTeams
                .stream()
                .map(TeamResponse::new)
                .toList();

        return ResponseEntity.ok(new TeamsResponse(responseTeams));
    }
}
