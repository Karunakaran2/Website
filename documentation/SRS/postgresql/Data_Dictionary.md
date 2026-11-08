# Data Dictionary — PostgreSQL Target Schema

**Source of truth for columns:** Hibernate `@Column` mappings in legacy `com.kran.project.admin.vo.*` and `db_dump/db ater.txt`.  
**Naming:** Target PostgreSQL uses **snake_case**; legacy MariaDB mixed case preserved in migration mapping tables.

Legend: **PK** primary key, **FK** foreign key (intra-service only), **UQ** unique, **NN** not null.

---

## content-service (`kran_content`)

### `news` (legacy `kran_website.news`)

| Column | PostgreSQL type | NN | UQ | Default | Legacy column | Description |
|--------|-----------------|----|----|---------|---------------|-------------|
| id | BIGINT | PK | | IDENTITY | id | Surrogate key; preserve on migrate |
| title | VARCHAR(255) | NN | | | title | Headline |
| news_description | TEXT | | | | news_Description | Body (was VARCHAR(200000) in MariaDB) |
| active_status | VARCHAR(1) | NN | | 'Y' | active_Status | Y/N active flag |
| posted_on | TIMESTAMPTZ | | | | posted_On | Legacy posted timestamp |
| publish_date | TIMESTAMPTZ | | | | publish_Date | Scheduled publish |
| image_path | VARCHAR(500) | | | | image_Path | Hero image path/URI |
| news_link | VARCHAR(500) | | | | news_Link | External link |
| read_more_type | VARCHAR(50) | | | | read_more_type | Display mode |
| pdf_path | VARCHAR(500) | | | | pdf_path | PDF attachment |
| type | VARCHAR(50) | | | | type | News type classifier |
| created_at | TIMESTAMPTZ | NN | | now() | — | Audit |
| created_by | VARCHAR(128) | | | | — | Audit |
| updated_at | TIMESTAMPTZ | NN | | now() | — | Audit |
| updated_by | VARCHAR(128) | | | | — | Audit |
| deleted_at | TIMESTAMPTZ | | | | — | Soft delete |

**Indexes:** `(publish_date DESC)` partial active; GIN full-text on title+news_description (optional).

### `banner`

| Column | PostgreSQL type | NN | Legacy | Description |
|--------|-----------------|----|--------|-------------|
| id | BIGINT PK | | id | |
| active_status | VARCHAR(1) | NN | active_Status | |
| image_path | VARCHAR(500) | | image_Path | |
| order_no | INTEGER | | order_No | Carousel order |
| heading | VARCHAR(255) | | heading | |
| title | VARCHAR(255) | | title | |
| link | VARCHAR(500) | | link | |
| + audit + deleted_at | | | | |

**Indexes:** `(order_no)` WHERE deleted_at IS NULL.

### `blog` (public “Data Sheets”)

| Column | PostgreSQL type | Legacy | Description |
|--------|-----------------|--------|-------------|
| id | BIGINT PK | id | |
| category | VARCHAR(255) | category | Denormalized label |
| title | VARCHAR(500) | NN | title | |
| active_status | VARCHAR(1) | active_Status | |
| posted_on | TIMESTAMPTZ | posted_On | |
| posted_by | VARCHAR(128) | posted_By | |
| image_path | VARCHAR(500) | image_Path | |
| attachment_path | VARCHAR(500) | attachment_Path | |
| link | VARCHAR(500) | link | |
| + audit + deleted_at | | | |

### `kran_timeline`

| Column | PostgreSQL type | Legacy |
|--------|-----------------|--------|
| id | BIGINT PK | id |
| title | VARCHAR(255) | title |
| heading | VARCHAR(255) | heading |
| description | TEXT | description |
| active_status | VARCHAR(1) | active_status |
| submitted_on | TIMESTAMPTZ | submitted_On |
| + audit + deleted_at | | |

---

## catalog-service (`kran_catalog`)

### `category`

| Column | Type | Legacy |
|--------|------|--------|
| id | BIGINT PK | id |
| name | VARCHAR(255) NN | name |
| type | VARCHAR(50) | type | Case study / blog taxonomy |
| active_status | VARCHAR(1) | active_Status |
| + audit + deleted_at | | |

### `casestudy`

| Column | Type | Legacy |
|--------|------|--------|
| id | BIGINT PK | id |
| category | VARCHAR(255) | category | String category (legacy) |
| title | VARCHAR(500) | title |
| active_status | VARCHAR(1) | active_Status |
| posted_on | TIMESTAMPTZ | posted_On |
| posted_by | VARCHAR(128) | posted_By |
| image_path | VARCHAR(500) | image_Path |
| attachment_path | VARCHAR(500) | attachment_Path |
| link | VARCHAR(500) | link |
| blog_banner | VARCHAR(500) | blog_banner |
| + audit + deleted_at | | |

### `kran_projects`, `kran_solutions`

Wide legacy tables — see DDL scripts for full column list (`service_*` flags on projects, `components` on solutions).

### `kran_faces`, `kran_seniors`

People profiles: name, designation/position, image_path, active_status, submitted_on, quotes/experience/joining_date as applicable.

### `project_product`

| Column | Type | Legacy |
|--------|------|--------|
| id | BIGINT PK | id |
| name | VARCHAR(1000) | name |
| title | VARCHAR(5000) | title |
| description | TEXT | description |
| type | VARCHAR(20) | type |
| logo | VARCHAR(255) | logo |
| active_status | VARCHAR(2) | active_Status |
| category | VARCHAR(150) | category |
| order_no | INTEGER | order_No |
| + audit + deleted_at | | |

