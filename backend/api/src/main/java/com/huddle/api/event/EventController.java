package com.huddle.api.event;

import com.huddle.api.eventparticipant.EAttendance;
import com.huddle.api.eventparticipant.DbEventParticipant;
import com.huddle.api.eventparticipant.EventParticipantRepository;
import com.huddle.api.exception.UnauthorizedException;
import com.huddle.api.payload.response.MessageResponse;
import com.huddle.api.security.services.UserDetailsImpl;
import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamRepository;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.api.teammember.TeamMemberRepository;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserRepository;
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

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        DbTeam dbTeam = teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        if (!dbUser.getMemberTeams().stream().map(memberTeam -> memberTeam.getTeam().getId()).toList().contains(team_id))
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("You are not a member of this team."));

        Set<DbEvent> dbEvents = dbTeam.getEvents();

        for (DbEvent dbEvent : dbEvents) {
            Optional<DbEventParticipant> eventParticipant = eventParticipantRepository.findByParticipantIdAndEventId(dbUser.getId(), dbEvent.getId());

            if (eventParticipant.isEmpty()) dbEvents.remove(dbEvent);
        }

        List<EventResponse> responseEvents = dbEvents
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

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        DbTeam dbTeam = teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        for (DbTeamMember member : dbUser.getMemberTeams()) {
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

        DbEvent dbEvent = new DbEvent(
                eventRequest.getName(),
                eventRequest.getEventType(),
                dbTeam,
                eventRequest.getStartTime(),
                eventRequest.getEndTime(),
                eventRequest.getTeamScore(),
                eventRequest.getOpponentScore()
        );

        eventRepository.save(dbEvent);

        for (Long participantId : eventRequest.getParticipantIds()) {
            Optional<DbUser> participant = userRepository.findById(participantId);

            if (participant.isEmpty()) continue;

            Optional<DbTeamMember> teamMember = teamMemberRepository.findByTeamIdAndMemberId(team_id, participantId);

            if (teamMember.isEmpty()) continue;

            DbEventParticipant dbEventParticipant = new DbEventParticipant(
                    EAttendance.UNDECIDED,
                    participant.get(),
                    dbEvent
            );

            eventParticipantRepository.save(dbEventParticipant);
        }

        return ResponseEntity.ok(new com.huddle.api.event.EventResponse(dbEvent));
    }

    @GetMapping("/{event_id}")
    public ResponseEntity<?> getEvent(
            Authentication authentication,
            @PathVariable Long team_id,
            @PathVariable Long event_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        DbEvent dbEvent = eventRepository.findByIdAndTeamId(event_id, team_id)
                .orElseThrow(() -> new EntityNotFoundException("No event exists with this id."));

        eventParticipantRepository.findByParticipantIdAndEventId(dbUser.getId(), dbEvent.getId())
                .orElseThrow(() -> new UnauthorizedException("You are not a participant of this event."));

        return ResponseEntity.ok(new EventResponse(dbEvent));
    }

    @DeleteMapping("{event_id}")
    @Transactional
    public ResponseEntity<?> deleteEvent(
            Authentication authentication,
            @PathVariable Long team_id,
            @PathVariable Long event_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        DbEvent dbEvent = eventRepository.findByIdAndTeamId(event_id, team_id)
                .orElseThrow(() -> new EntityNotFoundException("No event exists with this id."));

        for (DbTeamMember member : dbUser.getMemberTeams()) {
            if (member.getTeam().getId().equals(team_id) && !member.isManager()) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("You do not have the authority to make this change."));
            }
        }

        eventRepository.delete(dbEvent);

        return ResponseEntity.ok(new EventResponse(dbEvent));
    }

    @PatchMapping("/{event_id}")
    public ResponseEntity<?> updateEvent(
            Authentication authentication,
            @Valid @RequestBody EventRequest eventRequest,
            @PathVariable Long team_id,
            @PathVariable Long event_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        DbEvent dbEvent = eventRepository.findByIdAndTeamId(event_id, team_id).
                orElseThrow(() -> new EntityNotFoundException("No event exists with this id."));

        for (DbTeamMember member : dbUser.getMemberTeams()) {
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

        dbEvent.setEventType(eventRequest.getEventType());
        dbEvent.setName(eventRequest.getName());
        dbEvent.setStartTime(eventRequest.getStartTime());
        dbEvent.setEndTime(eventRequest.getEndTime());
        dbEvent.setTeamScore(eventRequest.getTeamScore());
        dbEvent.setOpponentScore(eventRequest.getOpponentScore());

        eventRepository.save(dbEvent);

        List<DbEventParticipant> currentParticipants = eventParticipantRepository.findAllByEventId(
                event_id
        );

        List<Long> currentParticipantIds = currentParticipants
                .stream()
                .map(currentParticipant -> currentParticipant.getParticipant().getId())
                .toList();

        // Add all event participants that do not currently exist but are in updated list
        for (Long participantId : eventRequest.getParticipantIds()) {
            if (!currentParticipantIds.contains(participantId)) {
                Optional<DbUser> participant = userRepository.findById(participantId);

                if (participant.isEmpty()) continue;

                DbEventParticipant dbEventParticipant = new DbEventParticipant(
                        EAttendance.UNDECIDED,
                        participant.get(),
                        dbEvent
                );

                eventParticipantRepository.save(dbEventParticipant);
            }
        }

        // Delete all event participants that currently exist but are not in updated list
        for (Long participantId : currentParticipantIds) {
            if (!eventRequest.getParticipantIds().contains(participantId)) {
                Optional<DbEventParticipant> eventParticipant = eventParticipantRepository.findByParticipantIdAndEventId(
                        participantId,
                        event_id
                );

                if (eventParticipant.isEmpty()) continue;

                eventParticipantRepository.delete(eventParticipant.get());
            }
        }

        // Can I return the edited instance or do I need to re-fetch for confirmation
        return ResponseEntity.ok(
                new EventResponse(dbEvent)
        );
    }
}
