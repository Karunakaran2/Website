package com.website.authservice.domain.repository;

import com.website.authservice.domain.entity.AdminAuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface AdminAuditEventRepository extends JpaRepository<AdminAuditEvent, Long> {

    @Query("""
            SELECT e FROM AdminAuditEvent e
            WHERE (:filterModule = false OR e.moduleKey = :moduleKey)
              AND (:filterUsername = false OR LOWER(e.actorUsername) LIKE :usernamePattern)
              AND (:filterFrom = false OR e.occurredAt >= :fromInstant)
              AND (:filterTo = false OR e.occurredAt <= :toInstant)
            ORDER BY e.occurredAt DESC
            """)
    Page<AdminAuditEvent> search(
            @Param("filterModule") boolean filterModule,
            @Param("moduleKey") String moduleKey,
            @Param("filterUsername") boolean filterUsername,
            @Param("usernamePattern") String usernamePattern,
            @Param("filterFrom") boolean filterFrom,
            @Param("fromInstant") Instant fromInstant,
            @Param("filterTo") boolean filterTo,
            @Param("toInstant") Instant toInstant,
            Pageable pageable
    );
}