package com.huddle.api.user;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;

public class UserDetails extends User {
    private final Long id;

    public UserDetails(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
