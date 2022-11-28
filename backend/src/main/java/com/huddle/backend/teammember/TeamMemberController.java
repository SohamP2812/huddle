package com.huddle.backend.teammember;

import com.huddle.backend.event.Event;
import com.huddle.backend.eventparticipant.EventParticipantRepository;
import com.huddle.backend.payload.response.MessageResponse;
import com.huddle.backend.security.services.UserDetailsImpl;
import com.huddle.backend.team.Team;
import com.huddle.backend.team.TeamRepository;
import com.huddle.backend.user.User;
import com.huddle.backend.user.UserRepository;
import com.huddle.backend.user.UserResponse;
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

        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        Team team = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        if (!user.getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(id))
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("You are not a member of this team."));

        Set<TeamMember> teamMembers = team.getTeamMembers();

        List<MemberResponse> responseMembers = teamMembers
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


        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        Team team = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        if (!user.getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(id))
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("You are not a member of this team."));

        for (TeamMember member : user.getMemberTeams()) {
            if (member.getTeam().getId() == id && !member.isManager()) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("You do not have the authority to make this change."));
            }
        }

        User userToAdd = userRepository.findById(memberRequest.getId()).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        Set<TeamMember> memberTeams = userToAdd.getMemberTeams();

        List<Team> teams = memberTeams
                .stream()
                .map(memberTeam -> memberTeam.getTeam())
                .toList();

        if (teams.contains(team)) return ResponseEntity
                .badRequest()
                .body(new MessageResponse("User is already a member of this team."));

        TeamMember teamMember = new TeamMember(
                ERole.ROLE_MEMBER,
                userToAdd,
                team
        );

        teamMemberRepository.save(teamMember);

        return ResponseEntity.ok(new UserResponse(userToAdd));
    }

    @DeleteMapping("/{user_id}")
    @Transactional
    public ResponseEntity<?> deleteMember(
            Authentication authentication,
            @PathVariable Long id,
            @PathVariable Long user_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        Team team = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        User userToDelete = userRepository.findById(user_id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        for (TeamMember member : user.getMemberTeams()) {
            if (member.getTeam().getId() == id && !member.isManager() && member.getMember().getId() != user_id) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("You do not have the authority to make this change."));
            }
        }

        Optional<TeamMember> teamMember = teamMemberRepository.findByTeamIdAndMemberId(
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
        for (Event event : team.getEvents()) {
            eventParticipantRepository.deleteByParticipantIdAndEventId(user_id, event.getId());
        }

        return ResponseEntity.ok(new UserResponse(userToDelete));
    }
}
