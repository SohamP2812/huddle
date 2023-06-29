package com.huddle.api.team;

import com.huddle.api.teammember.DbTeamMember;
import com.huddle.api.teammember.EPosition;
import com.huddle.api.teammember.ERole;
import com.huddle.api.user.DbUser;
import com.huddle.api.user.UserService;
import com.huddle.core.exceptions.ConflictException;
import com.huddle.core.persistence.SessionWrapper;
import com.huddle.core.persistence.Transactor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service
public class TeamService {

    @Autowired
    UserService userService;

    @Autowired
    Transactor transactor;

    public DbTeam createTeam(
            TeamRequest teamRequest,
            Long userId
    ) {
        return transactor.call(session -> {
                    if (existsByNameAndManagerId(session, teamRequest.getName(), userId)) {
                        throw new ConflictException("You already have a team with this name!");
                    }

                    DbUser dbUser = userService.getUser(userId);

                    DbTeam dbTeam = new DbTeam(
                            teamRequest.getName(),
                            dbUser,
                            teamRequest.getSport()
                    );

                    session.save(dbTeam);

                    DbTeamMember dbTeamMember = new DbTeamMember(
                            ERole.ROLE_MANAGER,
                            EPosition.UNKNOWN,
                            dbUser,
                            dbTeam
                    );

                    session.save(dbTeamMember);

                    return dbTeam;
                }
        );
    }

    public Boolean existsByNameAndManagerId(
            SessionWrapper session,
            String name,
            Long managerId
    ) {
        return session.createCriteria(DbTeam.class)
                .addEq("name", name)
                .addEq("manager.id", managerId) // will this perform a join with manager (what if we accessed manager.username)?
                .exists();
    }

    public DbTeam getTeam(@PathVariable Long id) {
        return transactor.call(session ->
                session.get(DbTeam.class, id)
        );
    }

    public void deleteTeam(Long teamId) {
        transactor.call(session -> {
                    DbTeam dbTeam = getTeam(teamId);
                    session.delete(dbTeam);
                    return true;
                }
        );
    }
}
