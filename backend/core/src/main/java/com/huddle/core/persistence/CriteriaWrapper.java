package com.huddle.core.persistence;

import com.huddle.core.exceptions.NotFoundException;
import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import java.util.List;

public class CriteriaWrapper<T> {
    Criteria criteria;

    public CriteriaWrapper(Criteria criteria) {
        this.criteria = criteria;
    }

    public CriteriaWrapper<T> addEq(String name, Object value) {
        criteria.add(Restrictions.eq(name, value));
        return this;
    }

    public T uniqueResult() {
        @SuppressWarnings("unchecked")
        T result = (T) criteria.uniqueResult();

        if (result == null) {
            throw new NotFoundException("Resource does not exist");
        }

        return result;
    }

    public List<T> list() {
        @SuppressWarnings("unchecked")
        List<T> list = (List<T>) criteria.list();
        return list;
    }

    public CriteriaWrapper<T> addLike(String name, String value, MatchMode matchMode) {
        criteria.add(Restrictions.like(name, value, matchMode));
        return this;
    }

    public Boolean exists() {
        return criteria.setProjection(Projections.property("id"))
                .uniqueResult() != null;
    }

    public CriteriaWrapper<T> setMaxResults(int maxResults) {
        criteria.setMaxResults(maxResults);
        return this;
    }

    public CriteriaWrapper<T> setCacheable(boolean cacheable) {
        criteria.setCacheable(cacheable);
        return this;
    }
}
