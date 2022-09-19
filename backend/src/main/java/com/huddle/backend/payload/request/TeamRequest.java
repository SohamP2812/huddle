package com.huddle.backend.payload.request;

import javax.validation.constraints.NotBlank;

public class TeamRequest {
    @NotBlank
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}