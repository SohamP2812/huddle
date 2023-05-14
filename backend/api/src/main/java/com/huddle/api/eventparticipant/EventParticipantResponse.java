package com.huddle.api.eventparticipant;

import com.huddle.api.event.EventResponse;
import com.huddle.api.user.UserResponse;

public class EventParticipantResponse {
    private Long id;

    private EAttendance attendance;

    private UserResponse user;

    private EventResponse event;

    public EventParticipantResponse(
            DbEventParticipant dbEventParticipant
    ) {
        this.id = dbEventParticipant.getId();
        this.attendance = dbEventParticipant.getAttendance();
        this.user = new UserResponse(dbEventParticipant.getParticipant());
        this.event = new EventResponse(dbEventParticipant.getEvent());
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

    public UserResponse getUser() {
        return user;
    }

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
