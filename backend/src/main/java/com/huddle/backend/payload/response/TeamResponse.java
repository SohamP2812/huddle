package com.huddle.backend.payload.response;

import com.huddle.backend.models.User;

public class TeamResponse {
    private Long id;
    private String name;

    private UserResponse manager;

    public TeamResponse(Long id, String name, UserResponse manager) {
        this.id = id;
        this.name = name;
        this.manager = manager;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserResponse getManager() { return manager; }

    public void setManager(UserResponse manager) { this.manager = manager; }
}
