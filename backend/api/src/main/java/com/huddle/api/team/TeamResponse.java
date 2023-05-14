package com.huddle.api.team;

import com.huddle.api.user.UserResponse;

import java.time.OffsetDateTime;

public class TeamResponse {
    private Long id;
    private String name;

    private UserResponse manager;

    private ESport sport;

    private OffsetDateTime createdAt;

    public TeamResponse(
            DbTeam dbTeam
    ) {
        this.id = dbTeam.getId();
        this.name = dbTeam.getName();
        this.manager = new UserResponse(dbTeam.getManager());
        this.sport = dbTeam.getSport();
        this.createdAt = dbTeam.getCreatedAt();
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

    public UserResponse getManager() {
        return manager;
    }

    public void setManager(UserResponse manager) {
        this.manager = manager;
    }

    public ESport getSport() {
        return sport;
    }

    public void setSport(ESport sport) {
        this.sport = sport;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
