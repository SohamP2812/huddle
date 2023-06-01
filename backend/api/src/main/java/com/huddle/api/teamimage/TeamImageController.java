package com.huddle.api.teamimage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams/{team_id}/albums/{album_id}/images")
public class TeamImageController {
    @Autowired
    TeamImageService teamImageService;

    @GetMapping("")
    public ResponseEntity<?> getImages(@PathVariable Long album_id) {
        List<DbTeamImage> dbTeamImages = teamImageService.getImages(album_id);

        List<TeamImageResponse> responseImages = dbTeamImages
                .stream()
                .map(
                        TeamImageResponse::new
                )
                .toList();

        return ResponseEntity.ok(new TeamImagesResponse(responseImages));
    }

    @PostMapping("")
    public ResponseEntity<?> addImage(
            @RequestPart MultipartFile image,
            @PathVariable Long team_id,
            @PathVariable Long album_id
    ) throws IOException {
        DbTeamImage dbTeamImage = teamImageService.addImage(image, team_id, album_id);

        return ResponseEntity.ok(new TeamImageResponse(dbTeamImage));
    }
}
