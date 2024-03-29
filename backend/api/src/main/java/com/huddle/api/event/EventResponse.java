package com.huddle.api.event;

import com.huddle.api.team.TeamResponse;

import java.time.OffsetDateTime;

public class EventResponse {
    private Long id;
    private String name;

    private String notes;

    private String address;

    private TeamResponse team;

    private OffsetDateTime startTime;

    private OffsetDateTime endTime;

    private EEvent eventType;

    private Integer teamScore;

    private Integer opponentScore;

    public EventResponse(DbEvent dbEvent) {
        this.id = dbEvent.getId();
        this.name = dbEvent.getName();
        this.notes = dbEvent.getNotes();
        this.address = dbEvent.getAddress();
        this.team = new TeamResponse(dbEvent.getTeam());
        this.startTime = dbEvent.getStartTime();
        this.endTime = dbEvent.getEndTime();
        this.eventType = dbEvent.getEventType();
        this.teamScore = dbEvent.getTeamScore();
        this.opponentScore = dbEvent.getOpponentScore();
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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
