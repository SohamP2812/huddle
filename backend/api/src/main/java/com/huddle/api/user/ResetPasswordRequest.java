package com.huddle.api.user;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

public class ResetPasswordRequest {
    @NotEmpty(message = "Email must not be empty")
    @Email
    private String email;

    public String getEmail() {
        return email;
    }
}
