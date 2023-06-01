package com.huddle.api.teamalbum;

import java.util.List;

public class TeamAlbumsResponse {
    private List<TeamAlbumResponse> albums;

    public TeamAlbumsResponse(List<TeamAlbumResponse> albums) {
        this.albums = albums;
    }

    public List<TeamAlbumResponse> getAlbums() {
        return albums;
    }

    public void setAlbums(List<TeamAlbumResponse> albums) {
        this.albums = albums;
    }
}
