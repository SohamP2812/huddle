package com.huddle.backend.payload.request;

import javax.validation.constraints.NotBlank;

public class MemberRequest {
    @NotBlank
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}