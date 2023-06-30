package com.huddle.api.teamimage;

import com.huddle.api.teamalbum.DbTeamAlbum;
import com.huddle.api.teamalbum.TeamAlbumService;
import com.huddle.core.persistence.Transactor;
import com.huddle.core.storage.StorageProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class TeamImageService {
    @Autowired
    TeamAlbumService teamAlbumService;

    @Autowired
    StorageProvider storageProvider;

    @Autowired
    Transactor transactor;

    public List<DbTeamImage> getImages(Long albumId) {
        return transactor.call(session -> {
                    DbTeamAlbum dbTeamAlbum = teamAlbumService.getAlbum(albumId);

                    return dbTeamAlbum.getImages()
                            .stream()
                            .toList();
                }
        );

    }

    public DbTeamImage addImage(MultipartFile image, Long teamId, Long albumId) {
        String url = storageProvider.putImage(
                String.format("teams/%s/albums/%s", teamId, albumId),
                image
        );

        return transactor.call(session -> {
                    DbTeamAlbum dbTeamAlbum = teamAlbumService.getAlbum(albumId);

                    return session.save(
                            new DbTeamImage(
                                    url,
                                    dbTeamAlbum
                            )
                    );
                }
        );
    }
}
