package com.huddle.backend.payload.response;

import com.huddle.backend.models.ESport;
import com.huddle.backend.models.Team;
import com.huddle.backend.models.User;

public class TeamResponse {
  private Long id;
  private String name;

  private UserResponse manager;

  private ESport sport;

  public TeamResponse(
    Team team
  ) {
    this.id = team.getId();
    this.name = team.getName();
    this.manager = new UserResponse(team.getManager());
    this.sport = team.getSport();
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

  public UserResponse getManager() {
    return manager;
  }

  public void setManager(UserResponse manager) {
    this.manager = manager;
  }

  public ESport getSport() {
    return sport;
  }

  public void setSport(ESport sport) {
    this.sport = sport;
  }
}
