package com.huddle.core.persistence;

import com.huddle.core.exceptions.ApiException;
import com.huddle.core.exceptions.DatabaseException;

public abstract class TransactionResult<T> {
    abstract T getOrThrow();

    static class Success<T> extends TransactionResult<T> {
        T value;

        public Success(T value) {
            this.value = value;
        }

        public T getOrThrow() {
            return value;
        }
    }

    static class Failure<T> extends TransactionResult<T> {
        Exception exception;

        public Failure(Exception exception) {
            this.exception = exception;
        }

        public T getOrThrow() {
            if (exception instanceof ApiException) {
                throw (ApiException) exception;
            }

            throw new DatabaseException("An error occurred. Please try again.");
        }
    }
}
