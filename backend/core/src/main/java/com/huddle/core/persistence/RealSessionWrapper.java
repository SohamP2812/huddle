package com.huddle.core.persistence;

import com.huddle.core.exceptions.NotFoundException;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class RealSessionWrapper implements SessionWrapper {
    Session session;

    public RealSessionWrapper(Session session) {
        this.session = session;
    }

    @Override
    public void close() throws Exception {
        session.close();
    }

    @Override
    public void flush() {
        session.flush();
    }

    @Override
    public Transaction beginTransaction() {
        return session.beginTransaction();
    }

    @Override
    public Transaction getTransaction() {
        return session.getTransaction();
    }

    @Override
    public <T extends DbEntity> CriteriaWrapper<T> createCriteria(Class<T> cls) {
        @SuppressWarnings("deprecation")
        Criteria criteria = session.createCriteria(cls);
        return new CriteriaWrapper<>(criteria);
    }

    @Override
    public <T extends DbEntity> T get(Class<T> cls, Long id) {
        T entity = session.get(cls, id);

        if (entity == null) {
            throw new NotFoundException("Resource does not exist");
        }

        return entity;
    }

    @Override
    public <T extends DbEntity> T save(T entity) {
        session.save(entity);
        return entity;
    }

    @Override
    public <T extends DbEntity> T update(T entity) {
        session.update(entity);
        return entity;
    }

    @Override
    public <T extends DbEntity> void delete(T entity) {
        session.delete(entity);
    }
}
