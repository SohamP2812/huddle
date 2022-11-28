package com.huddle.backend.team;

import com.huddle.backend.team.ESport;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class TeamRequest {
    @NotEmpty(message = "Name must not be empty")
    private String name;

    @NotNull(message = "Sport must not be empty")
    private ESport sport;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ESport getSport() {
        return sport;
    }

    public void setSport(ESport sport) {
        this.sport = sport;
    }
}
