package com.huddle.backend.models;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name = "team_members")
public class TeamMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole role;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User member;

    @ManyToOne
    @JoinColumn(name="team_id")
    private Team team;

    public TeamMember() {
    }

    public TeamMember(ERole role, User member, Team team) {
        this.role = role;
        this.member = member;
        this.team = team;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Team getTeam() { return team; }

    public void setTeam(Team team) { this.team = team; }

    public User getMember() { return member; }

    public void setMember(User member) { this.member = member; }

    public ERole getRole() { return role; }

    public void setRole(ERole role) { this.role = role; }
}