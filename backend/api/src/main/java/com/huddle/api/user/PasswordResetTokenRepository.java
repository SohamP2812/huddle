package com.huddle.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<DbPasswordResetToken, Long> {
    Optional<DbPasswordResetToken> findByToken(String token);
}
