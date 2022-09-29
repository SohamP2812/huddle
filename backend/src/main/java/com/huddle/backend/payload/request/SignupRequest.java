package com.huddle.backend.payload.request;

import java.util.Set;
import javax.validation.constraints.*;

public class SignupRequest {
  @NotEmpty
  @Size(min = 3, max = 20)
  private String username;

  @NotEmpty
  @Size(max = 20)
  private String firstName;

  @NotEmpty
  @Size(max = 20)
  private String lastName;

  @NotEmpty
  @Size(max = 50)
  @Email
  private String email;

  @NotEmpty
  @Size(min = 6, max = 40)
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
