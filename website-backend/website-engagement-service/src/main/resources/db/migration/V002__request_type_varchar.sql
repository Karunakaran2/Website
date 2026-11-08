-- Align request_type with JPA (VARCHAR) while preserving CHECK constraint values
ALTER TABLE contacts
    ALTER COLUMN request_type TYPE varchar(1) USING trim(request_type)::varchar(1);
