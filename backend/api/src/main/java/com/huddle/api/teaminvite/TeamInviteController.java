package com.huddle.api.teaminvite;

import com.huddle.api.team.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/invites")
public class TeamInviteController {
    @Autowired
    TeamService teamService;

    @Autowired
    TeamInviteService teamInviteService;

    @PostMapping("")
    public ResponseEntity<?> createInvite(@Valid @RequestBody TeamInviteRequest teamInviteRequest) {
        DbTeamInvite dbTeamInvite = teamInviteService.createInvite(teamInviteRequest);

        return ResponseEntity.ok(new TeamInviteResponse(dbTeamInvite));
    }

    @GetMapping("")
    public ResponseEntity<?> getInvitesForEmail(@RequestParam String email) {
        List<DbTeamInvite> dbTeamInvites = teamInviteService.getInvitesForEmail(email);

        List<TeamInviteResponse> responseInvites = dbTeamInvites
                .stream()
                .map(TeamInviteResponse::new)
                .toList();

        return ResponseEntity.ok(new TeamInvitesResponse(responseInvites));
    }

    @GetMapping("/{invite_token}")
    public ResponseEntity<?> getInvite(@PathVariable String invite_token) {
        DbTeamInvite dbTeamInvite = teamInviteService.getInviteByToken(invite_token);

        return ResponseEntity.ok(new TeamInviteResponse(dbTeamInvite));
    }

    @PatchMapping("/{invite_token}")
    public ResponseEntity<?> updateInvite(
            @PathVariable String invite_token,
            @Valid @RequestBody UpdateTeamInviteRequest updateTeamInviteRequest
    ) {
        DbTeamInvite dbTeamInvite = teamInviteService.updateInvite(
                invite_token,
                updateTeamInviteRequest
        );

        return ResponseEntity.ok(new TeamInviteResponse(dbTeamInvite));
    }
}
