package com.huddle.api.teammember;

import com.huddle.api.team.DbTeam;
import com.huddle.api.user.DbUser;
import com.huddle.core.persistence.DbTimestampedEntity;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "team_members")
public class DbTeamMember extends DbTimestampedEntity {
    @Enumerated(EnumType.STRING)
    private ERole role;

    @Enumerated(EnumType.STRING)
    @ColumnDefault("'UNKNOWN'")
    private EPosition position;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private DbUser member;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private DbTeam team;

    public DbTeamMember() {
    }

    public DbTeamMember(ERole role, EPosition position, DbUser member, DbTeam team) {
        this.role = role;
        this.position = position;
        this.member = member;
        this.team = team;
    }

    public DbTeam getTeam() {
        return team;
    }

    public void setTeam(DbTeam team) {
        this.team = team;
    }

    public DbUser getMember() {
        return member;
    }

    public void setMember(DbUser member) {
        this.member = member;
    }

    public ERole getRole() {
        return role;
    }

    public void setRole(ERole role) {
        this.role = role;
    }

    public EPosition getPosition() {
        return position;
    }

    public void setPosition(EPosition position) {
        this.position = position;
    }

    public Boolean isManager() {
        return role == ERole.ROLE_MANAGER;
    }
}
