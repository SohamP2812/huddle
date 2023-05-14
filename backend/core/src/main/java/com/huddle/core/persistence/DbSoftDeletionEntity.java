package com.huddle.core.persistence;

import javax.persistence.MappedSuperclass;


@MappedSuperclass
public abstract class DbSoftDeletionEntity extends DbEntity {
    private boolean deleted = false;

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
