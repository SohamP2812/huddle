package com.huddle.core.email;

import com.huddle.core.executors.ExecutorsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.annotation.PostConstruct;
import javax.mail.internet.MimeMessage;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ExecutorService;

@Primary
@Component
public class RealEmailSender implements EmailSender {
    private static final Logger logger = LoggerFactory.getLogger(EmailSender.class);

    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    private ExecutorsService executorsService;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String sender;

    private ExecutorService emailExecutor;

    @PostConstruct
    void init() {
        emailExecutor = executorsService.newSingleThreadExecutor();
    }

    @Override
    public void sendNow(String recipient, String htmlFileName, Map<String, Object> data, String subject) {
        try {
            logger.info("test log here");

            String html = this.templateEngine.process(htmlFileName, new Context(Locale.getDefault(), data));

            EmailDetails emailDetails = new EmailDetails(
                    recipient,
                    html,
                    subject,
                    ""
            );

            emailExecutor.execute(new SendEmailRunnable(emailDetails));
        } catch (Exception e) {
            logger.error("Error while reading email html", e);
        }
    }

    @Override
    public void sendLater() {

    }

    private class SendEmailRunnable implements Runnable {
        private final EmailDetails emailDetails;

        public SendEmailRunnable(EmailDetails emailDetails) {
            this.emailDetails = emailDetails;
        }

        @Override
        public void run() {
            try {
                MimeMessage message = javaMailSender.createMimeMessage();

                message.setFrom(sender);
                message.setRecipients(MimeMessage.RecipientType.TO, emailDetails.getRecipient());
                message.setSubject(emailDetails.getSubject());
                String htmlContent = emailDetails.getHtml();
                message.setContent(htmlContent, "text/html; charset=utf-8");

                javaMailSender.send(message);

                logger.info("Sent an email to {}", emailDetails.getRecipient());
            } catch (Exception e) {
                logger.error("Error while sending mail", e);
            }
        }
    }
}
