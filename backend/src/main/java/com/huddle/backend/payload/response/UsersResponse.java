package com.huddle.backend.payload.response;

import com.huddle.backend.models.User;

import java.util.List;

public class UsersResponse {
    private List<User> users;

    public UsersResponse(List<User> users) {
        this.users = users;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
