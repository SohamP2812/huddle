package com.huddle.api.teamimage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamImageRepository extends JpaRepository<DbTeamImage, Long> {
}
