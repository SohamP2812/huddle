package com.huddle.backend.payload.response;

import com.huddle.backend.payload.response.TeamResponse;
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
