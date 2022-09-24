package com.huddle.backend.payload.response;

import com.huddle.backend.models.EAttendance;
import com.huddle.backend.models.Event;
import com.huddle.backend.models.User;
import javax.persistence.*;

public class EventParticipantResponse {
  private Long id;

  private EAttendance attendance;

  private UserResponse participant;

  private EventResponse event;

  public EventParticipantResponse(
    Long id,
    EAttendance attendance,
    UserResponse participant,
    EventResponse event
  ) {
    this.id = id;
    this.attendance = attendance;
    this.participant = participant;
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

  public UserResponse getParticipant() {
    return participant;
  }

  public void setParticipant(UserResponse participant) {
    this.participant = participant;
  }

  public EventResponse getEvent() {
    return event;
  }

  public void setEvent(EventResponse event) {
    this.event = event;
  }
}
