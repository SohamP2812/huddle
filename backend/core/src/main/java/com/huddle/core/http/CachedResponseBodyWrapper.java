package com.huddle.core.http;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class CachedResponseBodyWrapper extends HttpServletResponseWrapper {

    private final ByteArrayOutputStream cachedOutputStream;

    public CachedResponseBodyWrapper(HttpServletResponse response) {
        super(response);
        cachedOutputStream = new ByteArrayOutputStream();
    }

    @Override
    public ServletOutputStream getOutputStream() throws IOException {
        return new CachedServletOutputStream(
                super.getOutputStream(),
                cachedOutputStream
        );
    }

    public byte[] getOutputStreamAsByteArray() {
        return cachedOutputStream.toByteArray();
    }
}
