package com.huddle.api.teaminvite;

import com.huddle.api.teammember.EPosition;

import javax.validation.constraints.NotNull;

public class UpdateTeamInviteRequest {
    @NotNull
    private EInvitation state;

    @NotNull
    private EPosition position;

    public EInvitation getState() {
        return state;
    }

    public void setState(EInvitation state) {
        this.state = state;
    }

    public EPosition getPosition() {
        return position;
    }

    public void setPosition(EPosition position) {
        this.position = position;
    }
}
