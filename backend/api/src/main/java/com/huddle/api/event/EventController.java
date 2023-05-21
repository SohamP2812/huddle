package com.huddle.api.event;

import com.huddle.api.security.services.UserDetailsImpl;
import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamService;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.api.teammember.TeamMemberService;
import com.huddle.core.exceptions.UnauthorizedException;
import com.huddle.core.payload.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams/{team_id}/events")
public class EventController {
    @Autowired
    TeamService teamService;

    @Autowired
    TeamMemberService teamMemberService;

    @Autowired
    EventService eventService;

    @GetMapping("")
    public ResponseEntity<?> getEvents(Authentication authentication, @PathVariable Long team_id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<DbTeamMember> dbTeamMembers = teamMemberService.getMembers(team_id);

        if (!dbTeamMembers.stream().map(dbTeamMember -> dbTeamMember.getMember().getId()).toList().contains(userDetails.getId())) {
            throw new UnauthorizedException("You are not a member of this team.");
        }

        List<DbEvent> dbEvents = eventService.getEventsUserIsPartOf(team_id, userDetails.getId());

        List<EventResponse> responseEvents = dbEvents
                .stream()
                .map(EventResponse::new)
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

        DbTeam dbTeam = teamService.getTeam(team_id);

        if (dbTeam.getManager().getId() != userDetails.getId()) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        DbEvent dbEvent = eventService.createEvent(eventRequest, team_id);

        return ResponseEntity.ok(new EventResponse(dbEvent));
    }

    @GetMapping("/{event_id}")
    public ResponseEntity<?> getEvent(
            Authentication authentication,
            @PathVariable Long team_id,
            @PathVariable Long event_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbEvent dbEvent = eventService.getEvent(team_id, event_id);

        if (!dbEvent.getEventParticipants().stream().map(dbEventParticipant -> dbEventParticipant.getParticipant().getId()).toList().contains(userDetails.getId())) {
            throw new UnauthorizedException("You are not a participant of this event.");
        }

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

        DbTeam dbTeam = teamService.getTeam(team_id);

        if (dbTeam.getManager().getId() != userDetails.getId()) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        eventService.deleteEvent(team_id, event_id);

        return ResponseEntity.ok(new MessageResponse("Event deleted successfully!"));
    }

    @PatchMapping("/{event_id}")
    public ResponseEntity<?> updateEvent(
            Authentication authentication,
            @Valid @RequestBody EventRequest eventRequest,
            @PathVariable Long team_id,
            @PathVariable Long event_id
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        DbTeam dbTeam = teamService.getTeam(team_id);

        if (dbTeam.getManager().getId() != userDetails.getId()) {
            throw new UnauthorizedException("You do not have the authority to make this change.");
        }

        DbEvent dbEvent = eventService.updateEvent(eventRequest, team_id, event_id);

        return ResponseEntity.ok(new EventResponse(dbEvent));
    }
}
