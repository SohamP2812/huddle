package com.huddle.api.teaminvite;

import com.huddle.api.team.DbTeam;
import com.huddle.api.team.TeamService;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.api.teammember.TeamMemberService;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserService;
import com.huddle.core.email.EmailSender;
import com.huddle.core.exceptions.BadRequestException;
import com.huddle.core.exceptions.NotFoundException;
import com.huddle.core.persistence.SessionWrapper;
import com.huddle.core.persistence.Transactor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    Transactor transactor;

    public List<DbTeamInvite> getInvitesForEmail(String email) {
        return transactor.call(session ->
                session.createCriteria(DbTeamInvite.class)
                        .addEq("email", email)
                        .addEq("state", EInvitation.PENDING)
                        .list()
        );
    }

    public DbTeamInvite getInviteByToken(String inviteToken) {
        return transactor.call(session ->
                session.createCriteria(DbTeamInvite.class)
                        .addEq("token", inviteToken)
                        .uniqueResult()
        );
    }

    public DbTeamInvite getInviteByEmailAndTeamId(
            SessionWrapper session,
            String email,
            Long teamId
    ) {
        return session.createCriteria(DbTeamInvite.class)
                .addEq("email", email)
                .addEq("team.id", teamId)
                .uniqueResult();
    }

    public DbTeamInvite createInvite(TeamInviteRequest teamInviteRequest) {
        return transactor.call(session -> {
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
                    } catch (NotFoundException ignored) {
                    }

                    try {
                        DbTeamInvite dbTeamInvite = getInviteByEmailAndTeamId(
                                session,
                                teamInviteRequest.getEmail(),
                                teamInviteRequest.getTeamId()
                        );

                        session.delete(dbTeamInvite);
                    } catch (NotFoundException ignored) {
                    }

                    DbTeamInvite dbTeamInvite = new DbTeamInvite(
                            teamInviteRequest.getEmail(),
                            dbTeam
                    );

                    session.save(dbTeamInvite);

                    Map<String, Object> variables = new HashMap<>();
                    variables.put("teamName", dbTeam.getName());
                    variables.put("managerName",
                            String.format(
                                    "%s %s",
                                    dbTeam.getManager().getFirstName(),
                                    dbTeam.getManager().getLastName()
                            )
                    );
                    variables.put("managerEmail", dbTeam.getManager().getEmail());
                    variables.put("invitationUrl", String.format("https://huddlesports.ca/invites/%s", dbTeamInvite.getToken()));

                    emailSender.sendNow(
                            teamInviteRequest.getEmail(),
                            "InvitedToTeam",
                            variables,
                            "You've Been Invited to a Team!"
                    );

                    return dbTeamInvite;
                }
        );
    }

    public DbTeamInvite updateInvite(
            String inviteToken,
            UpdateTeamInviteRequest updateTeamInviteRequest
    ) {
        return transactor.call(session -> {
                    DbTeamInvite dbTeamInvite = getInviteByToken(inviteToken);

                    if (updateTeamInviteRequest.getState() == EInvitation.ACCEPTED && dbTeamInvite.getState() != EInvitation.ACCEPTED) {
                        DbUser dbUser = userService.getUserByEmail(dbTeamInvite.getEmail());
                        teamMemberService.addMember(
                                dbTeamInvite.getTeam().getId(),
                                dbUser.getId(),
                                updateTeamInviteRequest.getPosition()
                        );

                        Map<String, Object> variables = new HashMap<>();
                        variables.put("name", dbTeamInvite.getTeam().getManager().getFirstName());
                        variables.put("acceptedUserName", String.format("%s %s", dbUser.getFirstName(), dbUser.getLastName()));
                        variables.put("acceptedUserEmail", dbUser.getEmail());
                        variables.put("joinedTeamName", dbTeamInvite.getTeam().getName());

                        emailSender.sendNow(
                                dbTeamInvite.getTeam().getManager().getEmail(),
                                "InvitationAccepted",
                                variables,
                                "Your Invite was Accepted!"
                        );

                    }

                    dbTeamInvite.setState(updateTeamInviteRequest.getState());

                    return session.update(dbTeamInvite);
                }
        );
    }
}
