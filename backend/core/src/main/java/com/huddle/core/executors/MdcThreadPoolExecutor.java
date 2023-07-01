package com.huddle.core.executors;

import org.slf4j.MDC;

import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

class MdcThreadPoolExecutor extends ThreadPoolExecutor {
    final private Map<String, String> mdcContext;

    public static MdcThreadPoolExecutor newSingleThreadExecutor() {
        return new MdcThreadPoolExecutor(
                1,
                1,
                0L,
                TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<>()
        );
    }

    public MdcThreadPoolExecutor(
            int corePoolSize,
            int maximumPoolSize,
            long keepAliveTime,
            TimeUnit unit,
            BlockingQueue<Runnable> workQueue
    ) {
        super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue);
        this.mdcContext = MDC.getCopyOfContextMap();
    }

    @Override
    public void execute(Runnable command) {
        super.execute(runWithContext(command, mdcContext));
    }

    public static Runnable runWithContext(
            Runnable runnable,
            Map<String, String> mdcContext
    ) {
        return () -> {
            MDC.setContextMap(mdcContext);
            runnable.run();
        };
    }
}
