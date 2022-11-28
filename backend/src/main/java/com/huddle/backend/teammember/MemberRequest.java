package com.huddle.backend.teammember;

import javax.validation.constraints.NotNull;

public class MemberRequest {
    @NotNull
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
