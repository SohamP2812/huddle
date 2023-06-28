package com.huddle.core.exceptions;

public class UnauthorizedException extends ApiException {
    public UnauthorizedException(String message) {
        super(message);
    }
}