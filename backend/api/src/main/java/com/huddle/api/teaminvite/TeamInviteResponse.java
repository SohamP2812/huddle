package com.huddle.api.teaminvite;

import com.huddle.api.team.TeamResponse;

import java.time.OffsetDateTime;

public class TeamInviteResponse {
    private Long id;

    private String token;

    private TeamResponse team;

    private String email;

    private Boolean accepted;

    private OffsetDateTime createdAt;

    public TeamInviteResponse(DbTeamInvite invite) {
        this.id = invite.getId();
        this.token = invite.getToken();
        this.team = new TeamResponse(invite.getTeam());
        this.email = invite.getEmail();
        this.accepted = invite.getAccepted();
        this.createdAt = invite.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public TeamResponse getTeam() {
        return team;
    }

    public void setTeam(TeamResponse team) {
        this.team = team;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getAccepted() {
        return accepted;
    }

    public void setAccepted(Boolean accepted) {
        this.accepted = accepted;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
