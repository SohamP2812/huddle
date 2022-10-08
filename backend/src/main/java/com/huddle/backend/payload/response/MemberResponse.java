package com.huddle.backend.payload.response;

import com.huddle.backend.models.TeamMember;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class MemberResponse {
  private Long id;
  private String username;
  private String firstName;

  private String lastName;

  private String email;

  private Boolean isManager;

  public MemberResponse(
    TeamMember member
  ) {
    this.id = member.getMember().getId();
    this.firstName = member.getMember().getFirstName();
    this.lastName = member.getMember().getLastName();
    this.username = member.getMember().getUsername();
    this.email = member.getMember().getEmail();
    this.isManager = member.isManager();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
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

  public Boolean getIsManager() {
    return isManager;
  }

  public void setIsManager(Boolean isManager) { this.isManager = isManager; }
}
