package com.huddle.api.team;

import com.huddle.api.payload.response.MessageResponse;
import com.huddle.api.security.services.UserDetailsImpl;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserService;
import com.huddle.core.exceptions.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams")
public class TeamController {
    @Autowired
    TeamRepository teamRepository;

    @Autowired
    TeamService teamService;

    @Autowired
    UserService userService;

    @PostMapping("")
    public ResponseEntity<?> createTeam(
            Authentication authentication,
            @Valid @RequestBody TeamRequest teamRequest
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbTeam dbTeam = teamService.createTeam(teamRequest, userDetails.getId());

        return ResponseEntity.ok(new TeamResponse(dbTeam));
    }

    @GetMapping("/{team_id}")
    public ResponseEntity<?> getTeam(Authentication authentication, @PathVariable Long team_id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userService.getUser(userDetails.getId());

        DbTeam dbTeam = teamService.getTeam(team_id);

        if (!dbUser.getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(team_id))
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("You are not a member of this team."));

        return ResponseEntity.ok(new TeamResponse(dbTeam));
    }

    @DeleteMapping("/{team_id}")
    @Transactional
    public ResponseEntity<?> deleteTeam(Authentication authentication, @PathVariable Long team_id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbTeam dbTeam = teamService.getTeam(team_id);

        if (dbTeam.getManager().getId() != userDetails.getId()) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        teamRepository.delete(dbTeam);

        return ResponseEntity.ok(new MessageResponse("Team deleted successfully!"));
    }
}
