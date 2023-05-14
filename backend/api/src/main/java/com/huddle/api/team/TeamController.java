package com.huddle.api.team;

import com.huddle.api.payload.response.MessageResponse;
import com.huddle.api.security.services.UserDetailsImpl;
import com.huddle.api.teammember.ERole;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.api.teammember.TeamMemberRepository;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams")
public class TeamController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    TeamMemberRepository teamMemberRepository;

    @PostMapping("")
    public ResponseEntity<?> createTeam(
            Authentication authentication,
            @Valid @RequestBody TeamRequest teamRequest
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        DbTeam dbTeam = new DbTeam(
                teamRequest.getName(),
                dbUser,
                teamRequest.getSport()
        );

        teamRepository.save(dbTeam);

        DbTeamMember dbTeamMember = new DbTeamMember(
                ERole.ROLE_MANAGER,
                dbUser,
                dbTeam
        );

        teamMemberRepository.save(dbTeamMember);

        return ResponseEntity.ok(
                new TeamResponse(dbTeam)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTeam(Authentication authentication, @PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));
        ;

        DbTeam dbTeam = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        if (!dbUser.getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(id))
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("You are not a member of this team."));

        return ResponseEntity.ok(
                new TeamResponse(dbTeam)
        );
    }

    @DeleteMapping("/{id}")
    @Transactional
    // WHAT IS THIS? (without: No EntityManager with actual transaction available for current thread - cannot reliably process 'remove' call)
    public ResponseEntity<?> deleteTeam(Authentication authentication, @PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));
        ;

        DbTeam dbTeam = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));
        ;

        for (DbTeamMember member : dbUser.getMemberTeams()) {
            if (member.getTeam().getId() == id && !member.isManager()) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("You do not have the authority to make this change."));
            }
        }

        teamRepository.delete(dbTeam);

        return ResponseEntity.ok(
                new TeamResponse(dbTeam)
        );
    }
}
