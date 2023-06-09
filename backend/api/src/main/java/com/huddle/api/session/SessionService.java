package com.huddle.api.session;

import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;

@Service
public class SessionService {

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    public DbUser authenticateAndRetrieveUser(@Valid @RequestBody LoginRequest loginRequest) {
        DbUser dbUser = userService.getUserByEmailOrUsername(loginRequest.getUsername());

        if (!this.passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword())) {
            throw new BadCredentialsException("Invalid credentials.");
        }

        return dbUser;
    }

    public DbUser getSelfFromId(Long userId) {
        return userService.getUser(userId);
    }
}
