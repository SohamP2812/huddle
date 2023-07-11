package com.huddle.api.stat;

import com.huddle.core.payload.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/stats")
public class StatController {
    @Autowired
    StatService statService;

    @GetMapping("")
    public ResponseEntity<?> getAllStats() {
        List<DbStat> dbStats = statService.getAllStats();

        List<StatResponse> responseStats = dbStats
                .stream()
                .map(
                        StatResponse::new
                )
                .toList();

        return ResponseEntity.ok(new StatsResponse(responseStats));
    }

    @PostMapping("/counted/refresh")
    public ResponseEntity<?> refreshCountedStats() {
        statService.syncCountedStats();
        return ResponseEntity.ok(new MessageResponse("Successfully refreshed."));
    }
}
