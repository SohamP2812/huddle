package com.huddle.api.teaminvite;

import com.huddle.api.team.DbTeam;
import com.huddle.core.persistence.DbTimestampedEntity;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.hibernate.annotations.Cache;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "team_invites")
public class DbTeamInvite extends DbTimestampedEntity {
    @NotNull
    private String token;

    @NotNull
    private String email;

    @NotNull
    @ManyToOne
    private DbTeam team;

    @NotNull
    private EInvitation state;

    public DbTeamInvite() {
    }

    public DbTeamInvite(String email, DbTeam team) {
        this.token = UUID.randomUUID().toString();
        this.email = email;
        this.team = team;
        this.state = EInvitation.PENDING;
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

    public EInvitation getState() {
        return state;
    }

    public void setState(EInvitation state) {
        this.state = state;
    }
}
