package com.huddle.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.huddle.backend.models.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
