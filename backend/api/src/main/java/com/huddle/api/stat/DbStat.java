package com.huddle.api.stat;

import com.huddle.core.persistence.DbTimestampedEntity;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@EntityListeners(AuditingEntityListener.class)
@Table(
        name = "stats",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "name"),
        }
)
public class DbStat extends DbTimestampedEntity {
    @NotNull
    @Size(max = 20)
    private String name;

    @Size(max = 120)
    private String value;

    public DbStat() {
    }

    public DbStat(
            String name,
            String value
    ) {
        this.name = name;
        this.value = value;
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
