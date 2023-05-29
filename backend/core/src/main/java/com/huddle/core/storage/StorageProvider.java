package com.huddle.core.storage;

import java.io.IOException;

public interface StorageProvider {
    public String putImage(String folder, byte[] byteArray) throws IOException;
}
