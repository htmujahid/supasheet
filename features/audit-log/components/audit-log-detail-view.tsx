"use client";

import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  Database,
  FileJson,
  Shield,
  Table,
  User,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { AuditLogWithAccount } from "../lib/types";

type AuditLogDetailViewProps = {
  auditLog: AuditLogWithAccount;
};

export function AuditLogDetailView({ auditLog }: AuditLogDetailViewProps) {
  const operationColors = {
    INSERT: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    UPDATE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Log Details</CardTitle>
            {auditLog.is_error ? (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                Error
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-1 border-green-600 text-green-600"
              >
                <CheckCircle className="h-3 w-3" />
                Success
              </Badge>
            )}
          </div>
          <CardDescription>
            {formatDistanceToNow(new Date(auditLog.created_at), {
              addSuffix: true,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">ID</p>
              <p className="font-mono text-sm">{auditLog.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Operation</p>
              <Badge
                variant="secondary"
                className={
                  operationColors[
                    auditLog.operation as keyof typeof operationColors
                  ] || "bg-gray-100 text-gray-800"
                }
              >
                {auditLog.operation}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <Database className="h-3 w-3" />
                Schema
              </p>
              <p className="font-mono text-sm">{auditLog.schema_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <Table className="h-3 w-3" />
                Table
              </p>
              <p className="font-mono text-sm">{auditLog.table_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <User className="h-3 w-3" />
                User
              </p>
              <p className="text-sm">
                {auditLog.created_by?.name || "System"}
                {auditLog.created_by?.email && (
                  <span className="text-muted-foreground">
                    {" "}
                    ({auditLog.created_by.email})
                  </span>
                )}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <Shield className="h-3 w-3" />
                Role
              </p>
              <p className="text-sm">{auditLog.role || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">User Type</p>
              <p className="text-sm capitalize">
                {auditLog.user_type.replace("_", " ")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Record ID</p>
              <p className="font-mono text-sm">{auditLog.record_id || "N/A"}</p>
            </div>
          </div>

          {auditLog.is_error && auditLog.error_message && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Error Details
                </p>
                <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
                  <p className="text-sm">{auditLog.error_message}</p>
                  {auditLog.error_code && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      Code: {auditLog.error_code}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {auditLog.changed_fields && auditLog.changed_fields.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-semibold">Changed Fields</p>
                <div className="flex flex-wrap gap-2">
                  {auditLog.changed_fields.map((field) => (
                    <Badge key={field} variant="outline">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {auditLog.metadata && Object.keys(auditLog.metadata).length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <FileJson className="h-4 w-4" />
                  Metadata
                </p>
                <ScrollArea className="h-32 w-full rounded-md border p-2">
                  <pre className="text-xs">
                    {JSON.stringify(auditLog.metadata, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {(auditLog.old_data || auditLog.new_data) && (
        <Card>
          <CardHeader>
            <CardTitle>Data Changes</CardTitle>
            <CardDescription>
              {auditLog.operation === "INSERT" && "New data created"}
              {auditLog.operation === "UPDATE" && "Data modifications"}
              {auditLog.operation === "DELETE" && "Data removed"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {auditLog.old_data && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Old Data</p>
                  <ScrollArea className="h-64 w-full rounded-md border">
                    <pre className="p-3 text-xs">
                      {JSON.stringify(auditLog.old_data, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              )}
              {auditLog.new_data && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">New Data</p>
                  <ScrollArea className="h-64 w-full rounded-md border">
                    <pre className="p-3 text-xs">
                      {JSON.stringify(auditLog.new_data, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
