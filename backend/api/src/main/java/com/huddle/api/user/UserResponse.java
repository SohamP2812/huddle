package com.huddle.api.user;

public class UserResponse {
    private Long id;
    private String username;
    private String firstName;

    private String lastName;
    private String email;

    private String profilePictureUrl;

    public UserResponse(DbUser dbUser) {
        this.id = dbUser.getId();
        this.firstName = dbUser.getFirstName();
        this.lastName = dbUser.getLastName();
        this.username = dbUser.getUsername();
        this.email = dbUser.getEmail();
        this.profilePictureUrl = dbUser.getProfilePictureUrl();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

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

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
}
