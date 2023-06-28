package com.huddle.core.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageProvider {
    public String putImage(String folder, MultipartFile file);
}
