package com.huddle.backend.security;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.HashMap;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Component
public class StaticContentFilter extends OncePerRequestFilter {

    private List<String> fileExtensions = Arrays.asList("html", "js", "json", "csv", "css", "png", "svg", "eot", "ttf", "woff", "jpg", "jpeg", "gif", "ico");

    private HashMap<String, String> mimeTypes = new HashMap<String, String>() {{
        put("html", "text/html");
        put("js", "text/javascript");
        put("json", "application/json");
        put("csv", "text/csv");
        put("css", "text/css");
        put("png", "image/png");
        put("svg", "image/svg+xml");
        put("eot", "application/vnd.ms-fontobject");
        put("ttf", "font/ttf");
        put("woff", "font/woff");
        put("jpg", "image/jpeg");
        put("jpeg", "image/jpeg");
        put("gif", "image/gif");
        put("ico", "image/vnd.microsoft.icon");
    }};
    private void resourceToResponse(String resourcePath, HttpServletResponse response) throws IOException {
        InputStream inputStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(resourcePath);

        if (inputStream == null) {
            response.sendError(NOT_FOUND.value(), NOT_FOUND.getReasonPhrase());
            return;
        }

        inputStream.transferTo(response.getOutputStream());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();
        System.out.println(path);
        boolean isApi = path.startsWith("/api");
        boolean isResourceFile = !isApi && fileExtensions.stream().anyMatch(path::contains);

        if (isApi) {
            filterChain.doFilter(request, response);
        } else if (isResourceFile) {
            response.setHeader("Content-Type", mimeTypes.get(fileExtensions.stream().filter(path::contains).findFirst().get()));
            resourceToResponse("static" + path, response);
        } else {
            response.setHeader("Content-Type", "text/html");
            resourceToResponse("static/index.html", response);
        }
    }
}