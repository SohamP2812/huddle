package com.huddle.backend.event;

import com.huddle.backend.event.EventResponse;

import java.util.List;

public class EventsResponse {
    private List<EventResponse> events;

    public EventsResponse(List<EventResponse> events) {
        this.events = events;
    }

    public List<EventResponse> getEvents() {
        return events;
    }

    public void setEvents(List<EventResponse> events) {
        this.events = events;
    }
}
