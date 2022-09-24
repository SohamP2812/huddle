package com.huddle.backend.payload.response;

import java.lang.reflect.Member;
import java.util.List;

public class MembersResponse {
  private List<MemberResponse> members;

  public MembersResponse(List<MemberResponse> members) {
    this.members = members;
  }

  public List<MemberResponse> getMembers() {
    return members;
  }

  public void setMembers(List<MemberResponse> members) {
    this.members = members;
  }
}
