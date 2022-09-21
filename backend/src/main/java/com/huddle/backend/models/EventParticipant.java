package com.huddle.backend.models;

import javax.persistence.*;

@Entity
@Table(name = "event_participants")
public class EventParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private EAttendance attendance;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User participant;

    @ManyToOne
    @JoinColumn(name="event_id")
    private Event event;

    public EventParticipant() {
    }

    public EventParticipant(EAttendance attendance, User participant, Event event) {
        this.attendance = attendance;
        this.participant = participant;
        this.event = event;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EAttendance getAttendance() { return attendance; }

    public void setAttendance(EAttendance attendance) { this.attendance = attendance; }

    public User getParticipant() { return participant; }

    public void setParticipant(User participant) { this.participant = participant; }

    public Event getEvent() { return event; }

    public void setEvent(Event event) { this.event = event; }
}