package com.huddle.api.teamalbum;

import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class TeamAlbumService {
    @Autowired
    TeamAlbumRepository teamAlbumRepository;

    @Autowired
    TeamService teamService;

    public DbTeamAlbum createAlbum(
            TeamAlbumRequest teamAlbumRequest,
            Long teamId
    ) {
        DbTeam dbTeam = teamService.getTeam(teamId);

        DbTeamAlbum dbTeamAlbum = new DbTeamAlbum(
                teamAlbumRequest.getName(),
                dbTeam
        );

        return teamAlbumRepository.save(dbTeamAlbum);
    }

    public List<DbTeamAlbum> getAlbums(Long teamId) {
        DbTeam dbTeam = teamService.getTeam(teamId);

        return dbTeam.getAlbums()
                .stream()
                .toList();
    }


    public DbTeamAlbum getAlbum(Long albumId) {
        return teamAlbumRepository.findById(albumId)
                .orElseThrow(() -> new EntityNotFoundException("No album exists with this id."));
    }
}
