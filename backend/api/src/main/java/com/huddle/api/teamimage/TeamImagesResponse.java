package com.huddle.api.teamimage;

import java.util.List;

public class TeamImagesResponse {
    private List<TeamImageResponse> images;

    public TeamImagesResponse(List<TeamImageResponse> images) {
        this.images = images;
    }

    public List<TeamImageResponse> getImages() {
        return images;
    }

    public void setImages(List<TeamImageResponse> images) {
        this.images = images;
    }
}
