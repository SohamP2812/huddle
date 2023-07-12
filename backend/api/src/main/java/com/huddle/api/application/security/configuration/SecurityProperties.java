package com.huddle.api.application.security.configuration;

import org.springframework.http.HttpMethod;

import java.util.ArrayList;
import java.util.List;

public class SecurityProperties {
    public static List<Endpoint> doNotAuthenticate() {
        return new ArrayList<>() {{
            add(new Endpoint(HttpMethod.POST, "/api/users"));
            add(new Endpoint(HttpMethod.POST, "/api/session"));
            add(new Endpoint(HttpMethod.POST, "/api/users/password"));
            add(new Endpoint(HttpMethod.DELETE, "/api/users/password"));
            add(new Endpoint(HttpMethod.GET, "/api/stats"));
            add(new Endpoint(HttpMethod.POST, "/api/stats/counted/refresh"));
            add(new Endpoint(HttpMethod.GET, "/actuator/**"));
        }};
    }
}