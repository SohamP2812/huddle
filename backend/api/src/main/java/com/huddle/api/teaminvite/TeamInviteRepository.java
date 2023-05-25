package com.huddle.api.teaminvite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamInviteRepository extends JpaRepository<DbTeamInvite, Long> {
    Optional<DbTeamInvite> findByToken(String token);

    List<DbTeamInvite> findAllByEmailAndAccepted(String email, Boolean accepted);
}
