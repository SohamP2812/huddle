package com.huddle.backend.payload.response;

import com.huddle.backend.models.EEvent;
import com.huddle.backend.models.ESport;
import com.huddle.backend.models.Team;
import com.huddle.backend.models.User;
import java.time.OffsetDateTime;

public class EventResponse {
  private Long id;
  private String name;

  private TeamResponse team;

  private OffsetDateTime startTime;

  private OffsetDateTime endTime;

  private EEvent eventType;

  private Integer teamScore;

  private Integer opponentScore;

  public EventResponse(
    Long id,
    String name,
    TeamResponse team,
    OffsetDateTime startTime,
    OffsetDateTime endTime,
    EEvent eventType,
    Integer teamScore,
    Integer opponentScore
  ) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.startTime = startTime;
    this.endTime = endTime;
    this.eventType = eventType;
    this.teamScore = teamScore;
    this.opponentScore = opponentScore;
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

  public TeamResponse getTeam() {
    return team;
  }

  public void setTeam(TeamResponse team) {
    this.team = team;
  }

  public OffsetDateTime getStartTime() {
    return startTime;
  }

  public void setStartTime(OffsetDateTime startTime) {
    this.startTime = startTime;
  }

  public OffsetDateTime getEndTime() {
    return endTime;
  }

  public void setEndTime(OffsetDateTime endTime) {
    this.endTime = endTime;
  }

  public EEvent getEventType() {
    return eventType;
  }

  public void setEventType(EEvent eventType) {
    this.eventType = eventType;
  }

  public Integer getTeamScore() {
    return teamScore;
  }

  public void setTeamScore(Integer teamScore) {
    this.teamScore = teamScore;
  }

  public Integer getOpponentScore() {
    return opponentScore;
  }

  public void setOpponentScore(Integer opponentScore) {
    this.opponentScore = opponentScore;
  }
}
