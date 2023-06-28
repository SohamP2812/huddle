package com.huddle.core.persistence;

import org.hibernate.Transaction;

public interface SessionWrapper extends AutoCloseable {
    public void flush();

    public Transaction beginTransaction();

    public Transaction getTransaction();

    public <T extends DbEntity> CriteriaWrapper<T> createCriteria(Class<T> cls);

    public <T extends DbEntity> T get(Class<T> cls, Long id);

    public <T extends DbEntity> T save(T entity);

    public <T extends DbEntity> T update(T entity);

    public <T extends DbEntity> void delete(T entity);
}
