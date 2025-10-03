CREATE TRIGGER audit_tasks_insert
    AFTER INSERT
    ON public.tasks
    FOR EACH ROW
EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_tasks_update
    AFTER UPDATE
    ON public.tasks
    FOR EACH ROW
EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_tasks_delete
    BEFORE DELETE
    ON public.tasks
    FOR EACH ROW
EXECUTE FUNCTION supasheet.audit_trigger_function();