---

## media-service (`kran_media`)

### `gallgroup`

| Column | Type | Legacy |
|--------|------|--------|
| group_id | BIGINT PK | group_Id |
| title | VARCHAR(255) | title |
| posted_on | TIMESTAMPTZ | posted_On |
| image_path | VARCHAR(500) | image_Path |
| active_status | VARCHAR(1) | active_Status |
| + audit + deleted_at | | |

### `gallery`

| Column | Type | Legacy | FK |
|--------|------|--------|-----|
| id | BIGINT PK | id | |
| title | VARCHAR(255) | title | |
| posted_on | TIMESTAMPTZ | posted_On | |
| image_path | VARCHAR(500) | image_Path | |
| group_id | BIGINT NN | group_id | → gallgroup.group_id |
| type | VARCHAR(50) | type | |
| + audit + deleted_at | | | |

**Constraint:** `FK_gallery_group FOREIGN KEY (group_id) REFERENCES gallgroup(group_id)`

---

## careers-service (`kran_careers`)

### `careers`

| Column | Type | Legacy |
|--------|------|--------|
| id | BIGINT PK | id |
| title | VARCHAR(255) | title |
| job_description | TEXT | job_Description |
| active_status | VARCHAR(1) | active_Status |
| posted_on | TIMESTAMPTZ | posted_On |
| last_date | TIMESTAMPTZ | last_Date |
| skill_set | VARCHAR(255) | skill_set |
| location | VARCHAR(255) | location |
| experience | VARCHAR(255) | experience |
| + audit + deleted_at | | |

### `application_request`

| Column | Type | Legacy | FK |
|--------|------|--------|-----|
| id | BIGINT PK | id | |
| career_id | BIGINT | career_Id | → careers.id |
| name | VARCHAR(150) | name | |
| email | VARCHAR(255) | email | |
| mobile | VARCHAR(20) | mobile | Legacy DOUBLE — normalize to string |
| resume_path | VARCHAR(500) | resume_Path | Object storage URI |
| submitted_on | TIMESTAMPTZ | submitted_On | |
| + created_at | | | |

### `submitted_resumes` (general applications / no vacancy)

| Column | Type | Legacy |
|--------|------|--------|
| id | BIGINT PK | id |
| name | VARCHAR(150) | name |
| email | VARCHAR(255) | email |
| mobile | VARCHAR(20) | mobile |
| exp | VARCHAR(255) | exp |
| intro | TEXT | intro |
| resume_path | VARCHAR(500) | resume_Path |
| submitted_on | TIMESTAMPTZ | submitted_On |
| role | VARCHAR(255) | role |

---

## engagement-service (`kran_engagement`)

### `contacts`

| Column | Type | Legacy | Notes |
|--------|------|--------|-------|
| id | BIGINT PK | id | |
| name | VARCHAR(500) NN | name | |
| email | VARCHAR(300) NN | email | |
| mobile | VARCHAR(20) NN | mobile | |
| organization | VARCHAR(500) | organization | |
| remarks | TEXT | remarks | |
| request_type | CHAR(1) NN | request_Type | G/B/D/T/E/C per legacy |
| product_name | VARCHAR(255) | product_Name | Snapshot |
| submitted_on | TIMESTAMPTZ NN | submitted_On | |
| archived_at | TIMESTAMPTZ | — | No hard delete |

**Check:** `request_type IN ('G','B','D','T','E','C')` — confirm full set (Requires Business Confirmation).

### `comments`

| Column | Type | Legacy | Notes |
|--------|------|--------|-------|
| id | BIGINT PK | id | |
| comments | TEXT | comments | |
| blog_id | BIGINT | blog_Id | Logical ref to content.blog |
| comment_id | BIGINT | comment_Id | Thread parent |
| posted_on | TIMESTAMPTZ | posted_On | |
| posted_by | VARCHAR(128) | posted_By | |

**No FK** to `blog` across databases.

---

## notification-service (`kran_notification`)

### `mail_setup`

| Column | Type | Legacy |
|--------|------|--------|
| id | BIGINT PK | id |
| type | VARCHAR(10) | type | G/S/H etc. |
| mail_to | VARCHAR(1000) | mail_To | |
| mail_cc | VARCHAR(1000) | mail_Cc | |
| added_on | TIMESTAMPTZ | added_On | |
| active_status | VARCHAR(1) | active_Status | |
| deactivated_on | TIMESTAMPTZ | deactivated_On | |
| + audit | | |

Graph OAuth secrets **not** stored in PostgreSQL (vault only).

### `outbound_email_log` (new)

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT PK | |
| correlation_id | UUID NN | Trace enquiry/application |
| template_code | VARCHAR(64) | |
| recipient | VARCHAR(255) | |
| status | VARCHAR(20) | SENT/FAILED |
| created_at | TIMESTAMPTZ | |

---

## auth-service (`kran_auth`) — new

### `admin_user`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | default gen_random_uuid() |
| username | VARCHAR(128) UQ NN | |
| password_hash | VARCHAR(255) NN | bcrypt/argon2 |
| display_name | VARCHAR(255) | |
| is_active | BOOLEAN NN default true | |
| last_login_at | TIMESTAMPTZ | |
| created_at / updated_at | TIMESTAMPTZ | |

Legacy had no user table; migration creates initial admin from secure onboarding, not from LoginAction source.
