package com.huddle.api.teaminvite;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

public class TeamInviteRequest {
    private Long teamId;

    @NotEmpty(message = "Email must not be empty")
    @Size(max = 50, message = "Max length is 50 characters")
    @Email
    private String email;

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
