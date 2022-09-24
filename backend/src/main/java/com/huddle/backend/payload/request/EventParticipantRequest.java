package com.huddle.backend.payload.request;

import com.huddle.backend.models.EAttendance;
import javax.validation.constraints.NotNull;

public class EventParticipantRequest {
  @NotNull
  private EAttendance attendance;

  public EAttendance getAttendance() {
    return attendance;
  }

  public void setAttendance(EAttendance attendance) {
    this.attendance = attendance;
  }
}
