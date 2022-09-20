package com.huddle.backend.repository;

import java.util.List;
import java.util.Optional;

import com.huddle.backend.models.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.huddle.backend.models.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByIdAndTeamId(Long event_id, Long team_id);
}
