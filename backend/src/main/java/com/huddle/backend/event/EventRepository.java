package com.huddle.backend.event;

import com.huddle.backend.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByIdAndTeamId(Long event_id, Long team_id);

    void deleteAllByTeamId(Long team_id);

}
