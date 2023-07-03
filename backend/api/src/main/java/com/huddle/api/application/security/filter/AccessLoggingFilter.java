package com.huddle.api.application.security.filter;

import com.huddle.core.http.CachedRequestBodyWrapper;
import com.huddle.core.http.CachedResponseBodyWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

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
        boolean isApi = req.getServletPath().startsWith("/api");
        boolean isRequestBodyJson = Objects.equals(req.getContentType(), "application/json");

        long startTimeNs = System.nanoTime();

        if (isApi) {
            MDC.put("http.request_id", UUID.randomUUID().toString());
        }

        CachedRequestBodyWrapper requestWrapper = isRequestBodyJson ?
                new CachedRequestBodyWrapper(req) : null;
        CachedResponseBodyWrapper responseWrapper = new CachedResponseBodyWrapper(res);
        String requestBody = isRequestBodyJson ?
                new String(requestWrapper.getRequestBody()) : null;

        filterChain.doFilter(
                isRequestBodyJson ? requestWrapper : req,
                responseWrapper
        );

        String responseBody = new String(responseWrapper.getOutputStreamAsByteArray());

        Long durationMs = (System.nanoTime() - startTimeNs) / 1_000_000;

        if (isApi) {
            MDC.put("http.request.referer", req.getHeader("referer"));
            MDC.put("http.request.method", req.getMethod());
            MDC.put("http.request.pathname", req.getRequestURI());
            MDC.put("http.request.url",
                    req.getRequestURL().toString() +
                            (req.getQueryString() != null ? "?" + req.getQueryString() : "")
            );
            if (isRequestBodyJson) {
                MDC.put("http.request.body", requestBody);
            }

            MDC.put("http.response.duration.ms", durationMs.toString());
            MDC.put("http.response.status_code", String.valueOf(res.getStatus()));
            MDC.put("http.response.body", responseBody);
        }

        logger.info(
                "RESPONSE: {} {}{} status={} duration={}ms",
                req.getMethod(),
                req.getRequestURI(),
                req.getQueryString() != null ? "?" + req.getQueryString() : "",
                res.getStatus(),
                durationMs
        );

        MDC.clear();
    }
}

