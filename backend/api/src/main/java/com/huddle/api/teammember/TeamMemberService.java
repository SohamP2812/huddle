package com.huddle.api.teammember;

import com.huddle.api.event.DbEvent;
import com.huddle.api.eventparticipant.EventParticipantRepository;
import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamService;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserService;
import com.huddle.core.email.EmailSender;
import com.huddle.core.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Autowired
    EmailSender emailSender;

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

        teamMemberRepository.save(dbTeamMember);

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", dbUserToAdd.getFirstName());
        variables.put("teamName", dbTeam.getName());
        variables.put("managerName", dbTeam.getManager().getFirstName());
        variables.put("managerEmail", dbTeam.getManager().getEmail());

        emailSender.sendNow(
                dbUserToAdd.getEmail(),
                "AddedToTeam",
                variables,
                String.format("You've Been Added to the %s Team!", dbTeam.getName())
        );

        return dbTeamMember;
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

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", teamMember.getMember().getFirstName());
        variables.put("teamName", dbTeam.getName());
        variables.put("managerName", dbTeam.getManager().getFirstName());
        variables.put("managerEmail", dbTeam.getManager().getEmail());

        emailSender.sendNow(
                teamMember.getMember().getEmail(),
                "RemovedFromTeam",
                variables,
                String.format("You've Been Removed from the %s Team", dbTeam.getName())
        );
    }
}
