package com.huddle.api.teammember;

import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamService;
import com.huddle.api.user.UserDetails;
import com.huddle.core.exceptions.UnauthorizedException;
import com.huddle.core.payload.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams/{team_id}/members")
public class TeamMemberController {
    @Autowired
    TeamMemberService teamMemberService;

    @Autowired
    TeamService teamService;

    @GetMapping("")
    public ResponseEntity<?> getMembers(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long team_id
    ) {
        List<DbTeamMember> dbTeamMembers = teamMemberService.getMembers(team_id);

        if (!dbTeamMembers.stream().map(dbTeamMember -> dbTeamMember.getMember().getId()).toList().contains(userDetails.getId())) {
            throw new UnauthorizedException("You are not a member of this team.");
        }

        List<MemberResponse> responseMembers = dbTeamMembers.stream()
                .map(MemberResponse::new)
                .toList();

        return ResponseEntity.ok(new MembersResponse(responseMembers));
    }

    @PostMapping("")
    public ResponseEntity<?> addMember(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long team_id,
            @Valid @RequestBody MemberRequest memberRequest
    ) {
        DbTeam dbTeam = teamService.getTeam(team_id);

        if (dbTeam.getManager().getId() != userDetails.getId()) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        DbTeamMember dbTeamMember = teamMemberService.addMember(
                team_id,
                memberRequest.getId(),
                memberRequest.getPosition()
        );

        return ResponseEntity.ok(new MemberResponse(dbTeamMember));
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<?> getMember(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long team_id,
            @PathVariable Long user_id
    ) {
        List<DbTeamMember> dbTeamMembers = teamMemberService.getMembers(team_id);

        if (!dbTeamMembers.stream().map(dbTeamMember -> dbTeamMember.getMember().getId()).toList().contains(userDetails.getId())) {
            throw new UnauthorizedException("You are not a member of this team.");
        }

        DbTeamMember dbTeamMember = teamMemberService.getMember(team_id, user_id);

        return ResponseEntity.ok(new MemberResponse(dbTeamMember));
    }

    @DeleteMapping("/{user_id}")
    @Transactional
    public ResponseEntity<?> deleteMember(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long team_id,
            @PathVariable Long user_id
    ) {
        DbTeam dbTeam = teamService.getTeam(team_id);

        if (dbTeam.getManager().getId() != userDetails.getId() && user_id != userDetails.getId()) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        teamMemberService.deleteMember(
                team_id,
                user_id
        );

        return ResponseEntity.ok(new MessageResponse("Member deleted successfully!"));
    }

    @PatchMapping("/{user_id}")
    public ResponseEntity<?> updateMember(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long team_id,
            @PathVariable Long user_id,
            @Valid @RequestBody UpdateMemberRequest updateMemberRequest
    ) {
        DbTeam dbTeam = teamService.getTeam(team_id);

        if (dbTeam.getManager().getId() != userDetails.getId() && user_id != userDetails.getId()) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        DbTeamMember dbTeamMember = teamMemberService.updateMember(
                team_id,
                user_id,
                updateMemberRequest
        );

        return ResponseEntity.ok(new MemberResponse(dbTeamMember));
    }
}
