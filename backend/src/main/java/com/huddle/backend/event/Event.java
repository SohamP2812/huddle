package com.huddle.backend.event;

import com.huddle.backend.eventparticipant.EventParticipant;
import com.huddle.backend.team.Team;
import org.springframework.data.annotation.CreatedDate;
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
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    private OffsetDateTime createdAt;

    @NotNull
    @Size(max = 20)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EEvent eventType;

    @NotNull
    @Column(name = "start_time")
    private OffsetDateTime startTime;

    @NotNull
    @Column(name = "end_time")
    private OffsetDateTime endTime;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @OneToMany(mappedBy = "event", cascade = CascadeType.REMOVE)
    private Set<EventParticipant> eventParticipants = new HashSet<>();

    private Integer teamScore;

    private Integer opponentScore;

    public Event() {
    }

    public Event(
            String name,
            EEvent eventType,
            Team team,
            OffsetDateTime startTime,
            OffsetDateTime endTime,
            Integer teamScore,
            Integer opponentScore
    ) {
        this.name = name;
        this.eventType = eventType;
        this.team = team;
        this.startTime = startTime;
        this.endTime = endTime;
        this.teamScore = teamScore;
        this.opponentScore = opponentScore;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
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
}
