package com.huddle.api.event;

import com.huddle.api.eventparticipant.DbEventParticipant;
import com.huddle.api.eventparticipant.EAttendance;
import com.huddle.api.eventparticipant.EventParticipantRepository;
import com.huddle.api.eventparticipant.EventParticipantService;
import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamService;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserService;
import com.huddle.core.email.EmailSender;
import com.huddle.core.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class EventService {
    @Autowired
    EventRepository eventRepository;

    @Autowired
    EventParticipantRepository eventParticipantRepository;

    @Autowired
    TeamService teamService;

    @Autowired
    UserService userService;

    @Autowired
    EventParticipantService eventParticipantService;

    @Autowired
    EmailSender emailSender;

    public List<DbEvent> getEventsUserIsPartOf(Long teamId, Long userId) {
        DbTeam dbTeam = teamService.getTeam(teamId);

        Set<DbEvent> dbEvents = dbTeam.getEvents();

        dbEvents.removeIf(dbEvent -> !dbEvent.getEventParticipants().stream().map(dbEventParticipant -> dbEventParticipant.getParticipant().getId()).toList().contains(userId));

        return dbEvents.stream()
                .toList();
    }

    public DbEvent createEvent(
            EventRequest eventRequest,
            Long teamId
    ) {
        if (!eventRequest.getEndTime().isAfter(eventRequest.getStartTime())) {
            throw new BadRequestException("Start time must be before end time.");
        }

        DbTeam dbTeam = teamService.getTeam(teamId);

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
            try {
                DbUser participant = userService.getUser(participantId);

                DbEventParticipant dbEventParticipant = new DbEventParticipant(
                        EAttendance.UNDECIDED,
                        participant,
                        dbEvent
                );

                eventParticipantRepository.save(dbEventParticipant);

                Map<String, Object> variables = new HashMap<>();
                variables.put("name", participant.getFirstName());
                variables.put("teamName", dbTeam.getName());
                variables.put("eventName", dbEvent.getName());
                variables.put("eventType", dbEvent.getEventType().toString());
                DateTimeFormatter dateTimeFormatter = DateTimeFormatter
                        .ofPattern("EEEE MMMM dd, yyyy hh:mm a");
                variables.put("startTime", dbEvent.getStartTime().atZoneSameInstant(ZoneId.of("UTC")).toOffsetDateTime().format(dateTimeFormatter) + " UTC");
                variables.put("endTime", dbEvent.getEndTime().atZoneSameInstant(ZoneId.of("UTC")).toOffsetDateTime().format(dateTimeFormatter) + " UTC");

                emailSender.sendNow(
                        participant.getEmail(),
                        "AddedToEvent",
                        variables,
                        "You've Been Added to an Event!"
                );
            } catch (EntityNotFoundException ignored) {
            }
        }

        return dbEvent;
    }

    public DbEvent getEvent(
            Long teamId,
            Long eventId
    ) {
        return eventRepository.findByIdAndTeamId(eventId, teamId)
                .orElseThrow(() -> new EntityNotFoundException("No event exists with this id."));
    }

    public void deleteEvent(
            Long teamId,
            Long eventId
    ) {
        DbEvent dbEvent = getEvent(teamId, eventId);

        eventRepository.delete(dbEvent);
    }

    public DbEvent updateEvent(
            EventRequest eventRequest,
            Long teamId,
            Long eventId
    ) {
        DbEvent dbEvent = getEvent(teamId, eventId);

        if (!eventRequest.getEndTime().isAfter(eventRequest.getStartTime())) {
            throw new BadRequestException("Start time must be before end time.");
        }

        dbEvent.setEventType(eventRequest.getEventType());
        dbEvent.setName(eventRequest.getName());
        dbEvent.setStartTime(eventRequest.getStartTime());
        dbEvent.setEndTime(eventRequest.getEndTime());
        dbEvent.setTeamScore(eventRequest.getTeamScore());
        dbEvent.setOpponentScore(eventRequest.getOpponentScore());

        List<Long> currentParticipantIds = eventParticipantService.getEventParticipants(eventId)
                .stream()
                .map(currentParticipant -> currentParticipant.getParticipant().getId())
                .toList();

        for (Long participantId : eventRequest.getParticipantIds()) {
            if (!currentParticipantIds.contains(participantId)) {
                try {
                    DbUser participant = userService.getUser(participantId);

                    DbEventParticipant dbEventParticipant = new DbEventParticipant(
                            EAttendance.UNDECIDED,
                            participant,
                            dbEvent
                    );

                    eventParticipantRepository.save(dbEventParticipant);

                    Map<String, Object> variables = new HashMap<>();
                    variables.put("name", participant.getFirstName());
                    variables.put("teamName", dbEvent.getTeam().getName());
                    variables.put("eventName", dbEvent.getName());
                    variables.put("eventType", dbEvent.getEventType().toString());
                    DateTimeFormatter dateTimeFormatter = DateTimeFormatter
                            .ofPattern("EEEE MMMM dd, yyyy hh:mm a");
                    variables.put("startTime", dbEvent.getStartTime().atZoneSameInstant(ZoneId.of("UTC")).toOffsetDateTime().format(dateTimeFormatter) + " UTC");
                    variables.put("endTime", dbEvent.getEndTime().atZoneSameInstant(ZoneId.of("UTC")).toOffsetDateTime().format(dateTimeFormatter) + " UTC");

                    emailSender.sendNow(
                            participant.getEmail(),
                            "AddedToEvent",
                            variables,
                            "You've Been Added to an Event!"
                    );
                } catch (EntityNotFoundException ignored) {
                }
            }
        }

        for (Long participantId : currentParticipantIds) {
            if (!eventRequest.getParticipantIds().contains(participantId)) {
                try {
                    DbEventParticipant dbEventParticipant = eventParticipantService.getEventParticipantByUserAndEvent(participantId, eventId);

                    eventParticipantRepository.delete(dbEventParticipant);

                    Map<String, Object> variables = new HashMap<>();
                    variables.put("name", dbEventParticipant.getParticipant().getFirstName());
                    variables.put("teamName", dbEvent.getTeam().getName());
                    variables.put("eventName", dbEvent.getName());
                    variables.put("eventType", dbEvent.getEventType().toString());
                    DateTimeFormatter dateTimeFormatter = DateTimeFormatter
                            .ofPattern("EEEE MMMM dd, yyyy hh:mm a");
                    variables.put("startTime", dbEvent.getStartTime().atZoneSameInstant(ZoneId.of("UTC")).toOffsetDateTime().format(dateTimeFormatter) + " UTC");
                    variables.put("endTime", dbEvent.getEndTime().atZoneSameInstant(ZoneId.of("UTC")).toOffsetDateTime().format(dateTimeFormatter) + " UTC");

                    emailSender.sendNow(
                            dbEventParticipant.getParticipant().getEmail(),
                            "RemovedFromEvent",
                            variables,
                            "You've Been Added to an Event!"
                    );
                } catch (EntityNotFoundException ignored) {
                }
            }
        }

        return eventRepository.save(dbEvent);
    }
}