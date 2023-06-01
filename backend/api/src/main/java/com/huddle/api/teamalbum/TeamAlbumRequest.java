package com.huddle.api.teamalbum;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

public class TeamAlbumRequest {
    @NotEmpty(message = "Album name must not be empty")
    @Size(max = 50, message = "Max length is 50 characters")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
