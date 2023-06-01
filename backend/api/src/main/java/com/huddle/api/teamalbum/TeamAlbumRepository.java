package com.huddle.api.teamalbum;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamAlbumRepository extends JpaRepository<DbTeamAlbum, Long> {
}
