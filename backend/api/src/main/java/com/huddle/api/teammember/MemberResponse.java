package com.huddle.api.teammember;

public class MemberResponse {
    private Long id;
    private String username;
    private String firstName;

    private String lastName;

    private String email;

    private EPosition position;

    private Boolean isManager;

    public MemberResponse(
            DbTeamMember member
    ) {
        this.id = member.getMember().getId();
        this.firstName = member.getMember().getFirstName();
        this.lastName = member.getMember().getLastName();
        this.username = member.getMember().getUsername();
        this.email = member.getMember().getEmail();
        this.position = member.getPosition();
        this.isManager = member.isManager();
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

    public Boolean getIsManager() {
        return isManager;
    }

    public EPosition getPosition() {
        return position;
    }

    public void setPosition(EPosition position) {
        this.position = position;
    }

    public void setIsManager(Boolean isManager) {
        this.isManager = isManager;
    }
}
