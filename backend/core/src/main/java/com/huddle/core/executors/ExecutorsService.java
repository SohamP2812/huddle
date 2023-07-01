package com.huddle.core.executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class ExecutorsService {
    private static final Logger logger = LoggerFactory.getLogger(ExecutorsService.class);

    private final List<MdcThreadPoolExecutor> executors = new ArrayList<>();

    public void close() throws InterruptedException {
        for (ExecutorService executor : executors) {
            executor.shutdown();
            executor.awaitTermination(5, TimeUnit.SECONDS);
        }
    }

    public MdcThreadPoolExecutor newSingleThreadExecutor() {
        MdcThreadPoolExecutor executor = MdcThreadPoolExecutor.newSingleThreadExecutor();

        logger.info("Copied Context: {}", MDC.getCopyOfContextMap());
        executor.mdcContext = MDC.getCopyOfContextMap();
        logger.info("Set Context: {}", executor.mdcContext);

        executors.add(executor);

        return executor;
    }
}
