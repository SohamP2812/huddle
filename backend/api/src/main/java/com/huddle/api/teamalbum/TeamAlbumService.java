package com.huddle.api.teamalbum;

import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamService;
import com.huddle.core.persistence.Transactor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamAlbumService {

    @Autowired
    TeamService teamService;

    @Autowired
    Transactor transactor;

    public DbTeamAlbum createAlbum(
            TeamAlbumRequest teamAlbumRequest,
            Long teamId
    ) {
        return transactor.call(session -> {
                    DbTeam dbTeam = teamService.getTeam(teamId);
                    return session.save(
                            new DbTeamAlbum(
                                    teamAlbumRequest.getName(),
                                    dbTeam
                            )
                    );
                }
        );
    }

    public List<DbTeamAlbum> getAlbums(Long teamId) {
        return transactor.call(session -> {
                    DbTeam dbTeam = teamService.getTeam(teamId);

                    return dbTeam.getAlbums()
                            .stream()
                            .toList();
                }
        );
    }


    public DbTeamAlbum getAlbum(Long albumId) {
        return transactor.call(session ->
                session.get(DbTeamAlbum.class, albumId)
        );
    }
}
