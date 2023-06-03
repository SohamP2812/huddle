package com.huddle.api.teammember;

import javax.validation.constraints.NotNull;

public class MemberRequest {
    @NotNull
    private Long id;

    @NotNull
    private EPosition position;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EPosition getPosition() {
        return position;
    }

    public void setPosition(EPosition position) {
        this.position = position;
    }
}
