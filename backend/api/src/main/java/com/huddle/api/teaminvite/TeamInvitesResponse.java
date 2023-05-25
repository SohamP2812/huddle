package com.huddle.api.teaminvite;

import java.util.List;

public class TeamInvitesResponse {
    private List<TeamInviteResponse> invites;

    public TeamInvitesResponse(List<TeamInviteResponse> invites) {
        this.invites = invites;
    }

    public List<TeamInviteResponse> getInvites() {
        return invites;
    }

    public void setInvites(List<TeamInviteResponse> invites) {
        this.invites = invites;
    }
}
