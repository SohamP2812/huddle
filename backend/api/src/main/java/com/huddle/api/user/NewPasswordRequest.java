package com.huddle.api.user;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

public class NewPasswordRequest {
    @NotEmpty(message = "Password must not be empty")
    @Size(min = 6, max = 40, message = "Min length is 6 characters and max length is 40 characters")
    private String password;

    @NotEmpty(message = "Token must not be empty")

    private String token;

    public String getPassword() {
        return password;
    }

    public String getToken() {
        return token;
    }

}
