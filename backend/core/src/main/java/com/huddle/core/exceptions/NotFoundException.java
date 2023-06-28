package com.huddle.core.exceptions;

public class NotFoundException extends ApiException {
    public NotFoundException(String message) {
        super(message);
    }
}