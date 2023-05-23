package com.huddle.core.utils;

import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;

import static java.nio.charset.StandardCharsets.UTF_8;

public class ResourceReader {
    public static String asString(Resource resource) throws IOException {
        Reader reader = new InputStreamReader(resource.getInputStream(), UTF_8);
        return FileCopyUtils.copyToString(reader);
    }

    public static String readFileToString(String path) throws IOException {
        ResourceLoader resourceLoader = new DefaultResourceLoader();
        Resource resource = resourceLoader.getResource(path);
        return asString(resource);
    }
}
