package com.huddle.backend.payload.request;

import com.huddle.backend.models.EEvent;
import com.huddle.backend.models.ESport;

import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public class UpdateEventRequest {
    private String name;

    private EEvent eventType;

    private OffsetDateTime startTime;

    private OffsetDateTime endTime;

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
}