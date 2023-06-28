package com.huddle.core.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.persistence.EntityNotFoundException;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@ControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(value = {EntityNotFoundException.class})
    public ResponseEntity<Object> handleEntityNotFound(EntityNotFoundException e) {
        HttpStatus notFound = HttpStatus.NOT_FOUND;

        ApiExceptionResponse apiExceptionResponse = new ApiExceptionResponse(e.getMessage(), notFound, ZonedDateTime.now(ZoneId.of("Z")));

        return new ResponseEntity<>(apiExceptionResponse, notFound);
    }

    @ExceptionHandler(value = {NotFoundException.class})
    public ResponseEntity<Object> handleNotFound(NotFoundException e) {
        HttpStatus notFound = HttpStatus.NOT_FOUND;

        ApiExceptionResponse apiExceptionResponse = new ApiExceptionResponse(e.getMessage(), notFound, ZonedDateTime.now(ZoneId.of("Z")));

        return new ResponseEntity<>(apiExceptionResponse, notFound);
    }

    @ExceptionHandler(value = {BadCredentialsException.class})
    public ResponseEntity<Object> handleBadCredentials(BadCredentialsException e) {
        HttpStatus unauthorized = HttpStatus.UNAUTHORIZED;

        ApiExceptionResponse apiExceptionResponse = new ApiExceptionResponse(e.getMessage(), unauthorized, ZonedDateTime.now(ZoneId.of("Z")));

        return new ResponseEntity<>(apiExceptionResponse, unauthorized);
    }

    @ExceptionHandler(value = {UnauthorizedException.class})
    public ResponseEntity<Object> handleUnauthorized(UnauthorizedException e) {
        HttpStatus unauthorized = HttpStatus.UNAUTHORIZED;

        ApiExceptionResponse apiExceptionResponse = new ApiExceptionResponse(e.getMessage(), unauthorized, ZonedDateTime.now(ZoneId.of("Z")));

        return new ResponseEntity<>(apiExceptionResponse, unauthorized);
    }

    @ExceptionHandler(value = {ConflictException.class})
    public ResponseEntity<Object> handleConflict(ConflictException e) {
        HttpStatus conflict = HttpStatus.CONFLICT;

        ApiExceptionResponse apiExceptionResponse = new ApiExceptionResponse(e.getMessage(), conflict, ZonedDateTime.now(ZoneId.of("Z")));

        return new ResponseEntity<>(apiExceptionResponse, conflict);
    }

    @ExceptionHandler(value = {BadRequestException.class})
    public ResponseEntity<Object> handleBadRequest(BadRequestException e) {
        HttpStatus badRequest = HttpStatus.BAD_REQUEST;

        ApiExceptionResponse apiExceptionResponse = new ApiExceptionResponse(e.getMessage(), badRequest, ZonedDateTime.now(ZoneId.of("Z")));

        return new ResponseEntity<>(apiExceptionResponse, badRequest);
    }

    @ExceptionHandler(value = {BindException.class})
    protected ResponseEntity<Object> handleBindException(BindException e) {
        HttpStatus badRequest = HttpStatus.BAD_REQUEST;

        String message;

        if (e.getFieldError() != null) {
            String fieldName = e.getFieldError().getField().replaceAll(
                    String.format("%s|%s|%s",
                            "(?<=[A-Z])(?=[A-Z][a-z])",
                            "(?<=[^A-Z])(?=[A-Z])",
                            "(?<=[A-Za-z])(?=[^A-Za-z])"
                    ),
                    " "
            );
            String finalFieldName = Character.toUpperCase(fieldName.charAt(0)) + fieldName.substring(1);
            message = finalFieldName + ": " + e.getFieldError().getDefaultMessage();
        } else {
            message = e.getFieldError().getDefaultMessage();
        }

        ApiExceptionResponse apiExceptionResponse = new ApiExceptionResponse(message, badRequest, ZonedDateTime.now(ZoneId.of("Z")));

        return new ResponseEntity<>(apiExceptionResponse, badRequest);
    }

    @ExceptionHandler(value = {DatabaseException.class})
    public ResponseEntity<Object> handleDatabaseException(DatabaseException e) {
        HttpStatus internalServerError = HttpStatus.INTERNAL_SERVER_ERROR;

        ApiExceptionResponse apiExceptionResponse = new ApiExceptionResponse(e.getMessage(), internalServerError, ZonedDateTime.now(ZoneId.of("Z")));

        return new ResponseEntity<>(apiExceptionResponse, internalServerError);
    }

    @ExceptionHandler(value = {FileException.class})
    public ResponseEntity<Object> handleFileException(FileException e) {
        HttpStatus internalServerError = HttpStatus.INTERNAL_SERVER_ERROR;

        ApiExceptionResponse apiExceptionResponse = new ApiExceptionResponse(e.getMessage(), internalServerError, ZonedDateTime.now(ZoneId.of("Z")));

        return new ResponseEntity<>(apiExceptionResponse, internalServerError);
    }
}
