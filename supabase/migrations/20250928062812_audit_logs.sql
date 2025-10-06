CREATE TABLE IF NOT EXISTS supasheet.audit_logs (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    operation TEXT NOT NULL,
    schema_name TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    created_by UUID REFERENCES supasheet.accounts(id) ON DELETE SET NULL,
    role supasheet.app_role,
    user_type TEXT NOT NULL CHECK (user_type IN ('system', 'real_user')) DEFAULT 'real_user',
    metadata JSONB DEFAULT '{}'::JSONB,
    old_data JSONB,
    new_data JSONB,
    changed_fields TEXT[],
    is_error BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    error_code TEXT
);

CREATE INDEX idx_audit_logs_created_at ON supasheet.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_created_by ON supasheet.audit_logs(created_by);
CREATE INDEX idx_audit_logs_role ON supasheet.audit_logs(role);
CREATE INDEX idx_audit_logs_operation ON supasheet.audit_logs(operation);
CREATE INDEX idx_audit_logs_schema_table ON supasheet.audit_logs(schema_name, table_name);
CREATE INDEX idx_audit_logs_record_id ON supasheet.audit_logs(record_id);
CREATE INDEX idx_audit_logs_user_type ON supasheet.audit_logs(user_type);
CREATE INDEX idx_audit_logs_is_error ON supasheet.audit_logs(is_error) WHERE is_error = TRUE;
CREATE INDEX idx_audit_logs_metadata ON supasheet.audit_logs USING GIN (metadata);

-- add search path to this function
CREATE OR REPLACE FUNCTION supasheet.create_audit_log(
    p_operation TEXT,
    p_schema_name TEXT,
    p_table_name TEXT,
    p_record_id TEXT DEFAULT NULL,
    p_old_data JSONB DEFAULT NULL,
    p_new_data JSONB DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::JSONB
) RETURNS UUID AS $$
DECLARE
    v_audit_id UUID;
    v_user_id UUID;
    v_user_role supasheet.app_role;
    v_changed_fields TEXT[];
BEGIN
    v_user_id := auth.uid();
    
    SELECT ur.role INTO v_user_role
    FROM supasheet.user_roles ur
    WHERE ur.account_id = v_user_id
    LIMIT 1;

    
    IF p_operation = 'UPDATE' AND p_old_data IS NOT NULL AND p_new_data IS NOT NULL THEN
        SELECT ARRAY_AGG(key) INTO v_changed_fields
        FROM (
            SELECT key
            FROM jsonb_each(p_old_data)
            WHERE NOT EXISTS (
                SELECT 1 FROM jsonb_each(p_new_data) n
                WHERE n.key = jsonb_each.key AND n.value = jsonb_each.value
            )
            UNION
            SELECT key
            FROM jsonb_each(p_new_data)
            WHERE NOT EXISTS (
                SELECT 1 FROM jsonb_each(p_old_data) o
                WHERE o.key = jsonb_each.key
            )
        ) changed;
    END IF;

    
    INSERT INTO supasheet.audit_logs (
        operation,
        schema_name,
        table_name,
        record_id,
        created_by,
        role,
        user_type,
        old_data,
        new_data,
        changed_fields,
        metadata
    ) VALUES (
        p_operation,
        p_schema_name,
        p_table_name,
        p_record_id,
        v_user_id,
        v_user_role,
        CASE WHEN v_user_id IS NULL THEN 'system' ELSE 'real_user' END,
        p_old_data,
        p_new_data,
        v_changed_fields,
        p_metadata
    ) RETURNING id INTO v_audit_id;
    
    RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION supasheet.audit_trigger_function() RETURNS TRIGGER AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
    v_operation TEXT;
    v_record_id TEXT;
BEGIN
    v_operation := TG_OP;
    
    IF TG_OP = 'DELETE' THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := NULL;
        v_record_id := OLD.id::TEXT;
    ELSIF TG_OP = 'UPDATE' THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
        v_record_id := NEW.id::TEXT;
    ELSIF TG_OP = 'INSERT' THEN
        v_old_data := NULL;
        v_new_data := to_jsonb(NEW);
        v_record_id := NEW.id::TEXT;
    END IF;

    
    PERFORM supasheet.create_audit_log(
        v_operation,
        TG_TABLE_SCHEMA,
        TG_TABLE_NAME,
        v_record_id,
        v_old_data,
        v_new_data,
        jsonb_build_object(
            'trigger_name', TG_NAME,
            'trigger_when', TG_WHEN,
            'trigger_level', TG_LEVEL
        )
    );

    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT SELECT ON supasheet.audit_logs TO authenticated;

ALTER TABLE supasheet.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs" ON supasheet.audit_logs
    FOR SELECT
    TO authenticated
    USING (created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM supasheet.user_roles
        WHERE account_id = auth.uid() AND role = 'x-admin'
    ));
