-- Single test table covering all data types
BEGIN;
CREATE TYPE sample_status AS ENUM ('draft', 'pending', 'active', 'archived');

-- Add permissions to app_permission enum
ALTER TYPE supasheet.app_permission ADD VALUE 'public.data_type_samples:select';
ALTER TYPE supasheet.app_permission ADD VALUE 'public.data_type_samples:insert';
ALTER TYPE supasheet.app_permission ADD VALUE 'public.data_type_samples:update';
ALTER TYPE supasheet.app_permission ADD VALUE 'public.data_type_samples:delete';
COMMIT;

CREATE TABLE data_type_samples (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User association
  account_id UUID DEFAULT auth.uid() REFERENCES supasheet.accounts(id) ON DELETE CASCADE,

  -- Text types
  char_field CHARACTER(5),
  varchar_field VARCHAR(255),
  text_field TEXT,

  -- Number types
  smallint_val SMALLINT,
  integer_val INTEGER,
  bigint_val BIGINT,
  real_val REAL,
  double_val DOUBLE PRECISION,
  numeric_val NUMERIC(12, 2),
  serial_val SERIAL,

  -- Money
  money_val MONEY,

  -- Boolean
  bool_val BOOL DEFAULT false,

  -- Binary types
  bit_val BIT(8),
  varbit_val VARBIT(16),
  bytea_val BYTEA,

  -- Date/Time types
  date_val DATE,
  time_val TIME,
  timetz_val TIMETZ,
  timestamp_val TIMESTAMP,
  timestamptz_val TIMESTAMPTZ DEFAULT now(),

  -- UUID
  uuid_val UUID,

  -- JSON types
  json_val JSON,
  jsonb_val JSONB,

  -- Arrays
  text_array TEXT[],
  int_array INTEGER[],

  -- Enum (USER-DEFINED)
  status sample_status DEFAULT 'draft',

  -- Custom domains
  email_val EMAIL,
  tel_val TEL,
  url_val URL,
  rating_val RATING,
  percentage_val PERCENTAGE,
  color_val COLOR,
  duration_val DURATION,
  avatar_val AVATAR,
  file_val FILE,
  rich_text_val RICH_TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table comment with metadata
COMMENT ON TABLE data_type_samples IS
'{
    "icon": "Database",
    "display": "block",
    "query": {
        "sort": [{"id":"created_at","desc":true}]
    }
}';

-- Column comments for enums
COMMENT ON COLUMN data_type_samples.status IS
'{
    "progress": false,
    "enums": {
        "draft": {
            "variant": "outline",
            "icon": "FileEdit"
        },
        "pending": {
            "variant": "warning",
            "icon": "Clock"
        },
        "active": {
            "variant": "success",
            "icon": "CircleCheck"
        },
        "archived": {
            "variant": "secondary",
            "icon": "Archive"
        }
    }
}';

----------------------------------------------------------------
-- Permissions
----------------------------------------------------------------

REVOKE ALL ON TABLE public.data_type_samples FROM authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.data_type_samples TO authenticated;

----------------------------------------------------------------
-- Indexes
----------------------------------------------------------------

CREATE INDEX idx_data_type_samples_account_id ON public.data_type_samples (account_id);
CREATE INDEX idx_data_type_samples_status ON public.data_type_samples (status);
CREATE INDEX idx_data_type_samples_created_at ON public.data_type_samples (created_at);

----------------------------------------------------------------
-- Row Level Security
----------------------------------------------------------------

ALTER TABLE public.data_type_samples ENABLE ROW LEVEL SECURITY;

CREATE POLICY data_type_samples_select ON public.data_type_samples
    FOR SELECT
    TO authenticated
    USING (account_id = auth.uid() AND supasheet.has_permission('public.data_type_samples:select'));

CREATE POLICY data_type_samples_insert ON public.data_type_samples
    FOR INSERT
    TO authenticated
    WITH CHECK (account_id = auth.uid() AND supasheet.has_permission('public.data_type_samples:insert'));

CREATE POLICY data_type_samples_update ON public.data_type_samples
    FOR UPDATE
    TO authenticated
    USING (account_id = auth.uid() AND supasheet.has_permission('public.data_type_samples:update'))
    WITH CHECK (account_id = auth.uid() AND supasheet.has_permission('public.data_type_samples:update'));

CREATE POLICY data_type_samples_delete ON public.data_type_samples
    FOR DELETE
    TO authenticated
    USING (account_id = auth.uid() AND supasheet.has_permission('public.data_type_samples:delete'));

----------------------------------------------------------------
-- Role Permissions
----------------------------------------------------------------

INSERT INTO supasheet.role_permissions (role, permission) VALUES ('user', 'public.data_type_samples:select');
INSERT INTO supasheet.role_permissions (role, permission) VALUES ('user', 'public.data_type_samples:insert');
INSERT INTO supasheet.role_permissions (role, permission) VALUES ('user', 'public.data_type_samples:update');
INSERT INTO supasheet.role_permissions (role, permission) VALUES ('user', 'public.data_type_samples:delete');

----------------------------------------------------------------
-- Audit Triggers
----------------------------------------------------------------

CREATE TRIGGER audit_data_type_samples_insert
    AFTER INSERT
    ON public.data_type_samples
    FOR EACH ROW
EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_data_type_samples_update
    AFTER UPDATE
    ON public.data_type_samples
    FOR EACH ROW
EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_data_type_samples_delete
    BEFORE DELETE
    ON public.data_type_samples
    FOR EACH ROW
EXECUTE FUNCTION supasheet.audit_trigger_function();
