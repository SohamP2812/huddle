package com.huddle.core.http;

import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class CachedServletOutputStream extends ServletOutputStream {

    private final ServletOutputStream originalOutputStream;
    private final ByteArrayOutputStream cachedOutputStream;

    public CachedServletOutputStream(
            ServletOutputStream originalOutputStream,
            ByteArrayOutputStream cachedOutputStream
    ) {
        this.originalOutputStream = originalOutputStream;
        this.cachedOutputStream = cachedOutputStream;
    }

    @Override
    public void write(int b) throws IOException {
        originalOutputStream.write(b);
        cachedOutputStream.write(b);
    }

    @Override
    public boolean isReady() {
        return true;
    }

    @Override
    public void setWriteListener(WriteListener listener) {
        throw new UnsupportedOperationException("setWriteListener() is not supported.");

    }
}
