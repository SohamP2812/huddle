package com.huddle.api.teaminvite;

import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamService;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.api.teammember.TeamMemberService;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserService;
import com.huddle.core.email.EmailSender;
import com.huddle.core.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class TeamInviteService {
    @Autowired
    TeamService teamService;

    @Autowired
    UserService userService;

    @Autowired
    TeamMemberService teamMemberService;

    @Autowired
    EmailSender emailSender;

    @Autowired
    TeamInviteRepository teamInviteRepository;

    public List<DbTeamInvite> getInvitesForEmail(String email) {
        return teamInviteRepository.findAllByEmailAndAccepted(email, false);
    }

    public DbTeamInvite getInviteByToken(String inviteToken) {
        return teamInviteRepository.findByToken(inviteToken)
                .orElseThrow(() -> new EntityNotFoundException("No invite exists with this token."));
    }

    public DbTeamInvite createInvite(TeamInviteRequest teamInviteRequest) {
        DbTeam dbTeam = teamService.getTeam(teamInviteRequest.getTeamId());

        try {
            DbUser dbUserToAdd = userService.getUserByEmail(teamInviteRequest.getEmail());

            List<DbTeam> dbTeams = dbUserToAdd.getMemberTeams()
                    .stream()
                    .map(DbTeamMember::getTeam)
                    .toList();

            if (dbTeams.contains(dbTeam)) {
                throw new BadRequestException("User is already a member of this team.");
            }
        } catch (EntityNotFoundException ignored) {
        }

        DbTeamInvite dbTeamInvite = new DbTeamInvite(
                teamInviteRequest.getEmail(),
                dbTeam
        );

        teamInviteRepository.save(dbTeamInvite);

        return dbTeamInvite;
    }

    public DbTeamInvite updateInvite(
            String inviteToken,
            UpdateTeamInviteRequest updateTeamInviteRequest
    ) {
        DbTeamInvite dbTeamInvite = getInviteByToken(inviteToken);

        if (updateTeamInviteRequest.getAccepted() && !dbTeamInvite.getAccepted()) {
            DbUser dbUser = userService.getUserByEmail(dbTeamInvite.getEmail());
            teamMemberService.addMember(dbTeamInvite.getTeam().getId(), dbUser.getId());
        }

        dbTeamInvite.setAccepted(updateTeamInviteRequest.getAccepted());

        return teamInviteRepository.save(dbTeamInvite);
    }
}
