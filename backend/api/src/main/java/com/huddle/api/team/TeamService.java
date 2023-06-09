package com.huddle.api.team;

import com.huddle.api.teammember.DbTeamMember;
import com.huddle.api.teammember.EPosition;
import com.huddle.api.teammember.ERole;
import com.huddle.api.teammember.TeamMemberRepository;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserService;
import com.huddle.core.exceptions.ConflictException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import javax.persistence.EntityNotFoundException;

@Service
public class TeamService {
    @Autowired
    TeamRepository teamRepository;

    @Autowired
    UserService userService;

    @Autowired
    TeamMemberRepository teamMemberRepository;

    public DbTeam createTeam(
            TeamRequest teamRequest,
            Long userId
    ) {
        if (teamRepository.existsByNameAndManagerId(teamRequest.getName(), userId)) {
            throw new ConflictException("You already have a team with this name!");
        }

        DbUser dbUser = userService.getUser(userId);

        DbTeam dbTeam = new DbTeam(
                teamRequest.getName(),
                dbUser,
                teamRequest.getSport()
        );

        teamRepository.save(dbTeam);

        DbTeamMember dbTeamMember = new DbTeamMember(
                ERole.ROLE_MANAGER,
                EPosition.UNKNOWN,
                dbUser,
                dbTeam
        );

        teamMemberRepository.save(dbTeamMember);

        return dbTeam;
    }

    public DbTeam getTeam(@PathVariable Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No team exists with this id."));
    }

    public void deleteTeam(Long team_id) {
        DbTeam dbTeam = getTeam(team_id);

        teamRepository.delete(dbTeam);
    }
}
