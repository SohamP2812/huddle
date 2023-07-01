package com.huddle.core.executors;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class ExecutorsService {
    private final List<MdcThreadPoolExecutor> executors = new ArrayList<>();

    public void close() throws InterruptedException {
        for (ExecutorService executor : executors) {
            executor.shutdown();
            executor.awaitTermination(5, TimeUnit.SECONDS);
        }
    }

    public ExecutorService newSingleThreadExecutor() {
        MdcThreadPoolExecutor executor = MdcThreadPoolExecutor.newSingleThreadExecutor();

        executors.add(executor);

        return executor;
    }
}
