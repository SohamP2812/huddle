package com.huddle.backend.payload.response;

import com.huddle.backend.models.EAttendance;
import com.huddle.backend.models.Event;
import com.huddle.backend.models.User;
import javax.persistence.*;

public class EventParticipantResponse {
  private Long id;

  private EAttendance attendance;

  private UserResponse user;

  private EventResponse event;

  public EventParticipantResponse(
    Long id,
    EAttendance attendance,
    UserResponse participant,
    EventResponse event
  ) {
    this.id = id;
    this.attendance = attendance;
    this.user = participant;
    this.event = event;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public EAttendance getAttendance() {
    return attendance;
  }

  public void setAttendance(EAttendance attendance) {
    this.attendance = attendance;
  }

  public UserResponse getUser() { return user; }

  public void setUser(UserResponse user) {
    this.user = user;
  }

  public EventResponse getEvent() {
    return event;
  }

  public void setEvent(EventResponse event) {
    this.event = event;
  }
}
