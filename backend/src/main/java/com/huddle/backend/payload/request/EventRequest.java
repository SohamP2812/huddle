package com.huddle.backend.payload.request;

import com.huddle.backend.models.EEvent;
import com.huddle.backend.models.ESport;

import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public EEvent getEventType() { return eventType; }

    public void setEventType(EEvent eventType) { this.eventType = eventType; }

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

    public Integer getTeamScore() { return teamScore; }

    public void setTeamScore(Integer teamScore) { this.teamScore = teamScore; }

    public Integer getOpponentScore() { return opponentScore; }

    public void setOpponentScore(Integer opponentScore) { this.opponentScore = opponentScore; }
}