package com.huddle.backend.controllers;

import com.huddle.backend.models.*;
import com.huddle.backend.payload.request.*;
import com.huddle.backend.payload.response.*;
import com.huddle.backend.repository.*;
import java.util.*;
import javax.validation.Valid;

import com.huddle.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
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

    Optional<User> user = userRepository.findById(userDetails.getId());

    Optional<Team> team = teamRepository.findById(team_id);

    if(!user.get().getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(team_id)) return ResponseEntity
            .badRequest()
            .body(new MessageResponse("You are not a member of this team."));

    if (team.isEmpty()) return ResponseEntity
            .badRequest()
            .body(new MessageResponse("No team exists with this id."));

    Set<Event> events = team.get().getEvents();

    for(Event event : events) {
      Optional<EventParticipant> eventParticipant = eventParticipantRepository.findByParticipantIdAndEventId(user.get().getId(), event.getId());

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

    Optional<User> user = userRepository.findById(userDetails.getId());

    Optional<Team> team = teamRepository.findById(team_id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No team exists with this id."));

    for (TeamMember member : user.get().getMemberTeams()) {
      if (member.getTeam().getId() == team_id && !member.isManager()) {
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

    Event event = new Event(
      eventRequest.getName(),
      eventRequest.getEventType(),
      team.get(),
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

    Optional<User> user = userRepository.findById(userDetails.getId());

    Optional<Team> team = teamRepository.findById(team_id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No team exists with this id."));

    Optional<Event> event = eventRepository.findByIdAndTeamId(
      event_id,
      team_id
    );

    if (event.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No event exists with this id on that team."));

    Optional<EventParticipant> eventParticipant = eventParticipantRepository.findByParticipantIdAndEventId(user.get().getId(), event.get().getId());

    if (eventParticipant.isEmpty()) return ResponseEntity
            .badRequest()
            .body(new MessageResponse("You are not a participant of this event."));

    return ResponseEntity.ok(new EventResponse(event.get()));
  }

  @DeleteMapping("{event_id}")
  @Transactional
  public ResponseEntity<?> deleteEvent(
          Authentication authentication,
          @PathVariable Long team_id,
          @PathVariable Long event_id
  ) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    Optional<User> user = userRepository.findById(userDetails.getId());

    Optional<Team> team = teamRepository.findById(team_id);

    if (team.isEmpty()) return ResponseEntity
            .badRequest()
            .body(new MessageResponse("No team exists with this id."));

    Optional<Event> event = eventRepository.findByIdAndTeamId(
            event_id,
            team_id
    );

    if (event.isEmpty()) return ResponseEntity
            .badRequest()
            .body(new MessageResponse("No event exists with this id on that team."));

    for (TeamMember member : user.get().getMemberTeams()) {
      if (member.getTeam().getId() == team_id && !member.isManager()) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("You do not have the authority to make this change."));
      }
    }

    eventRepository.delete(event.get());

    return ResponseEntity.ok(new EventResponse(event.get()));
  }

  @PatchMapping("/{event_id}")
  public ResponseEntity<?> updateEvent(
    Authentication authentication,
    @Valid @RequestBody EventRequest eventRequest,
    @PathVariable Long team_id,
    @PathVariable Long event_id
  ) {
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    Optional<User> user = userRepository.findById(userDetails.getId());

    Optional<Team> team = teamRepository.findById(team_id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No team exists with this id."));

    Optional<Event> event = eventRepository.findByIdAndTeamId(
      event_id,
      team_id
    );

    if (event.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No event exists with this id on that team."));

    for (TeamMember member : user.get().getMemberTeams()) {
      if (member.getTeam().getId() == team_id && !member.isManager()) {
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

    event.get().setEventType(eventRequest.getEventType());
    event.get().setName(eventRequest.getName());
    event.get().setStartTime(eventRequest.getStartTime());
    event.get().setEndTime(eventRequest.getEndTime());
    event.get().setTeamScore(eventRequest.getTeamScore());
    event.get().setOpponentScore(eventRequest.getOpponentScore());

    eventRepository.save(event.get());

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
          event.get()
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
      new EventResponse(event.get())
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

    Optional<User> user = userRepository.findById(userDetails.getId());

    if (user.get().getId() != user_id) return ResponseEntity
            .badRequest()
            .body(new MessageResponse("You do not have the authority to make this change."));

    Optional<Team> team = teamRepository.findById(team_id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No team exists with this id."));

    Optional<Event> event = eventRepository.findByIdAndTeamId(
      event_id,
      team_id
    );

    if (event.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No event exists with this id on that team."));

    Optional<EventParticipant> eventParticipant = eventParticipantRepository.findByParticipantIdAndEventId(
      user_id,
      event_id
    );

    if (eventParticipant.isEmpty()) return ResponseEntity
      .badRequest()
      .body(new MessageResponse("No participant for that event exists with that user_id"));

    eventParticipant
      .get()
      .setAttendance(eventParticipantRequest.getAttendance());

    eventParticipantRepository.save(eventParticipant.get());
    
    return ResponseEntity.ok(
      new EventParticipantResponse(eventParticipant.get())
    );
  }
}
