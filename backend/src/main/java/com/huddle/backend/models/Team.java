package com.huddle.backend.models;

import org.springframework.data.annotation.CreatedDate;
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
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    private OffsetDateTime createdAt;

    @NotNull
    @Size(max = 20)
    private String name;

    @ManyToOne
    @JoinColumn(name = "manager")
    private User manager;

    @OneToMany(mappedBy = "team", cascade = CascadeType.REMOVE)
    private Set<TeamMember> teamMembers = new HashSet<>();

    @OneToMany(mappedBy = "team", cascade = CascadeType.REMOVE)
    private Set<Event> events = new HashSet<>();

    @NotNull
    @Enumerated(EnumType.STRING)
    private ESport sport;

    public Team() {
    }

    public Team(String name, User manager, ESport sport) {
        this.name = name;
        this.manager = manager;
        this.sport = sport;
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

    public User getManager() {
        return manager;
    }

    public void setManager(User manager) {
        this.manager = manager;
    }

    public Set<TeamMember> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(Set<TeamMember> teamMembers) {
        this.teamMembers = teamMembers;
    }

    public Set<Event> getEvents() {
        return events;
    }

    public void setEvents(Set<Event> events) {
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
