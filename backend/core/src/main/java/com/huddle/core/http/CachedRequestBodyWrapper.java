package com.huddle.core.http;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class CachedRequestBodyWrapper extends HttpServletRequestWrapper {
    private final byte[] cachedRequestBody;

    public CachedRequestBodyWrapper(HttpServletRequest request) throws IOException {
        super(request);
        cachedRequestBody = request.getInputStream().readAllBytes();
    }

    public byte[] getRequestBody() {
        return cachedRequestBody;
    }

    @Override
    public BufferedReader getReader() {
        return new BufferedReader(new InputStreamReader(getInputStream()));
    }

    @Override
    public ServletInputStream getInputStream() {
        return new CachedServletInputStream(cachedRequestBody);
    }
}
