package com.huddle.backend.repository;

import com.huddle.backend.models.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    void deleteAllByTeamId(Long id);

    void deleteByTeamIdAndMemberId(Long team_id, Long member_id);

    Optional<TeamMember> findByTeamIdAndMemberId(Long team_id, Long member_id);
}
