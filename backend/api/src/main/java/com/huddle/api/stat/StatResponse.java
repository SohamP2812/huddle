package com.huddle.api.stat;

public class StatResponse {
    private String name;
    private String value;

    public StatResponse(DbStat dbStat) {
        this.name = dbStat.getName();
        this.value = dbStat.getValue();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
