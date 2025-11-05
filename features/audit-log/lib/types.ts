import { Database } from "@/lib/database.types";

export type AuditLog = Database["supasheet"]["Tables"]["audit_logs"]["Row"];
export type AuditLogInsert =
  Database["supasheet"]["Tables"]["audit_logs"]["Insert"];
export type AuditLogUpdate =
  Database["supasheet"]["Tables"]["audit_logs"]["Update"];

export type AuditLogWithAccount = Omit<AuditLog, "created_by"> & {
  created_by: {
    name: string;
    email: string | null;
    picture_url: string | null;
  } | null;
};
