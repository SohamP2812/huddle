package com.huddle.api.security.services;

import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Pattern pattern = Pattern.compile("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}");
        Matcher matcher = pattern.matcher(username);

        DbUser dbUser;

        if (matcher.matches()) {
            dbUser = userRepository
                    .findByEmail(username)
                    .orElseThrow(
                            () ->
                                    new UsernameNotFoundException(
                                            "User Not Found with email: " + username
                                    )
                    );
        } else {
            dbUser = userRepository
                    .findByUsername(username)
                    .orElseThrow(
                            () ->
                                    new UsernameNotFoundException(
                                            "User Not Found with username: " + username
                                    )
                    );
        }

        return UserDetailsImpl.build(dbUser);
    }
}
