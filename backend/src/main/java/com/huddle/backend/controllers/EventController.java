package com.huddle.backend.controllers;

import com.huddle.backend.models.*;
import com.huddle.backend.payload.request.*;
import com.huddle.backend.payload.response.*;
import com.huddle.backend.repository.*;
import java.util.*;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/teams/{team_id}/events")
public class EventController {
  @Autowired
  TeamRepository teamRepository;

  @Autowired
  EventRepository eventRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  EventParticipantRepository eventParticipantRepository;

  @PostMapping("")
  public ResponseEntity<?> createEvent(
    @Valid @RequestBody EventRequest eventRequest,
    @PathVariable Long team_id
  ) {
    Optional<Team> team = teamRepository.findById(team_id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body("No team exists with this id.");

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

      EventParticipant eventParticipant = new EventParticipant(
        EAttendance.UNDECIDED,
        participant.get(),
        event
      );

      eventParticipantRepository.save(eventParticipant);
    }

    return ResponseEntity.ok(
      new EventResponse(
        event.getId(),
        event.getName(),
        new TeamResponse(
          team.get().getId(),
          team.get().getName(),
          new UserResponse(
            team.get().getManager().getId(),
            team.get().getManager().getFirstName(),
            team.get().getManager().getLastName(),
            team.get().getManager().getUsername(),
            team.get().getManager().getEmail()
          ),
          team.get().getSport()
        ),
        event.getStartTime(),
        event.getEndTime(),
        event.getEventType(),
        event.getTeamScore(),
        event.getOpponentScore()
      )
    );
  }

  @GetMapping("/{event_id}")
  public ResponseEntity<?> getEvent(
    @PathVariable Long team_id,
    @PathVariable Long event_id
  ) {
    Optional<Team> team = teamRepository.findById(team_id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body("No team exists with this id.");

    Optional<Event> event = eventRepository.findByIdAndTeamId(
      event_id,
      team_id
    );

    if (event.isEmpty()) return ResponseEntity
      .badRequest()
      .body("No event exists with this id on that team.");

    return ResponseEntity.ok(
      new EventResponse(
        event.get().getId(),
        event.get().getName(),
        new TeamResponse(
          event.get().getTeam().getId(),
          event.get().getTeam().getName(),
          new UserResponse(
            event.get().getTeam().getManager().getId(),
            event.get().getTeam().getManager().getFirstName(),
            event.get().getTeam().getManager().getLastName(),
            event.get().getTeam().getManager().getUsername(),
            event.get().getTeam().getManager().getEmail()
          ),
          event.get().getTeam().getSport()
        ),
        event.get().getStartTime(),
        event.get().getEndTime(),
        event.get().getEventType(),
        event.get().getTeamScore(),
        event.get().getOpponentScore()
      )
    );
  }

  @PatchMapping("/{event_id}")
  public ResponseEntity<?> updateEvent(
    @Valid @RequestBody EventRequest eventRequest,
    @PathVariable Long team_id,
    @PathVariable Long event_id
  ) {
    Optional<Team> team = teamRepository.findById(team_id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body("No team exists with this id.");

    Optional<Event> event = eventRepository.findByIdAndTeamId(
      event_id,
      team_id
    );

    if (event.isEmpty()) return ResponseEntity
      .badRequest()
      .body("No event exists with this id on that team.");

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
      new EventResponse(
        event.get().getId(),
        event.get().getName(),
        new TeamResponse(
          event.get().getTeam().getId(),
          event.get().getTeam().getName(),
          new UserResponse(
            event.get().getTeam().getManager().getId(),
            event.get().getTeam().getManager().getFirstName(),
            event.get().getTeam().getManager().getLastName(),
            event.get().getTeam().getManager().getUsername(),
            event.get().getTeam().getManager().getEmail()
          ),
          event.get().getTeam().getSport()
        ),
        event.get().getStartTime(),
        event.get().getEndTime(),
        event.get().getEventType(),
        event.get().getTeamScore(),
        event.get().getOpponentScore()
      )
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

    List<UserResponse> users = eventParticipants
      .stream()
      .map(
        eventParticipant ->
          new UserResponse(
            eventParticipant.getParticipant().getId(),
            eventParticipant.getParticipant().getFirstName(),
            eventParticipant.getParticipant().getLastName(),
            eventParticipant.getParticipant().getUsername(),
            eventParticipant.getParticipant().getEmail()
          )
      )
      .toList();

    return ResponseEntity.ok(new UsersResponse(users));
  }

  @PatchMapping("/{event_id}/participants/{user_id}") // Should I get by user_id or participant_id?
  public ResponseEntity<?> updateEventParticipant(
    @Valid @RequestBody EventParticipantRequest eventParticipantRequest,
    @PathVariable Long team_id,
    @PathVariable Long event_id,
    @PathVariable Long user_id
  ) {
    Optional<Team> team = teamRepository.findById(team_id);

    if (team.isEmpty()) return ResponseEntity
      .badRequest()
      .body("No team exists with this id.");

    Optional<Event> event = eventRepository.findByIdAndTeamId(
      event_id,
      team_id
    );

    if (event.isEmpty()) return ResponseEntity
      .badRequest()
      .body("No event exists with this id on that team.");

    Optional<EventParticipant> eventParticipant = eventParticipantRepository.findByParticipantIdAndEventId(
      user_id,
      event_id
    );

    if (eventParticipant.isEmpty()) return ResponseEntity
      .badRequest()
      .body("No participant for that event exists with that user_id");

    eventParticipant
      .get()
      .setAttendance(eventParticipantRequest.getAttendance());

    eventParticipantRepository.save(eventParticipant.get());

    // No way this is how I should be doing this. Maybe I should either stop sending all objects associated with the main resource
    // or I can find a better way to construct the response rather than passing every field individually
    // ^^ I can just make the constructor of response to take in one param -> the actual model. Then constructor binds what it needs.
    // dependency injection??
    return ResponseEntity.ok(
      new EventParticipantResponse(
        eventParticipant.get().getId(),
        eventParticipant.get().getAttendance(),
        new UserResponse(
          eventParticipant.get().getParticipant().getId(),
          eventParticipant.get().getParticipant().getFirstName(),
          eventParticipant.get().getParticipant().getLastName(),
          eventParticipant.get().getParticipant().getUsername(),
          eventParticipant.get().getParticipant().getEmail()
        ),
        new EventResponse(
          eventParticipant.get().getEvent().getId(),
          eventParticipant.get().getEvent().getName(),
          new TeamResponse(
            eventParticipant.get().getEvent().getTeam().getId(),
            eventParticipant.get().getEvent().getTeam().getName(),
            new UserResponse(
              eventParticipant.get().getEvent().getTeam().getManager().getId(),
              eventParticipant
                .get()
                .getEvent()
                .getTeam()
                .getManager()
                .getFirstName(),
              eventParticipant
                .get()
                .getEvent()
                .getTeam()
                .getManager()
                .getLastName(),
              eventParticipant
                .get()
                .getEvent()
                .getTeam()
                .getManager()
                .getUsername(),
              eventParticipant
                .get()
                .getEvent()
                .getTeam()
                .getManager()
                .getEmail()
            ),
            eventParticipant.get().getEvent().getTeam().getSport()
          ),
          eventParticipant.get().getEvent().getStartTime(),
          eventParticipant.get().getEvent().getEndTime(),
          eventParticipant.get().getEvent().getEventType(),
          eventParticipant.get().getEvent().getTeamScore(),
          eventParticipant.get().getEvent().getOpponentScore()
        )
      )
    );
  }
}
