package com.huddle.api.stat;

import com.huddle.api.event.DbEvent;
import com.huddle.api.team.DbTeam;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.api.user.DbUser;
import com.huddle.core.exceptions.NotFoundException;
import com.huddle.core.persistence.SessionWrapper;
import com.huddle.core.persistence.Transactor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatService {
    private static final Logger logger = LoggerFactory.getLogger(StatService.class);

    @Autowired
    Transactor transactor;

    public List<DbStat> getAllStats() {
        return transactor.call(session ->
                session.createCriteria(DbStat.class)
                        .setCacheable(true)
                        .list()

        );
    }

    @Scheduled(cron = "0 0 1 * * ?")
    public void syncCountedStats() {
        logger.info("Task executing: Sync counted stats table");
        transactor.call(session -> {
                    Long userCount = session.createCriteria(DbUser.class)
                            .count();
                    Long teamCount = session.createCriteria(DbTeam.class)
                            .count();
                    Long memberCount = session.createCriteria(DbTeamMember.class)
                            .count();
                    Long eventCount = session.createCriteria(DbEvent.class)
                            .count();

                    try {
                        DbStat dbUsersStat = session.createCriteria(DbStat.class)
                                .addEq("name", "users")
                                .uniqueResult();
                        dbUsersStat.setValue(String.valueOf(userCount));
                        session.update(dbUsersStat);
                    } catch (NotFoundException e) {
                        session.save(
                                new DbStat(
                                        "users",
                                        String.valueOf(userCount)
                                )
                        );
                    }

                    try {
                        DbStat dbTeamsStat = session.createCriteria(DbStat.class)
                                .addEq("name", "teams")
                                .uniqueResult();
                        dbTeamsStat.setValue(String.valueOf(teamCount));
                        session.update(dbTeamsStat);
                    } catch (NotFoundException e) {
                        session.save(
                                new DbStat(
                                        "teams",
                                        String.valueOf(teamCount)
                                )
                        );
                    }

                    try {
                        DbStat dbMembersStat = session.createCriteria(DbStat.class)
                                .addEq("name", "members")
                                .uniqueResult();
                        dbMembersStat.setValue(String.valueOf(memberCount));
                        session.update(dbMembersStat);
                    } catch (NotFoundException e) {
                        session.save(
                                new DbStat(
                                        "members",
                                        String.valueOf(memberCount)
                                )
                        );
                    }

                    try {
                        DbStat dbEventsStat = session.createCriteria(DbStat.class)
                                .addEq("name", "events")
                                .uniqueResult();
                        dbEventsStat.setValue(String.valueOf(eventCount));
                        session.update(dbEventsStat);
                    } catch (NotFoundException e) {
                        session.save(
                                new DbStat(
                                        "events",
                                        String.valueOf(eventCount)
                                )
                        );
                    }
                    return true;
                }
        );
    }

    public void incrementStat(SessionWrapper session, String name) {
        try {
            DbStat dbStat = session.createCriteria(DbStat.class)
                    .addEq("name", name)
                    .setCacheable(true)
                    .uniqueResult();

            Long incrementedValue = Long.parseLong(dbStat.getValue()) + 1;
            dbStat.setValue(String.valueOf(incrementedValue));

            session.update(dbStat);
        } catch (NotFoundException e) {
            session.save(
                    new DbStat(
                            name,
                            "1"
                    )
            );
        }
    }
}
