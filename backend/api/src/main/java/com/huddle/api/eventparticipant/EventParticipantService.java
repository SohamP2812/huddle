package com.huddle.api.eventparticipant;

import com.huddle.core.persistence.SessionWrapper;
import com.huddle.core.persistence.Transactor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventParticipantService {
    @Autowired
    Transactor transactor;

    public List<DbEventParticipant> getEventParticipants(Long eventId) {
        return transactor.call(session ->
                session.createCriteria(DbEventParticipant.class)
                        .addEq("event.id", eventId)
                        .list()
        );
    }

    public DbEventParticipant getEventParticipantByUserAndEvent(
            SessionWrapper session,
            Long eventId,
            Long userId
    ) {
        return session.createCriteria(DbEventParticipant.class)
                .addEq("participant.id", userId)
                .addEq("event.id", eventId)
                .uniqueResult();
    }

    public void deleteByParticipantIdAndEventId(
            SessionWrapper session,
            Long participantId,
            Long eventId
    ) {
        DbEventParticipant dbEventParticipant = session.createCriteria(DbEventParticipant.class)
                .addEq("participant.id", participantId)
                .addEq("event.id", eventId)
                .uniqueResult();
        session.delete(dbEventParticipant);
    }

    public DbEventParticipant updateEventParticipant(
            EventParticipantRequest eventParticipantRequest,
            Long eventId,
            Long userId
    ) {
        return transactor.call(session -> {
                    DbEventParticipant dbEventParticipant = getEventParticipantByUserAndEvent(
                            session,
                            userId,
                            eventId
                    );

                    dbEventParticipant.setAttendance(eventParticipantRequest.getAttendance());

                    return session.save(dbEventParticipant);
                }
        );
    }
}
