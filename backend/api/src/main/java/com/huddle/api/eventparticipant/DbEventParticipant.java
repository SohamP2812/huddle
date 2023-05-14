package com.huddle.api.eventparticipant;

import com.huddle.api.event.DbEvent;
import com.huddle.api.user.DbUser;
import com.huddle.core.persistence.DbTimestampedEntity;

import javax.persistence.*;

@Entity
@Table(name = "event_participants")
public class DbEventParticipant extends DbTimestampedEntity {
    @Enumerated(EnumType.STRING)
    private EAttendance attendance;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private DbUser participant;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private DbEvent event;

    public DbEventParticipant() {
    }

    public DbEventParticipant(
            EAttendance attendance,
            DbUser participant,
            DbEvent event
    ) {
        this.attendance = attendance;
        this.participant = participant;
        this.event = event;
    }

    public EAttendance getAttendance() {
        return attendance;
    }

    public void setAttendance(EAttendance attendance) {
        this.attendance = attendance;
    }

    public DbUser getParticipant() {
        return participant;
    }

    public void setParticipant(DbUser participant) {
        this.participant = participant;
    }

    public DbEvent getEvent() {
        return event;
    }

    public void setEvent(DbEvent event) {
        this.event = event;
    }
}
