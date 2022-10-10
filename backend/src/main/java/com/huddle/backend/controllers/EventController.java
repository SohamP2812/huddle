package com.huddle.backend.controllers;

import com.huddle.backend.exception.UnauthorizedException;
import com.huddle.backend.models.*;
import com.huddle.backend.payload.request.*;
import com.huddle.backend.payload.response.*;
import com.huddle.backend.repository.*;
import java.util.*;
import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;

import com.huddle.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams/{team_id}/events")
public class EventController {
  @Autowired
  TeamRepository teamRepository;

  @Autowired
  EventRepository eventRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  EventParticipantRepository eventParticipantRepository;

  @Autowired
  TeamMemberRepository teamMemberRepository;


  @GetMapping("")
  public ResponseEntity<?> getEvents(Authentication authentication, @PathVariable Long team_id) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

    Team team = teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

    if(!user.getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(team_id)) return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(new MessageResponse("You are not a member of this team."));

    Set<Event> events = team.getEvents();

    for(Event event : events) {
      Optional<EventParticipant> eventParticipant = eventParticipantRepository.findByParticipantIdAndEventId(user.getId(), event.getId());

      if(eventParticipant.isEmpty()) events.remove(event);
    }

    List<EventResponse> responseEvents = events
            .stream()
            .map(event -> new EventResponse(event))
            .toList();

