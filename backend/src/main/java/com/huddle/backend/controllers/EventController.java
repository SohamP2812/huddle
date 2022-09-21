package com.huddle.backend.controllers;

import javax.validation.Valid;

import com.huddle.backend.models.*;
import com.huddle.backend.payload.request.*;
import com.huddle.backend.payload.response.*;
import com.huddle.backend.repository.*;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.huddle.backend.security.jwt.JwtUtils;
import com.huddle.backend.security.services.UserDetailsImpl;

import java.lang.reflect.Member;
import java.util.*;

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
    public ResponseEntity<?> createEvent(@Valid @RequestBody EventRequest eventRequest, @PathVariable Long team_id) {
        Optional<Team> team = teamRepository.findById(team_id);

        if(team.isEmpty()) return ResponseEntity.badRequest().body("No team exists with this id.");

        Event event = new Event(eventRequest.getName(),
                eventRequest.getEventType(), team.get(),
                eventRequest.getStartTime(),
                eventRequest.getEndTime(),
                eventRequest.getTeamScore(),
                eventRequest.getOpponentScore());

        eventRepository.save(event);

        for(Long participantId : eventRequest.getParticipantIds()) {
            Optional<User> participant = userRepository.findById(participantId);

            if(participant.isEmpty()) continue;

            EventParticipant eventParticipant = new EventParticipant(EAttendance.UNDECIDED, participant.get(), event);

            eventParticipantRepository.save(eventParticipant);
        }

        return ResponseEntity.ok(new EventResponse(
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
                            team.get().getManager().getEmail()),
                        team.get().getSport()),
                event.getStartTime(),
                event.getEndTime(),
                event.getEventType(),
                event.getTeamScore(),
                event.getOpponentScore()));
    }

    @GetMapping("/{event_id}")
    public ResponseEntity<?> getEvent(@PathVariable Long team_id, @PathVariable Long event_id) {
        Optional<Team> team = teamRepository.findById(team_id);

        if(team.isEmpty()) return ResponseEntity.badRequest().body("No team exists with this id.");

        Optional<Event> event = eventRepository.findByIdAndTeamId(event_id, team_id);

        if(event.isEmpty()) return ResponseEntity.badRequest().body("No event exists with this id on that team.");

        return ResponseEntity.ok(new EventResponse(
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
                                event.get().getTeam().getManager().getEmail()),
                        event.get().getTeam().getSport()),
                event.get().getStartTime(),
                event.get().getEndTime(),
                event.get().getEventType(),
                event.get().getTeamScore(),
                event.get().getOpponentScore()));
    }

    @PatchMapping("/{event_id}")
    public ResponseEntity<?> updateEvent(@Valid @RequestBody EventRequest eventRequest, @PathVariable Long team_id, @PathVariable Long event_id) {
        Optional<Team> team = teamRepository.findById(team_id);

        if(team.isEmpty()) return ResponseEntity.badRequest().body("No team exists with this id.");

        Optional<Event> event = eventRepository.findByIdAndTeamId(event_id, team_id);

        if(event.isEmpty()) return ResponseEntity.badRequest().body("No event exists with this id on that team.");

        event.get().setEventType(eventRequest.getEventType());
        event.get().setName(eventRequest.getName());
        event.get().setStartTime(eventRequest.getStartTime());
        event.get().setEndTime(eventRequest.getEndTime());
        event.get().setTeamScore(eventRequest.getTeamScore());
        event.get().setOpponentScore(eventRequest.getOpponentScore());

        eventRepository.save(event.get());

        // Can I return the edited instance or do I need to refetch for confirmation
        return ResponseEntity.ok(new EventResponse(
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
                                event.get().getTeam().getManager().getEmail()),
                        event.get().getTeam().getSport()),
                event.get().getStartTime(),
                event.get().getEndTime(),
                event.get().getEventType(),
                event.get().getTeamScore(),
                event.get().getOpponentScore()));
    }
}