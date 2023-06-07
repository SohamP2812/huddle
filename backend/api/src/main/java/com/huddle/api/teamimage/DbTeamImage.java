package com.huddle.api.teamimage;

import com.huddle.api.teamalbum.DbTeamAlbum;
import com.huddle.core.persistence.DbTimestampedEntity;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "team_images")
public class DbTeamImage extends DbTimestampedEntity {
    @NotNull
    private String url;

    @NotNull
    @ManyToOne
    private DbTeamAlbum teamAlbum;

    public DbTeamImage() {
    }

    public DbTeamImage(
            String url,
            DbTeamAlbum teamAlbum
    ) {
        this.url = url;
        this.teamAlbum = teamAlbum;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public DbTeamAlbum getTeamAlbum() {
        return teamAlbum;
    }

    public void setTeamAlbum(DbTeamAlbum teamAlbum) {
        this.teamAlbum = teamAlbum;
    }
}
