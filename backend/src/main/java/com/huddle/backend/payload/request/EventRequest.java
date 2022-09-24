package com.huddle.backend.payload.request;

import com.huddle.backend.models.EEvent;
import java.time.OffsetDateTime;
import java.util.List;
import javax.validation.constraints.NotNull;

public class EventRequest {
  @NotNull
  private String name;

  @NotNull
  private EEvent eventType;

  @NotNull
  private OffsetDateTime startTime;

  @NotNull
  private OffsetDateTime endTime;

  @NotNull
  private Integer teamScore;

  @NotNull
  private Integer opponentScore;

  @NotNull
  private List<Long> participantIds;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public EEvent getEventType() {
    return eventType;
  }

  public void setEventType(EEvent eventType) {
    this.eventType = eventType;
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

  public List<Long> getParticipantIds() {
    return participantIds;
  }

  public void setParticipantIds(List<Long> participantIds) {
    this.participantIds = participantIds;
  }
}
