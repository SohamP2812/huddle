package com.huddle.backend.payload.response;

import com.huddle.backend.payload.response.TeamResponse;

import java.util.List;

public class TeamsResponse {
    private List<TeamResponse> teams;

    public TeamsResponse(List<TeamResponse> teams) {
        this.teams = teams;
    }

    public List<TeamResponse> getTeams() {
        return teams;
    }

    public void setTeams(List<TeamResponse> teams) {
        this.teams = teams;
    }
}
