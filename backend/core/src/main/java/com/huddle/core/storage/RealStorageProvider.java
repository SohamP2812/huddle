package com.huddle.core.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;

@Primary
@Component
public class RealStorageProvider implements StorageProvider {
    private static final Logger logger = LoggerFactory.getLogger(RealStorageProvider.class);

    private Cloudinary cloudinary;

    @Value("${cloudinary.cloudName}")
    private String cloudName;

    @Value("${cloudinary.apiKey}")
    private String apiKey;

    @Value("${cloudinary.apiSecret}")
    private String apiSecret;

    @PostConstruct
    void init() {
        cloudinary = new Cloudinary(
                ObjectUtils.asMap(
                        "cloud_name", cloudName,
                        "api_key", apiKey,
                        "api_secret", apiSecret
                )
        );
    }

    @Override
    public String putImage(String folder, byte[] byteArray) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
                byteArray,
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "image"
                )
        );

        logger.info("Image uploaded to cloudinary: {}", uploadResult.get("public_id"));

        return (String) uploadResult.get("secure_url");
    }
}
