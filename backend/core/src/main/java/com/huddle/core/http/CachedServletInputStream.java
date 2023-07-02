package com.huddle.core.http;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;

public class CachedServletInputStream extends ServletInputStream {
    private final byte[] cachedRequestBody;
    private int currentIndex = 0;

    public CachedServletInputStream(byte[] cachedRequestBody) {
        this.cachedRequestBody = cachedRequestBody;
    }

    @Override
    public int read() {
        if (currentIndex >= cachedRequestBody.length) {
            return -1;
        }
        return cachedRequestBody[currentIndex++];
    }

    @Override
    public boolean isFinished() {
        return currentIndex >= cachedRequestBody.length;
    }

    @Override
    public boolean isReady() {
        return true;
    }

    @Override
    public void setReadListener(ReadListener readListener) {
        throw new UnsupportedOperationException("setReadListener() is not supported.");
    }
}
