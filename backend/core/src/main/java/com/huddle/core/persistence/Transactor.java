package com.huddle.core.persistence;

public interface Transactor {
    public <T> T call(TransactionCallback<T> callback);
}
