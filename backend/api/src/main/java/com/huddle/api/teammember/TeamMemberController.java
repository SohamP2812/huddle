package com.huddle.api.teammember;

import com.huddle.api.event.DbEvent;
import com.huddle.api.eventparticipant.EventParticipantRepository;
import com.huddle.api.payload.response.MessageResponse;
import com.huddle.api.security.services.UserDetailsImpl;
import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamRepository;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserRepository;
import com.huddle.api.user.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams/{id}/members")
public class TeamMemberController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    TeamMemberRepository teamMemberRepository;

    @Autowired
    EventParticipantRepository eventParticipantRepository;

    @GetMapping("")
    public ResponseEntity<?> getMembers(Authentication authentication, @PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        DbTeam dbTeam = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        if (!dbUser.getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(id))
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("You are not a member of this team."));

        Set<DbTeamMember> dbTeamMembers = dbTeam.getTeamMembers();

        List<MemberResponse> responseMembers = dbTeamMembers
                .stream()
                .map(
                        member ->
                                new MemberResponse(member)
                )
                .toList();

        return ResponseEntity.ok(new MembersResponse(responseMembers));
    }

    @PostMapping("")
    public ResponseEntity<?> addMember(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody MemberRequest memberRequest
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        DbTeam dbTeam = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        if (!dbUser.getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(id))
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("You are not a member of this team."));

        for (DbTeamMember member : dbUser.getMemberTeams()) {
            if (member.getTeam().getId() == id && !member.isManager()) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("You do not have the authority to make this change."));
            }
        }

        DbUser dbUserToAdd = userRepository.findById(memberRequest.getId()).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        Set<DbTeamMember> memberTeams = dbUserToAdd.getMemberTeams();

        List<DbTeam> dbTeams = memberTeams
                .stream()
                .map(memberTeam -> memberTeam.getTeam())
                .toList();

        if (dbTeams.contains(dbTeam)) return ResponseEntity
                .badRequest()
                .body(new MessageResponse("User is already a member of this team."));

        DbTeamMember dbTeamMember = new DbTeamMember(
                ERole.ROLE_MEMBER,
                dbUserToAdd,
                dbTeam
        );

        teamMemberRepository.save(dbTeamMember);

        return ResponseEntity.ok(new UserResponse(dbUserToAdd));
    }

    @DeleteMapping("/{user_id}")
    @Transactional
    public ResponseEntity<?> deleteMember(
            Authentication authentication,
            @PathVariable Long id,
            @PathVariable Long user_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        DbTeam dbTeam = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        DbUser dbUserToDelete = userRepository.findById(user_id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        for (DbTeamMember member : dbUser.getMemberTeams()) {
            if (member.getTeam().getId() == id && !member.isManager() && member.getMember().getId() != user_id) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("You do not have the authority to make this change."));
            }
        }

        Optional<DbTeamMember> teamMember = teamMemberRepository.findByTeamIdAndMemberId(
                id,
                user_id
        );

        if (teamMember.isEmpty()) return ResponseEntity
                .badRequest()
                .body(new MessageResponse("This user is not a member of that team."));

        if (teamMember.get().isManager()) return ResponseEntity
                .badRequest()
                .body(new MessageResponse("You cannot delete the manager from a team."));

        teamMemberRepository.deleteByTeamIdAndMemberId(id, user_id); // Should I first get member teams from user then filter by team id?

        // Is this the most effective way? Instead, should we be hiding the non-members on the get request for event participants?
        for (DbEvent dbEvent : dbTeam.getEvents()) {
            eventParticipantRepository.deleteByParticipantIdAndEventId(user_id, dbEvent.getId());
        }

        return ResponseEntity.ok(new UserResponse(dbUserToDelete));
    }
}
