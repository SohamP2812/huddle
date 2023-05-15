package com.huddle.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<DbUser, Long> {
    Optional<DbUser> findByUsername(String username);

    Optional<DbUser> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmailIgnoreCase(String email);

    List<DbUser> findByUsernameStartsWithIgnoreCase(String username);
}
