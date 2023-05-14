package com.huddle.api.teammember;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<DbTeamMember, Long> {
    void deleteAllByTeamId(Long id);

    void deleteByTeamIdAndMemberId(Long team_id, Long member_id);

    Optional<DbTeamMember> findByTeamIdAndMemberId(Long team_id, Long member_id);
}
