package com.huddle.backend.controllers;

import javax.validation.Valid;

import com.huddle.backend.models.ERole;
import com.huddle.backend.models.Team;
import com.huddle.backend.models.TeamMember;
import com.huddle.backend.payload.request.MemberRequest;
import com.huddle.backend.payload.request.TeamRequest;
import com.huddle.backend.payload.response.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.huddle.backend.models.User;
import com.huddle.backend.payload.request.LoginRequest;
import com.huddle.backend.payload.request.SignupRequest;
import com.huddle.backend.repository.UserRepository;
import com.huddle.backend.repository.TeamMemberRepository;
import com.huddle.backend.repository.TeamRepository;
import com.huddle.backend.security.jwt.JwtUtils;
import com.huddle.backend.security.services.UserDetailsImpl;

import java.lang.reflect.Member;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/teams")
public class TeamController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    TeamMemberRepository teamMemberRepository;

    @PostMapping("")
    public ResponseEntity<?> createTeam(Authentication authentication, @Valid @RequestBody TeamRequest teamRequest) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<User> user = userRepository.findById(userDetails.getId());

        if(user.isEmpty()) return ResponseEntity.badRequest().body("No user exists with this id.");

        Team team = new Team(teamRequest.getName(), user.get(), teamRequest.getSport());

        teamRepository.save(team);

        TeamMember teamMember = new TeamMember(ERole.ROLE_MANAGER, user.get(), team);

        teamMemberRepository.save(teamMember);

        return ResponseEntity.ok(new TeamResponse(
                team.getId(),
                team.getName(),
                new UserResponse(
                        team.getManager().getId(),
                        team.getManager().getUsername(),
                        team.getManager().getEmail()
                ),
                team.getSport()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTeam(@PathVariable Long id) {
        Optional<Team> team = teamRepository.findById(id);

        if(team.isEmpty()) return ResponseEntity.badRequest().body("No team exists with this id.");

        return ResponseEntity.ok(new TeamResponse(
                team.get().getId(),
                team.get().getName(),
                new UserResponse(
                        team.get().getManager().getId(),
                        team.get().getManager().getUsername(),
                        team.get().getManager().getEmail()
                ),
                team.get().getSport()));
    }

    @DeleteMapping("/{id}")
    @Transactional // WHAT IS THIS? (without: No EntityManager with actual transaction available for current thread - cannot reliably process 'remove' call)
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        Optional<Team> team = teamRepository.findById(id);

        if(team.isEmpty()) return ResponseEntity.badRequest().body("No team exists with this id.");

        teamMemberRepository.deleteAllByTeamId(team.get().getId());

        teamRepository.delete(team.get());

        return ResponseEntity.ok(new MessageResponse("Team deleted successfully!"));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<?> getMembers(@PathVariable Long id) {
        Optional<Team> team = teamRepository.findById(id);

        if(team.isEmpty()) return ResponseEntity.badRequest().body("No team exists with this id.");

        Set<TeamMember> teamMembers = team.get().getTeamMembers();

        List<User> members = teamMembers.stream().map(teamMember -> teamMember.getMember()).toList();

        List<MemberResponse> responseMembers = members.stream().map(member ->
                new MemberResponse(
                        member.getId(),
                        member.getUsername(),
                        member.getEmail()
                        ))
                .toList();

        return ResponseEntity.ok(new MembersResponse(responseMembers));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable Long id, @Valid @RequestBody MemberRequest memberRequest) {
        Optional<Team> team = teamRepository.findById(id);

        if(team.isEmpty()) return ResponseEntity.badRequest().body("No team exists with this id.");

        Optional<User> user = userRepository.findById(memberRequest.getId());

        if(user.isEmpty()) return ResponseEntity.badRequest().body("No user exists with this id.");

        Set<TeamMember> memberTeams = user.get().getMemberTeams();

        List<Team> teams = memberTeams.stream().map(memberTeam -> memberTeam.getTeam()).toList();

        if(teams.contains(team.get())) return ResponseEntity.badRequest().body("User is already a member of this team.");

        TeamMember teamMember = new TeamMember(ERole.ROLE_MEMBER, user.get(), team.get());

        teamMemberRepository.save(teamMember);

        return ResponseEntity.ok(new MessageResponse("Member added successfully!"));
    }

    @DeleteMapping("/{id}/members/{user_id}")
    @Transactional
    public ResponseEntity<?> deleteMember(@PathVariable Long id, @PathVariable Long user_id) {
        Optional<Team> team = teamRepository.findById(id);

        if(team.isEmpty()) return ResponseEntity.badRequest().body("No team exists with this id.");

        Optional<User> user = userRepository.findById(user_id);

        if(user.isEmpty()) return ResponseEntity.badRequest().body("No user exists with this id.");

        teamMemberRepository.deleteByTeamIdAndMemberId(id, user_id); // Should I first get member teams from user then filter by team id?

        return ResponseEntity.ok(new MessageResponse("Member deleted successfully!"));
    }
}