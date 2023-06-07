package com.huddle.api.event;

import com.huddle.api.eventparticipant.DbEventParticipant;
import com.huddle.api.team.DbTeam;
import com.huddle.core.persistence.DbTimestampedEntity;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "events")
public class DbEvent extends DbTimestampedEntity {
    @NotNull
    @Size(max = 20)
    private String name;

    @NotNull
    @Size(max = 800)
    private String notes;

    @NotNull
    @Size(max = 250)
    private String address;

    @NotNull
    @Enumerated(EnumType.STRING)
    private EEvent eventType;

    @NotNull
    private OffsetDateTime startTime;

    @NotNull
    private OffsetDateTime endTime;

    @NotNull
    @ManyToOne
    private DbTeam team;

    @OneToMany(mappedBy = "event", cascade = CascadeType.REMOVE)
    private Set<DbEventParticipant> eventParticipants = new HashSet<>();

    private Integer teamScore;

    private Integer opponentScore;

    public DbEvent() {
    }

    public DbEvent(
            String name,
            String notes,
            String address,
            EEvent eventType,
            DbTeam team,
            OffsetDateTime startTime,
            OffsetDateTime endTime,
            Integer teamScore,
            Integer opponentScore
    ) {
        this.name = name;
        this.notes = notes;
        this.address = address;
        this.eventType = eventType;
        this.team = team;
        this.startTime = startTime;
        this.endTime = endTime;
        this.teamScore = teamScore;
        this.opponentScore = opponentScore;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public DbTeam getTeam() {
        return team;
    }

    public void setTeam(DbTeam team) {
        this.team = team;
    }

    public OffsetDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(OffsetDateTime startTime) {
        this.startTime = startTime;
    }

    public OffsetDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(OffsetDateTime endTime) {
        this.endTime = endTime;
    }

    public EEvent getEventType() {
        return eventType;
    }

    public void setEventType(EEvent eventType) {
        this.eventType = eventType;
    }

    public Integer getTeamScore() {
        return teamScore;
    }

    public void setTeamScore(Integer teamScore) {
        this.teamScore = teamScore;
    }

    public Integer getOpponentScore() {
        return opponentScore;
    }

    public void setOpponentScore(Integer opponentScore) {
        this.opponentScore = opponentScore;
    }

    public Set<DbEventParticipant> getEventParticipants() {
        return eventParticipants;
    }

    public void setEventParticipants(Set<DbEventParticipant> eventParticipants) {
        this.eventParticipants = eventParticipants;
    }
}
