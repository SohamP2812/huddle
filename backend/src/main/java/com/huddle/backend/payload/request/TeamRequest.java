package com.huddle.backend.payload.request;

import com.huddle.backend.models.ESport;

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
