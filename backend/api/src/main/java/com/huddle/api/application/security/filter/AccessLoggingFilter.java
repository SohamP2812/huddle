package com.huddle.api.application.security.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AccessLoggingFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(AccessLoggingFilter.class);

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        long startTimeNs = System.nanoTime();

        filterChain.doFilter(request, response);

        Long durationMs = (System.nanoTime() - startTimeNs) / 1_000_000;

        logger.info(
                "RESPONSE: {} {}{} status={} duration={}ms",
                req.getMethod(),
                req.getRequestURI(),
                req.getQueryString() != null ? "?" + req.getQueryString() : "",
                res.getStatus(),
                durationMs
        );
    }
}

