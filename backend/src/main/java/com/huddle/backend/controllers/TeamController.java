package com.huddle.backend.controllers;

import com.huddle.backend.models.*;
import com.huddle.backend.payload.request.LoginRequest;
import com.huddle.backend.payload.request.MemberRequest;
import com.huddle.backend.payload.request.SignupRequest;
import com.huddle.backend.payload.request.TeamRequest;
import com.huddle.backend.payload.response.*;
import com.huddle.backend.repository.EventRepository;
import com.huddle.backend.repository.TeamMemberRepository;
import com.huddle.backend.repository.TeamRepository;
import com.huddle.backend.repository.UserRepository;
import com.huddle.backend.security.jwt.JwtUtils;
import com.huddle.backend.security.services.UserDetailsImpl;
import java.lang.reflect.Member;
import java.util.*;
import javax.validation.Valid;

import io.micrometer.core.annotation.Timed;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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

  @Autowired
  EventRepository eventRepository;

  @PostMapping("")
  public ResponseEntity<?> createTeam(
    Authentication authentication,
    @Valid @RequestBody TeamRequest teamRequest
  ) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    Optional<User> user = userRepository.findById(userDetails.getId());

    if (user.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No user exists with this id."));

    Team team = new Team(
      teamRequest.getName(),
      user.get(),
      teamRequest.getSport()
    );

    teamRepository.save(team);

    TeamMember teamMember = new TeamMember(
      ERole.ROLE_MANAGER,
      user.get(),
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

    Optional<User> user = userRepository.findById(userDetails.getId());

    Optional<Team> team = teamRepository.findById(id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No team exists with this id."));

    if(!user.get().getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(id)) return ResponseEntity
            .badRequest()
            .body(new MessageResponse("You are not a member of this team."));

    return ResponseEntity.ok(
      new TeamResponse(team.get())
    );
  }

  @DeleteMapping("/{id}")
  @Transactional // WHAT IS THIS? (without: No EntityManager with actual transaction available for current thread - cannot reliably process 'remove' call)
  public ResponseEntity<?> deleteTeam(Authentication authentication, @PathVariable Long id) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    Optional<User> user = userRepository.findById(userDetails.getId());

    Optional<Team> team = teamRepository.findById(id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No team exists with this id."));

    for (TeamMember member : user.get().getMemberTeams()) {
      if (member.getTeam().getId() == id && !member.isManager()) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("You do not have the authority to make this change."));
      }
    }

    teamRepository.delete(team.get());

    return ResponseEntity.ok(
            new TeamResponse(team.get())
    );
  }

  @GetMapping("/{id}/members")
  public ResponseEntity<?> getMembers(Authentication authentication, @PathVariable Long id) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    Optional<User> user = userRepository.findById(userDetails.getId());

    Optional<Team> team = teamRepository.findById(id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No team exists with this id."));

    if(!user.get().getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(id)) return ResponseEntity
            .badRequest()
            .body(new MessageResponse("You are not a member of this team."));

    Set<TeamMember> teamMembers = team.get().getTeamMembers();

    List<MemberResponse> responseMembers = teamMembers
      .stream()
      .map(
        member ->
          new MemberResponse(member)
      )
      .toList();

    return ResponseEntity.ok(new MembersResponse(responseMembers));
  }

  @PostMapping("/{id}/members")
  public ResponseEntity<?> addMember(
    Authentication authentication,
    @PathVariable Long id,
    @Valid @RequestBody MemberRequest memberRequest
  ) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    Optional<User> user = userRepository.findById(userDetails.getId());

    Optional<Team> team = teamRepository.findById(id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No team exists with this id."));

    if(!user.get().getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(id)) return ResponseEntity
            .badRequest()
            .body(new MessageResponse("You are not a member of this team."));

    for (TeamMember member : user.get().getMemberTeams()) {
      if (member.getTeam().getId() == id && !member.isManager()) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("You do not have the authority to make this change."));
      }
    }

    Optional<User> userToAdd = userRepository.findById(memberRequest.getId());

    if (userToAdd.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No user exists with this id."));

    Set<TeamMember> memberTeams = userToAdd.get().getMemberTeams();

    List<Team> teams = memberTeams
      .stream()
      .map(memberTeam -> memberTeam.getTeam())
      .toList();

    if (teams.contains(team.get())) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("User is already a member of this team."));

    TeamMember teamMember = new TeamMember(
      ERole.ROLE_MEMBER,
      userToAdd.get(),
      team.get()
    );

    teamMemberRepository.save(teamMember);

    return ResponseEntity.ok(new UserResponse(
            userToAdd.get()
    ));
  }

  @DeleteMapping("/{id}/members/{user_id}")
  @Transactional
  public ResponseEntity<?> deleteMember(
    Authentication authentication,
    @PathVariable Long id,
    @PathVariable Long user_id
  ) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    Optional<User> user = userRepository.findById(userDetails.getId());

    Optional<Team> team = teamRepository.findById(id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No team exists with this id."));

    Optional<User> userToDelete = userRepository.findById(user_id);

    if (userToDelete.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No user exists with this id."));

    for (TeamMember member : user.get().getMemberTeams()) {
      if (member.getTeam().getId() == id && !member.isManager() && member.getMember().getId() != user_id) {
        return ResponseEntity
                .badRequest()
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

    return ResponseEntity.ok(new UserResponse(userToDelete.get()));
  }
}
