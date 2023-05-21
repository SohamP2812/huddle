package com.huddle.api.teammember;

import com.huddle.api.event.DbEvent;
import com.huddle.api.eventparticipant.EventParticipantRepository;
import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamService;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserService;
import com.huddle.core.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class TeamMemberService {
    @Autowired
    TeamMemberRepository teamMemberRepository;

    @Autowired
    EventParticipantRepository eventParticipantRepository;

    @Autowired
    TeamService teamService;

    @Autowired
    UserService userService;

    public List<DbTeamMember> getMembers(Long teamId) {
        DbTeam dbTeam = teamService.getTeam(teamId);

        return dbTeam.getTeamMembers()
                .stream()
                .toList();
    }

    public DbTeamMember addMember(
            Long teamId,
            Long userId
    ) {
        DbTeam dbTeam = teamService.getTeam(teamId);

        DbUser dbUserToAdd = userService.getUser(userId);

        List<DbTeam> dbTeams = dbUserToAdd.getMemberTeams()
                .stream()
                .map(DbTeamMember::getTeam)
                .toList();

        if (dbTeams.contains(dbTeam)) {
            throw new BadRequestException("User is already a member of this team.");
        }

        DbTeamMember dbTeamMember = new DbTeamMember(
                ERole.ROLE_MEMBER,
                dbUserToAdd,
                dbTeam
        );

        return teamMemberRepository.save(dbTeamMember);
    }

    public DbTeamMember getMember(
            Long teamId,
            Long userId
    ) {
        return teamMemberRepository.findByTeamIdAndMemberId(
                teamId,
                userId
        ).orElseThrow(() -> new EntityNotFoundException("This user is not a member of that team."));
    }

    public void deleteMember(
            Long teamId,
            Long userId
    ) {
        DbTeam dbTeam = teamService.getTeam(teamId);

        DbTeamMember teamMember = getMember(teamId, userId);

        if (teamMember.isManager()) {
            throw new BadRequestException("You cannot delete the manager from a team.");
        }

        teamMemberRepository.delete(teamMember);

        for (DbEvent dbEvent : dbTeam.getEvents()) {
            eventParticipantRepository.deleteByParticipantIdAndEventId(userId, dbEvent.getId());
        }
    }
}
