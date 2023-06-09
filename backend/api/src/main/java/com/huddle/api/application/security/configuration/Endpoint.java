package com.huddle.api.application.security.configuration;

import org.springframework.http.HttpMethod;

public record Endpoint(HttpMethod method, String path) {
}