package com.huddle.api.teammember;

import javax.validation.constraints.NotNull;

public class UpdateMemberRequest {
    @NotNull
    private EPosition position;

    public EPosition getPosition() {
        return position;
    }

    public void setPosition(EPosition position) {
        this.position = position;
    }
}
