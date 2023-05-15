package com.huddle.api.user;

import javax.validation.constraints.NotEmpty;

public class DeleteUserRequest {
    @NotEmpty(message = "Password must not be empty")
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
