package com.huddle.core.exceptions;

public class ConflictException extends ApiException {
    public ConflictException(String message) {
        super(message);
    }
}