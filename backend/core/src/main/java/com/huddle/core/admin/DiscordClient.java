package com.huddle.core.admin;

import com.huddle.core.executors.ExecutorsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.net.ssl.HttpsURLConnection;
import java.io.OutputStream;
import java.lang.reflect.Array;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;

@Component
public class DiscordClient {
    private static final Logger logger = LoggerFactory.getLogger(DiscordClient.class);

    @Autowired
    private ExecutorsService executorsService;

    private ExecutorService discordExecutor;

    @Value("${spring.profiles.active}")
    private String activeProfile;

    @PostConstruct
    void init() {
        discordExecutor = executorsService.newSingleThreadExecutor();
    }

    public void sendMessage(String url, String content) {
        System.out.println(activeProfile);
        System.out.println(activeProfile != "prod");
        if (activeProfile != "prod") {
            return;
        }

        if (content == null) {
            logger.error("Content was null while sending discord notification");
            return;
        }

        discordExecutor.execute(
                new SendDiscordNotificationRunnable(
                        url,
                        content
                )
        );
    }

    private record SendDiscordNotificationRunnable(String url, String content) implements Runnable {
        @Override
        public void run() {
            try {
                String cleanedContent = content.replace("\n", "\\n");

                JSONObject json = new JSONObject();

                json.put("content", cleanedContent);

                URL url = new URL(this.url);
                HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
                connection.addRequestProperty("Content-Type", "application/json");
                connection.setDoOutput(true);
                connection.setRequestMethod("POST");
                connection.addRequestProperty("User-Agent", "Mozilla");

                OutputStream stream = connection.getOutputStream();
                stream.write(json.toString().getBytes());
                stream.flush();
                stream.close();

                connection.getInputStream().close();
                connection.disconnect();

                logger.info("Sent discord notification to {}", url);
            } catch (Exception e) {
                logger.error("Error while sending discord notification", e);
            }
        }
    }

    private static class JSONObject {

        private final HashMap<String, Object> map = new HashMap<>();

        void put(String key, Object value) {
            if (value != null) {
                map.put(key, value);
            }
        }

        @Override
        public String toString() {
            StringBuilder builder = new StringBuilder();
            Set<Map.Entry<String, Object>> entrySet = map.entrySet();
            builder.append("{");

            int i = 0;
            for (Map.Entry<String, Object> entry : entrySet) {
                Object val = entry.getValue();
                builder.append(quote(entry.getKey())).append(":");

                if (val instanceof String) {
                    builder.append(quote(String.valueOf(val)));
                } else if (val instanceof Integer) {
                    builder.append(Integer.valueOf(String.valueOf(val)));
                } else if (val instanceof Boolean) {
                    builder.append(val);
                } else if (val instanceof JSONObject) {
                    builder.append(val);
                } else if (val.getClass().isArray()) {
                    builder.append("[");
                    int len = Array.getLength(val);
                    for (int j = 0; j < len; j++) {
                        builder.append(Array.get(val, j).toString()).append(j != len - 1 ? "," : "");
                    }
                    builder.append("]");
                }

                builder.append(++i == entrySet.size() ? "}" : ",");
            }

            return builder.toString();
        }

        private String quote(String string) {
            return "\"" + string + "\"";
        }
    }
}