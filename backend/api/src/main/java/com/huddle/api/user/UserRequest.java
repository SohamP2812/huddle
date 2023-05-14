package com.huddle.api.user;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

public class UserRequest {

    @NotEmpty(message = "First name must not be empty")
    @Size(max = 20, message = "Max length is 20 characters")
    private String firstName;

    @NotEmpty(message = "Last name must not be empty")
    @Size(max = 20, message = "Max length is 20 characters")
    private String lastName;

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
}
