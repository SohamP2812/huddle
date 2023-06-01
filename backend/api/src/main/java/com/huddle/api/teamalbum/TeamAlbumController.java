package com.huddle.api.teamalbum;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams/{team_id}/albums")
public class TeamAlbumController {
    @Autowired
    TeamAlbumService teamAlbumService;

    @PostMapping("")
    public ResponseEntity<?> createAlbum(
            @Valid @RequestBody TeamAlbumRequest teamAlbumRequest,
            @PathVariable Long team_id
    ) {
        DbTeamAlbum dbTeamAlbum = teamAlbumService.createAlbum(teamAlbumRequest, team_id);

        return ResponseEntity.ok(new TeamAlbumResponse(dbTeamAlbum));
    }

    @GetMapping("")
    public ResponseEntity<?> getAlbums(@PathVariable Long team_id) {
        List<DbTeamAlbum> dbTeamAlbums = teamAlbumService.getAlbums(team_id);

        List<TeamAlbumResponse> responseAlbums = dbTeamAlbums.stream()
                .map(TeamAlbumResponse::new)
                .toList();

        return ResponseEntity.ok(new TeamAlbumsResponse(responseAlbums));
    }
}
