package com.huddle.api.eventparticipant;

import com.huddle.api.event.EventRepository;
import com.huddle.api.payload.response.MessageResponse;
import com.huddle.api.security.services.UserDetailsImpl;
import com.huddle.api.team.TeamRepository;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams/{team_id}/events/{event_id}/participants")
public class EventParticipantController {

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    UserRepository userRepository;
    @Autowired
    EventParticipantRepository eventParticipantRepository;

    @GetMapping("")
    public ResponseEntity<?> getEventParticipants(
            @PathVariable Long event_id
    ) {
        List<DbEventParticipant> dbEventParticipants = eventParticipantRepository.findAllByEventId(
                event_id
        );

        List<EventParticipantResponse> responseEventParticipants = dbEventParticipants
                .stream()
                .map(EventParticipantResponse::new)
                .toList();

        return ResponseEntity.ok(new EventParticipantsResponse(responseEventParticipants));
    }

    @PatchMapping("/{user_id}") // Should I get by user_id or participant_id?
    public ResponseEntity<?> updateEventParticipant(
            Authentication authentication,
            @Valid @RequestBody EventParticipantRequest eventParticipantRequest,
            @PathVariable Long team_id,
            @PathVariable Long event_id,
            @PathVariable Long user_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbUser dbUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        if (!dbUser.getId().equals(user_id)) return ResponseEntity
                .badRequest()
                .body(new MessageResponse("You do not have the authority to make this change."));

        teamRepository.findById(team_id).orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));

        eventRepository.findByIdAndTeamId(event_id, team_id)
                .orElseThrow(() -> new EntityNotFoundException("No event exists with this id."));

        DbEventParticipant dbEventParticipant = eventParticipantRepository
                .findByParticipantIdAndEventId(user_id, event_id).orElseThrow(() -> new EntityNotFoundException("No participant exists with this id."));

        dbEventParticipant
                .setAttendance(eventParticipantRequest.getAttendance());

        eventParticipantRepository.save(dbEventParticipant);

        return ResponseEntity.ok(new EventParticipantResponse(dbEventParticipant));
    }
}
