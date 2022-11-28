package com.huddle.backend.user;

import com.huddle.backend.eventparticipant.EventParticipant;
import com.huddle.backend.team.Team;
import com.huddle.backend.teammember.TeamMember;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        }
)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    private OffsetDateTime createdAt;

    @NotNull
    @Size(max = 20)
    private String username;

    @NotNull
    @Size(max = 20)
    private String firstName;

    @NotNull
    @Size(max = 20)
    private String lastName;

    @NotNull
    @Size(max = 50)
    @Email
    private String email;

    @NotNull
    @Size(max = 120)
    private String password;

    @OneToMany(mappedBy = "manager", cascade = CascadeType.REMOVE)
    private Set<Team> teams = new HashSet<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    private Set<TeamMember> memberTeams = new HashSet<>();

    @OneToMany(mappedBy = "participant", cascade = CascadeType.REMOVE)
    private Set<EventParticipant> participantEvents = new HashSet<>();

    public User() {
    }

    public User(
            String firstName,
            String lastName,
            String username,
            String email,
            String password
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<TeamMember> getMemberTeams() {
        return memberTeams;
    }

    public void setMemberTeams(Set<TeamMember> memberTeams) {
        this.memberTeams = memberTeams;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
