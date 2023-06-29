package com.huddle.api.event;

import com.huddle.api.eventparticipant.DbEventParticipant;
import com.huddle.api.eventparticipant.EAttendance;
import com.huddle.api.eventparticipant.EventParticipantService;
import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamService;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserService;
import com.huddle.core.email.EmailSender;
import com.huddle.core.exceptions.BadRequestException;
import com.huddle.core.exceptions.NotFoundException;
import com.huddle.core.persistence.Transactor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class EventService {
    @Autowired
    TeamService teamService;

    @Autowired
    UserService userService;

    @Autowired
    EventParticipantService eventParticipantService;

    @Autowired
    EmailSender emailSender;

    @Autowired
    Transactor transactor;

    public List<DbEvent> getEventsUserIsPartOf(Long teamId, Long userId) {
        return transactor.call(session -> {
                    DbTeam dbTeam = teamService.getTeam(teamId);

                    Set<DbEvent> dbEvents = dbTeam.getEvents();

                    dbEvents.removeIf(dbEvent ->
                            !dbEvent.getEventParticipants()
                                    .stream()
                                    .map(dbEventParticipant ->
                                            dbEventParticipant.getParticipant().getId()
                                    )
                                    .toList()
                                    .contains(userId)
                    );

                    return dbEvents.stream()
                            .toList();
                }
        );
    }

    public DbEvent createEvent(
            EventRequest eventRequest,
            Long teamId
    ) {
        if (!eventRequest.getEndTime().isAfter(eventRequest.getStartTime())) {
            throw new BadRequestException("Start time must be before end time.");
        }

        return transactor.call(session -> {
                    DbTeam dbTeam = teamService.getTeam(teamId);

                    DbEvent dbEvent = new DbEvent(
                            eventRequest.getName(),
                            eventRequest.getNotes(),
                            eventRequest.getAddress(),
                            eventRequest.getEventType(),
                            dbTeam,
                            eventRequest.getStartTime(),
                            eventRequest.getEndTime(),
                            eventRequest.getTeamScore(),
                            eventRequest.getOpponentScore()
                    );

                    session.save(dbEvent);

                    for (Long participantId : eventRequest.getParticipantIds()) {
                        try {
                            DbUser participant = userService.getUser(participantId);

                            DbEventParticipant dbEventParticipant = new DbEventParticipant(
                                    EAttendance.UNDECIDED,
                                    participant,
                                    dbEvent
                            );

                            session.save(dbEventParticipant);

                            Map<String, Object> variables = new HashMap<>();
                            variables.put("name", participant.getFirstName());
                            variables.put("address", dbEvent.getAddress());
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
                        } catch (NotFoundException ignored) {
                        }
                    }

                    return dbEvent;
                }
        );
    }

    public DbEvent getEvent(
            Long teamId,
            Long eventId
    ) {
        return transactor.call(session ->
                session.createCriteria(DbEvent.class)
                        .addEq("id", eventId)
                        .addEq("team.id", teamId)
                        .uniqueResult()
        );
    }

    public void deleteEvent(
            Long teamId,
            Long eventId
    ) {
        transactor.call(session -> {
                    session.delete(getEvent(teamId, eventId));
                    return true;
                }
        );
    }

    public DbEvent updateEvent(
            EventRequest eventRequest,
            Long teamId,
            Long eventId
    ) {
        return transactor.call(session -> {
                    DbEvent dbEvent = getEvent(teamId, eventId);

                    if (!eventRequest.getEndTime().isAfter(eventRequest.getStartTime())) {
                        throw new BadRequestException("Start time must be before end time.");
                    }

                    dbEvent.setEventType(eventRequest.getEventType());
                    dbEvent.setName(eventRequest.getName());
                    dbEvent.setNotes(eventRequest.getNotes());
                    dbEvent.setAddress(eventRequest.getAddress());
                    dbEvent.setStartTime(eventRequest.getStartTime());
                    dbEvent.setEndTime(eventRequest.getEndTime());
                    dbEvent.setTeamScore(eventRequest.getTeamScore());
                    dbEvent.setOpponentScore(eventRequest.getOpponentScore());

                    List<Long> currentParticipantIds = eventParticipantService.getEventParticipants(eventId)
                            .stream()
                            .map(currentParticipant ->
                                    currentParticipant.getParticipant().getId()
                            )
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

                                session.save(dbEventParticipant);

                                Map<String, Object> variables = new HashMap<>();
                                variables.put("name", participant.getFirstName());
                                variables.put("address", dbEvent.getAddress());
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
                            } catch (NotFoundException ignored) {
                            }
                        }
                    }

                    for (Long participantId : currentParticipantIds) {
                        if (!eventRequest.getParticipantIds().contains(participantId)) {
                            try {
                                DbEventParticipant dbEventParticipant = eventParticipantService.getEventParticipantByUserAndEvent(
                                        session,
                                        eventId,
                                        participantId
                                );

                                session.delete(dbEventParticipant);

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
                            } catch (NotFoundException ignored) {
                            }
                        }
                    }

                    return session.update(dbEvent);
                }
        );
    }
}
