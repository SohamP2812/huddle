package com.huddle.api.teamalbum;

import com.huddle.api.team.DbTeam;
import com.huddle.api.teamimage.DbTeamImage;
import com.huddle.core.persistence.DbTimestampedEntity;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "team_albums")
public class DbTeamAlbum extends DbTimestampedEntity {
    private String name;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private DbTeam team;

    @OneToMany(mappedBy = "teamAlbum", cascade = CascadeType.REMOVE)
    private Set<DbTeamImage> images = new HashSet<>();

    public DbTeamAlbum() {
    }

    public DbTeamAlbum(
            String name,
            DbTeam team
    ) {
        this.name = name;
        this.team = team;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DbTeam getTeam() {
        return team;
    }

    public void setTeam(DbTeam team) {
        this.team = team;
    }

    public Set<DbTeamImage> getImages() {
        return images;
    }

    public void setImages(Set<DbTeamImage> images) {
        this.images = images;
    }
}
