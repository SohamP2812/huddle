package com.huddle.backend.payload.request;

import com.huddle.backend.models.ESport;
import javax.validation.constraints.NotNull;

public class TeamRequest {
  @NotNull
  private String name;

  @NotNull
  private ESport sport;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public ESport getSport() {
    return sport;
  }

  public void setSport(ESport sport) {
    this.sport = sport;
  }
}
