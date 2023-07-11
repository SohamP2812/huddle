package com.huddle.api.stat;

import java.util.List;

public class StatsResponse {
    private List<StatResponse> stats;

    public StatsResponse(List<StatResponse> stats) {
        this.stats = stats;
    }

    public List<StatResponse> getStats() {
        return stats;
    }

    public void setStats(List<StatResponse> users) {
        this.stats = stats;
    }
}
