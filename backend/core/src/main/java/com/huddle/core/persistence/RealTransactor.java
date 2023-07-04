package com.huddle.core.persistence;

import com.huddle.core.exceptions.ApiException;
import com.huddle.core.exceptions.DatabaseException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Primary
@Component
public class RealTransactor implements Transactor {
    private static final Logger logger = LoggerFactory.getLogger(Transactor.class);

    private final ThreadLocal<SessionWrapper> activeSession = new ThreadLocal<>();

    @Autowired
    SessionFactoryWrapper sessionFactoryWrapper;

    @Override
    public <T> T call(TransactionCallback<T> callback) {
        boolean sessionAlreadyExists = activeSession.get() != null;
        SessionWrapper session = sessionAlreadyExists ? activeSession.get() : getSession();
        activeSession.set(session);

        TransactionResult<T> result = executeCallback(session, !sessionAlreadyExists, callback);

        if (!sessionAlreadyExists) {
            try {
                session.close();
            } catch (Exception e) {
                logger.error("Error closing session", e);
                throw new DatabaseException("An error occurred. Please try again.");
            } finally {
                activeSession.remove();
            }
        }

        return result.getOrThrow();
    }

    private <T> TransactionResult<T> executeCallback(
            SessionWrapper session,
            boolean openTransaction,
            TransactionCallback<T> callback
    ) {
        Transaction transaction = null;

        try {
            if (openTransaction) {
                transaction = session.beginTransaction();
            }

            T result = callback.callback(session);

            if (transaction != null) {
                session.flush();
                transaction.commit();
            }

            return new TransactionResult.Success<>(result);
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }

            if (!(e instanceof ApiException)) {
                logger.error("Transaction failed", e);
            }

            return new TransactionResult.Failure<>(e);
        }
    }

    private SessionWrapper getSession() {
        Session session = sessionFactoryWrapper.getSessionFactory().openSession();
        return new RealSessionWrapper(session);
    }
}
