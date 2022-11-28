package com.huddle.backend.eventparticipant;

import com.huddle.backend.event.EventResponse;
import com.huddle.backend.user.UserResponse;

public class EventParticipantResponse {
    private Long id;

    private EAttendance attendance;

    private UserResponse user;

    private EventResponse event;

    public EventParticipantResponse(
            EventParticipant eventParticipant
    ) {
        this.id = eventParticipant.getId();
        this.attendance = eventParticipant.getAttendance();
        this.user = new UserResponse(eventParticipant.getParticipant());
        this.event = new EventResponse(eventParticipant.getEvent());
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
