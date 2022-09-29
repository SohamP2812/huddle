package com.huddle.backend.payload.request;

import javax.validation.constraints.*;

public class UserRequest {

  @NotEmpty
  @Size(max = 20)
  private String firstName;

  @NotEmpty
  @Size(max = 20)
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
