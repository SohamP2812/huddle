package com.huddle.core.exceptions;

import org.springframework.http.HttpStatus;

import java.time.ZonedDateTime;

public class ApiExceptionResponse {
    private final String message;
    private final HttpStatus status;
    private final ZonedDateTime timeStamp;

    public ApiExceptionResponse(String message, HttpStatus httpStatus, ZonedDateTime timeStamp) {
        this.message = message;
        this.status = httpStatus;
        this.timeStamp = timeStamp;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public ZonedDateTime getTimeStamp() {
        return timeStamp;
    }
}
