package com.huddle.api.team;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<DbTeam, Long> {
    Boolean existsByNameAndManagerId(String name, Long managerId);
}
