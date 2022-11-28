package com.huddle.backend.team;

import com.huddle.backend.payload.response.*;
import com.huddle.backend.security.services.UserDetailsImpl;
import com.huddle.backend.teammember.*;
import com.huddle.backend.user.User;
import com.huddle.backend.user.UserRepository;
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

        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        Team team = new Team(
                teamRequest.getName(),
                user,
                teamRequest.getSport()
        );

        teamRepository.save(team);

        TeamMember teamMember = new TeamMember(
                ERole.ROLE_MANAGER,
                user,
                team
        );

        teamMemberRepository.save(teamMember);

        return ResponseEntity.ok(
                new TeamResponse(team)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTeam(Authentication authentication, @PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));
        ;

        Team team = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        if (!user.getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(id))
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("You are not a member of this team."));

        return ResponseEntity.ok(
                new TeamResponse(team)
        );
    }

    @DeleteMapping("/{id}")
    @Transactional
    // WHAT IS THIS? (without: No EntityManager with actual transaction available for current thread - cannot reliably process 'remove' call)
    public ResponseEntity<?> deleteTeam(Authentication authentication, @PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));
        ;

        Team team = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));
        ;

        for (TeamMember member : user.getMemberTeams()) {
            if (member.getTeam().getId() == id && !member.isManager()) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("You do not have the authority to make this change."));
            }
        }

        teamRepository.delete(team);

        return ResponseEntity.ok(
                new TeamResponse(team)
        );
    }
}
