package com.huddle.api.teamimage;

import java.time.OffsetDateTime;

public class TeamImageResponse {
    private Long id;

    private String url;

    private OffsetDateTime createdAt;

    public TeamImageResponse(DbTeamImage dbTeamImage) {
        this.id = dbTeamImage.getId();
        this.url = dbTeamImage.getUrl();
        this.createdAt = dbTeamImage.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
