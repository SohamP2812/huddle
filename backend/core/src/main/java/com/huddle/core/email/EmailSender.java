package com.huddle.core.email;

import java.util.Map;

public interface EmailSender {
    public void sendNow(String recipient, String htmlFileName, Map<String, Object> data, String subject);

    public void sendLater();
}