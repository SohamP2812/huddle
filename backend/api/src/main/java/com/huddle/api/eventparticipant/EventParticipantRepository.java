package com.huddle.api.eventparticipant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository
        extends JpaRepository<DbEventParticipant, Long> {
    Optional<DbEventParticipant> findByParticipantIdAndEventId(
            Long user_id,
            Long event_id
    );

    List<DbEventParticipant> findAllByEventId(Long event_id);

    void deleteAllByEventId(Long event_id);

    void deleteByParticipantIdAndEventId(
            Long user_id,
            Long event_id
    );
}
