package com.huddle.core.exceptions;

public class BadRequestException extends ApiException {
    public BadRequestException(String message) {
        super(message);
    }
}