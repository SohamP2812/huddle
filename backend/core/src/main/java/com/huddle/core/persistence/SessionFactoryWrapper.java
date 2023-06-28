package com.huddle.core.persistence;

import com.huddle.core.exceptions.DatabaseException;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManagerFactory;

@Component
public class SessionFactoryWrapper {
    private static final Logger logger = LoggerFactory.getLogger(SessionFactoryWrapper.class);

    @Autowired
    EntityManagerFactory entityManagerFactory;

    public SessionFactory getSessionFactory() {
        if (entityManagerFactory.unwrap(SessionFactory.class) == null) {
            logger.error("Unable to unwrap EntityManagerFactory");
            throw new DatabaseException("An error occurred. Please try again.");
        }

        return entityManagerFactory.unwrap(SessionFactory.class);
    }
}