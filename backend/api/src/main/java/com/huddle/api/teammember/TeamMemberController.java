package com.huddle.api.teammember;

import com.huddle.api.payload.response.MessageResponse;
import com.huddle.api.security.services.UserDetailsImpl;
import com.huddle.core.exceptions.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @GetMapping("")
    public ResponseEntity<?> getMembers(Authentication authentication, @PathVariable Long team_id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

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
            Authentication authentication,
            @PathVariable Long team_id,
            @Valid @RequestBody MemberRequest memberRequest
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<DbTeamMember> dbTeamMembers = teamMemberService.getMembers(team_id);

        if (!dbTeamMembers.stream().map(dbTeamMember -> dbTeamMember.getMember().getId()).toList().contains(userDetails.getId())) {
            throw new UnauthorizedException("You are not a member of this team.");
        }

        if (dbTeamMembers.stream().filter(DbTeamMember::isManager).findFirst().orElseThrow().getId() != userDetails.getId()) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        DbTeamMember dbTeamMember = teamMemberService.addMember(team_id, memberRequest.getId());

        return ResponseEntity.ok(new MemberResponse(dbTeamMember));
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<?> getMember(
            Authentication authentication,
            @PathVariable Long team_id,
            @PathVariable Long user_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

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
            Authentication authentication,
            @PathVariable Long team_id,
            @PathVariable Long user_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<DbTeamMember> dbTeamMembers = teamMemberService.getMembers(team_id);

        if (!dbTeamMembers.stream().map(dbTeamMember -> dbTeamMember.getMember().getId()).toList().contains(userDetails.getId())) {
            throw new UnauthorizedException("You are not a member of this team.");
        }

        if (dbTeamMembers.stream().filter(DbTeamMember::isManager).findFirst().orElseThrow().getId() != userDetails.getId()) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        teamMemberService.deleteMember(team_id, user_id);

        return ResponseEntity.ok(new MessageResponse("Member deleted successfully!"));
    }
}
