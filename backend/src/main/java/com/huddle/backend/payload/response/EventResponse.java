package com.huddle.backend.payload.response;

import com.huddle.backend.models.EEvent;
import com.huddle.backend.models.Event;

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
            Event event
    ) {
        this.id = event.getId();
        this.name = event.getName();
        this.team = new TeamResponse(event.getTeam());
        this.startTime = event.getStartTime();
        this.endTime = event.getEndTime();
        this.eventType = event.getEventType();
        this.teamScore = event.getTeamScore();
        this.opponentScore = event.getOpponentScore();
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
