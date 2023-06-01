package com.huddle.api.teamalbum;

import java.time.OffsetDateTime;

public class TeamAlbumResponse {
    private Long id;

    private String name;

    private OffsetDateTime createdAt;

    public TeamAlbumResponse(DbTeamAlbum dbTeamAlbum) {
        this.id = dbTeamAlbum.getId();
        this.name = dbTeamAlbum.getName();
        this.createdAt = dbTeamAlbum.getCreatedAt();
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

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
