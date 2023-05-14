package com.huddle.api.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<DbEvent, Long> {
    Optional<DbEvent> findByIdAndTeamId(Long event_id, Long team_id);

    void deleteAllByTeamId(Long team_id);

}
