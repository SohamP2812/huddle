package com.huddle.backend.session;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

public class SignupRequest {
    @NotEmpty(message = "Username must not be empty")
    @Size(min = 3, max = 20, message = "Min length is 3 characters and max length is 20 characters")
    private String username;

    @NotEmpty(message = "First name must not be empty")
    @Size(max = 20, message = "Max length is 20 characters")
    private String firstName;

    @NotEmpty(message = "Last name must not be empty")
    @Size(max = 20, message = "Max length is 20 characters")
    private String lastName;

    @NotEmpty(message = "Email must not be empty")
    @Size(max = 50, message = "Max length is 50 characters")
    @Email
    private String email;

    @NotEmpty(message = "Password must not be empty")
    @Size(min = 6, max = 40, message = "Min length is 6 characters and max length is 40 characters")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
