package com.huddle.core.persistence;

public interface TransactionCallback<T> {
    public T callback(SessionWrapper session);
}
