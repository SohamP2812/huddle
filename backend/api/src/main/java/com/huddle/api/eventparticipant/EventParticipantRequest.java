package com.huddle.api.eventparticipant;

import javax.validation.constraints.NotNull;

public class EventParticipantRequest {
    @NotNull(message = "Sport must not be empty")
    private EAttendance attendance;

    public EAttendance getAttendance() {
        return attendance;
    }

    public void setAttendance(EAttendance attendance) {
        this.attendance = attendance;
    }
}
