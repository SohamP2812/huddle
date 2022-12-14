package com.huddle.backend.teammember;

import com.huddle.backend.team.Team;
import com.huddle.backend.user.User;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "team_members")
public class TeamMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole role;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User member;

    @ManyToOne
    @JoinColumn(name = "team_id")
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

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public User getMember() {
        return member;
    }

    public void setMember(User member) {
        this.member = member;
    }

    public ERole getRole() {
        return role;
    }

    public void setRole(ERole role) {
        this.role = role;
    }

    public Boolean isManager() {
        return role == ERole.ROLE_MANAGER;
    }
}
