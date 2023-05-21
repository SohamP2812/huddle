package com.huddle.api.eventparticipant;

import com.huddle.api.security.services.UserDetailsImpl;
import com.huddle.core.exceptions.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams/{team_id}/events/{event_id}/participants")
public class EventParticipantController {

    @Autowired
    EventParticipantService eventParticipantService;

    @GetMapping("")
    public ResponseEntity<?> getEventParticipants(@PathVariable Long event_id) {
        List<DbEventParticipant> dbEventParticipants = eventParticipantService.getEventParticipants(event_id);

        List<EventParticipantResponse> responseEventParticipants = dbEventParticipants
                .stream()
                .map(EventParticipantResponse::new)
                .toList();

        return ResponseEntity.ok(new EventParticipantsResponse(responseEventParticipants));
    }

    @PatchMapping("/{user_id}")
    public ResponseEntity<?> updateEventParticipant(
            Authentication authentication,
            @Valid @RequestBody EventParticipantRequest eventParticipantRequest,
            @PathVariable Long event_id,
            @PathVariable Long user_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if (userDetails.getId() != user_id) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        DbEventParticipant dbEventParticipant = eventParticipantService.updateEventParticipant(eventParticipantRequest, event_id, user_id);

        return ResponseEntity.ok(new EventParticipantResponse(dbEventParticipant));
    }
}
