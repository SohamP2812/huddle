package com.huddle.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.huddle.backend.models.TeamMember;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    void deleteAllByTeamId(Long id);

    void deleteByTeamIdAndMemberId(Long team_id, Long member_id);

    Optional<TeamMember> findByTeamIdAndMemberId(Long team_id, Long member_id);
}
