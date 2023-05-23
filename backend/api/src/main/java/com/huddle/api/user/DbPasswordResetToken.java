package com.huddle.api.user;

import javax.persistence.*;
import java.util.Calendar;
import java.util.Date;

@Entity
@Table(name = "password_reset_tokens")
public class DbPasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String token;

    @OneToOne(targetEntity = DbUser.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private DbUser user;

    private Date expiryDate;

    public DbPasswordResetToken() {

    }

    public DbPasswordResetToken(String token, DbUser user) {
        this.token = token;
        this.user = user;

        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, 1);
        expiryDate = calendar.getTime();
    }

    public DbUser getUser() {
        return user;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }
}