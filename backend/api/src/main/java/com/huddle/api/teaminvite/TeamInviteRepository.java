package com.huddle.api.teaminvite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamInviteRepository extends JpaRepository<DbTeamInvite, Long> {
    Optional<DbTeamInvite> findByToken(String token);

    Optional<DbTeamInvite> findByEmailAndTeamId(String email, Long teamId);

    List<DbTeamInvite> findAllByEmailAndState(String email, EInvitation state);
}
