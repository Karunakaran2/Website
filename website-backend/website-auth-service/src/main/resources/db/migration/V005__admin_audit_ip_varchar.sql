ALTER TABLE admin_audit_event
    ALTER COLUMN ip_address TYPE VARCHAR(45)
    USING (
        CASE
            WHEN ip_address IS NULL THEN NULL
            ELSE ip_address::text
        END
    );