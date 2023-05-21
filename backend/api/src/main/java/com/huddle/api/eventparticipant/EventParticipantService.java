package com.huddle.api.eventparticipant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class EventParticipantService {
    @Autowired
    EventParticipantRepository eventParticipantRepository;

    public List<DbEventParticipant> getEventParticipants(Long eventId) {
        return eventParticipantRepository.findAllByEventId(eventId);
    }

    public DbEventParticipant getEventParticipantByUserAndEvent(
            Long userId,
            Long eventId
    ) {
        return eventParticipantRepository.findByParticipantIdAndEventId(userId, eventId)
                .orElseThrow(() -> new EntityNotFoundException("No participant exists with this id."));
    }

    public DbEventParticipant updateEventParticipant(
            EventParticipantRequest eventParticipantRequest,
            Long eventId,
            Long userId
    ) {
        DbEventParticipant dbEventParticipant = eventParticipantRepository.findByParticipantIdAndEventId(userId, eventId)
                .orElseThrow(() -> new EntityNotFoundException("No participant exists with this id."));

        dbEventParticipant.setAttendance(eventParticipantRequest.getAttendance());

        return eventParticipantRepository.save(dbEventParticipant);
    }
}
