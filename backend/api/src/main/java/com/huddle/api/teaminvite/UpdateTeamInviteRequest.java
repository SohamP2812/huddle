package com.huddle.api.teaminvite;

public class UpdateTeamInviteRequest {
    private EInvitation state;

    public EInvitation getState() {
        return state;
    }

    public void setState(EInvitation state) {
        this.state = state;
    }
}
