package com.huddle.backend.models;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
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

  @OneToMany(mappedBy = "manager")
  private Set<Team> teams = new HashSet<>();

  @OneToMany(mappedBy = "member")
  private Set<TeamMember> memberTeams = new HashSet<>();

  @OneToMany(mappedBy = "participant")
  private Set<EventParticipant> participantEvents = new HashSet<>();

  public User() {}

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
}
