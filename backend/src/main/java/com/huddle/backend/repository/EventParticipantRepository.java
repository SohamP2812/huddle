package com.huddle.backend.repository;

import com.huddle.backend.models.EventParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository
        extends JpaRepository<EventParticipant, Long> {
    Optional<EventParticipant> findByParticipantIdAndEventId(
            Long user_id,
            Long event_id
    );

    List<EventParticipant> findAllByEventId(Long event_id);

    void deleteAllByEventId(Long event_id);

    void deleteByParticipantIdAndEventId(
            Long user_id,
            Long event_id
    );
}
