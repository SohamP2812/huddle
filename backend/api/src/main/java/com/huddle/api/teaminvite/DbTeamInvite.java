package com.huddle.api.teaminvite;

import com.huddle.api.team.DbTeam;
import com.huddle.core.persistence.DbTimestampedEntity;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.UUID;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "team_invites")
public class DbTeamInvite extends DbTimestampedEntity {
    private String token;

    private String email;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private DbTeam team;

    private Boolean accepted;

    public DbTeamInvite() {
    }

    public DbTeamInvite(String email, DbTeam team) {
        this.token = UUID.randomUUID().toString();
        this.email = email;
        this.team = team;
        this.accepted = false;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public DbTeam getTeam() {
        return team;
    }

    public void setTeam(DbTeam team) {
        this.team = team;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getAccepted() {
        return accepted;
    }

    public void setAccepted(Boolean accepted) {
        this.accepted = accepted;
    }
}
