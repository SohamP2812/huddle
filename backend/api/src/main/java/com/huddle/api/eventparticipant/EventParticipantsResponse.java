package com.huddle.api.eventparticipant;

import java.util.List;

public class EventParticipantsResponse {
    private List<EventParticipantResponse> eventParticipants;

    public EventParticipantsResponse(List<EventParticipantResponse> eventParticipants) {
        this.eventParticipants = eventParticipants;
    }

    public List<EventParticipantResponse> getEventParticipants() {
        return eventParticipants;
    }

    public void setEventParticipants(List<EventParticipantResponse> eventParticipants) {
        this.eventParticipants = eventParticipants;
    }
}
