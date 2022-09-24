package com.huddle.backend.repository;

import com.huddle.backend.models.Event;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
  Optional<Event> findByIdAndTeamId(Long event_id, Long team_id);
}
