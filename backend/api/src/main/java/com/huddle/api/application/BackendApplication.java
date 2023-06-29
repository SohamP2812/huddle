package com.huddle.api.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan({"com.huddle.api", "com.huddle.core"})
@EnableJpaRepositories(
        basePackages = {"com.huddle.api", "com.huddle.core"},
        enableDefaultTransactions = false
)
@EntityScan({"com.huddle.api", "com.huddle.core"})
public class BackendApplication {
    private static final Logger logger = LoggerFactory.getLogger(BackendApplication.class);

    public static void main(String[] args) {
        logger.info("Starting Huddle service...");
        SpringApplication.run(BackendApplication.class, args);
    }
}
