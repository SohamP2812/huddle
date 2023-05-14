package com.huddle.api.team;

import com.huddle.api.event.DbEvent;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.api.user.DbUser;
import com.huddle.core.persistence.DbTimestampedEntity;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "teams")
public class DbTeam extends DbTimestampedEntity {
    @NotNull
    @Size(max = 20)
    private String name;

    @ManyToOne
    @JoinColumn(name = "manager")
    private DbUser manager;

    @OneToMany(mappedBy = "team", cascade = CascadeType.REMOVE)
    private Set<DbTeamMember> teamMembers = new HashSet<>();

    @OneToMany(mappedBy = "team", cascade = CascadeType.REMOVE)
    private Set<DbEvent> events = new HashSet<>();

    @NotNull
    @Enumerated(EnumType.STRING)
    private ESport sport;

    public DbTeam() {
    }

    public DbTeam(String name, DbUser manager, ESport sport) {
        this.name = name;
        this.manager = manager;
        this.sport = sport;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DbUser getManager() {
        return manager;
    }

    public void setManager(DbUser manager) {
        this.manager = manager;
    }

    public Set<DbTeamMember> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(Set<DbTeamMember> teamMembers) {
        this.teamMembers = teamMembers;
    }

    public Set<DbEvent> getEvents() {
        return events;
    }

    public void setEvents(Set<DbEvent> events) {
        this.events = events;
    }

    public ESport getSport() {
        return sport;
    }

    public void setSport(ESport sport) {
        this.sport = sport;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}