    return ResponseEntity.ok(new EventsResponse(responseEvents));
  }

  @PostMapping("")
  public ResponseEntity<?> createEvent(
    Authentication authentication,
    @Valid @RequestBody EventRequest eventRequest,
    @PathVariable Long team_id
  ) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

    Team team = teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

    for (TeamMember member : user.getMemberTeams()) {
      if (member.getTeam().getId().equals(team_id) && !member.isManager()) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("You do not have the authority to make this change."));
      }
    }

    if (eventRequest.getEndTime().compareTo(eventRequest.getStartTime()) <= 0) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Start time must be before end time."));
    }

    Event event = new Event(
      eventRequest.getName(),
      eventRequest.getEventType(),
      team,
      eventRequest.getStartTime(),
      eventRequest.getEndTime(),
      eventRequest.getTeamScore(),
      eventRequest.getOpponentScore()
    );

    eventRepository.save(event);

    for (Long participantId : eventRequest.getParticipantIds()) {
      Optional<User> participant = userRepository.findById(participantId);

      if (participant.isEmpty()) continue;

      Optional<TeamMember> teamMember = teamMemberRepository.findByTeamIdAndMemberId(team_id, participantId);

      if(teamMember.isEmpty()) continue;

      EventParticipant eventParticipant = new EventParticipant(
        EAttendance.UNDECIDED,
        participant.get(),
        event
      );

      eventParticipantRepository.save(eventParticipant);
    }

    return ResponseEntity.ok(new EventResponse(event));
  }

  @GetMapping("/{event_id}")
  public ResponseEntity<?> getEvent(
    Authentication authentication,
    @PathVariable Long team_id,
    @PathVariable Long event_id
  ) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

    teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

    Event event = eventRepository.findByIdAndTeamId(event_id, team_id)
            .orElseThrow(() -> new EntityNotFoundException("No event exists with this id."));

    eventParticipantRepository.findByParticipantIdAndEventId(user.getId(), event.getId())
            .orElseThrow(() -> new UnauthorizedException("You are not a participant of this event."));

    return ResponseEntity.ok(new EventResponse(event));
  }

  @DeleteMapping("{event_id}")
  @Transactional
  public ResponseEntity<?> deleteEvent(
          Authentication authentication,
          @PathVariable Long team_id,
          @PathVariable Long event_id
  ) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

    teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

    Event event = eventRepository.findByIdAndTeamId(event_id, team_id)
            .orElseThrow(() -> new EntityNotFoundException("No event exists with this id."));

    for (TeamMember member : user.getMemberTeams()) {
      if (member.getTeam().getId().equals(team_id) && !member.isManager()) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("You do not have the authority to make this change."));
      }
    }

    eventRepository.delete(event);

    return ResponseEntity.ok(new EventResponse(event));
  }

  @PatchMapping("/{event_id}")
  public ResponseEntity<?> updateEvent(
    Authentication authentication,
    @Valid @RequestBody EventRequest eventRequest,
    @PathVariable Long team_id,
    @PathVariable Long event_id
  ) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

    teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

    Event event = eventRepository.findByIdAndTeamId(event_id, team_id).
            orElseThrow(() -> new EntityNotFoundException("No event exists with this id."));

    for (TeamMember member : user.getMemberTeams()) {
      if (member.getTeam().getId().equals(team_id) && !member.isManager()) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("You do not have the authority to make this change."));
      }
    }

    if (eventRequest.getEndTime().compareTo(eventRequest.getStartTime()) <= 0) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Start time must be before end time."));
    }

    event.setEventType(eventRequest.getEventType());
    event.setName(eventRequest.getName());
    event.setStartTime(eventRequest.getStartTime());
    event.setEndTime(eventRequest.getEndTime());
    event.setTeamScore(eventRequest.getTeamScore());
    event.setOpponentScore(eventRequest.getOpponentScore());

    eventRepository.save(event);

    List<EventParticipant> currentParticipants = eventParticipantRepository.findAllByEventId(
      event_id
    );

    List<Long> currentParticipantIds = currentParticipants
      .stream()
      .map(currentParticipant -> currentParticipant.getParticipant().getId())
      .toList();

    // Add all event participants that do not currently exist but are in updated list
    for (Long participantId : eventRequest.getParticipantIds()) {
      if (!currentParticipantIds.contains(participantId)) {
        Optional<User> participant = userRepository.findById(participantId);

        if (participant.isEmpty()) continue;

        EventParticipant eventParticipant = new EventParticipant(
          EAttendance.UNDECIDED,
          participant.get(),
          event
        );

        eventParticipantRepository.save(eventParticipant);
      }
    }

    // Delete all event participants that currently exist but are not in updated list
    for (Long participantId : currentParticipantIds) {
      if (!eventRequest.getParticipantIds().contains(participantId)) {
        Optional<EventParticipant> eventParticipant = eventParticipantRepository.findByParticipantIdAndEventId(
          participantId,
          event_id
        );

        if (eventParticipant.isEmpty()) continue;

        eventParticipantRepository.delete(eventParticipant.get());
      }
    }

    // Can I return the edited instance or do I need to re-fetch for confirmation
    return ResponseEntity.ok(
      new EventResponse(event)
    );
  }

  @GetMapping("/{event_id}/participants")
  public ResponseEntity<?> getEventParticipants(
    @PathVariable Long team_id,
    @PathVariable Long event_id
  ) {
    List<EventParticipant> eventParticipants = eventParticipantRepository.findAllByEventId(
      event_id
    );

    List<EventParticipantResponse> responseEventParticipants = eventParticipants
      .stream()
      .map(eventParticipant ->new EventParticipantResponse(eventParticipant))
      .toList();

    return ResponseEntity.ok(new EventParticipantsResponse(responseEventParticipants));
  }

  @PatchMapping("/{event_id}/participants/{user_id}") // Should I get by user_id or participant_id?
  public ResponseEntity<?> updateEventParticipant(
    Authentication authentication,
    @Valid @RequestBody EventParticipantRequest eventParticipantRequest,
    @PathVariable Long team_id,
    @PathVariable Long event_id,
    @PathVariable Long user_id
  ) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

    if (!user.getId().equals(user_id)) return ResponseEntity
            .badRequest()
            .body(new MessageResponse("You do not have the authority to make this change."));

    teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

    eventRepository.findByIdAndTeamId(event_id, team_id)
            .orElseThrow(() -> new EntityNotFoundException("No event exists with this id."));

    EventParticipant eventParticipant = eventParticipantRepository
            .findByParticipantIdAndEventId(user_id, event_id).orElseThrow(() -> new EntityNotFoundException("No participant exists with this id."));

    eventParticipant
      .setAttendance(eventParticipantRequest.getAttendance());

    eventParticipantRepository.save(eventParticipant);

    return ResponseEntity.ok(new EventParticipantResponse(eventParticipant));
  }
}
