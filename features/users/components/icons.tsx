import { Tables } from "@/lib/database.types";

export function getDataTypeIcon(columnSchema: Tables<"_pg_meta_columns">) {
  switch (columnSchema.actual_type) {
    case "task_code":
      return <code className="text-muted-foreground font-mono text-xs">T</code>;
  }

  switch (columnSchema.data_type) {
    case "character":
    case "character varying":
    case "text":
      return (
        <code className="text-muted-foreground font-mono text-xs">Aa</code>
      );
    case "bigint":
    case "bigserial":
    case "integer":
    case "numeric":
    case "smallint":
    case "smallserial":
    case "serial":
      return (
        <code className="text-muted-foreground font-mono text-xs">123</code>
      );
    case "bit":
    case "bit varying":
      return (
        <code className="text-muted-foreground font-mono text-xs">01</code>
      );
    case "box":
    case "point":
    case "line":
    case "lseg":
    case "polygon":
    case "path":
      return (
        <code className="text-muted-foreground font-mono text-xs">x,y</code>
      );
    case "macaddr":
    case "macaddr8":
      return (
        <code className="text-muted-foreground font-mono text-xs">mac</code>
      );
    case "money":
      return (
        <code className="text-muted-foreground font-mono text-xs">money</code>
      );
    case "bytea":
      return (
        <code className="text-muted-foreground font-mono text-xs">\x</code>
      );
    case "cidr":
    case "inet":
      return (
        <code className="text-muted-foreground font-mono text-xs">ipv</code>
      );
    case "circle":
      return (
        <code className="text-muted-foreground font-mono text-xs">x,y,r</code>
      );
    case "date":
      return (
        <code className="text-muted-foreground font-mono text-xs">date</code>
      );
    case "time with time zone":
    case "time without time zone":
    case "time":
      return (
        <code className="text-muted-foreground font-mono text-xs">time</code>
      );
    case "interval":
    case "json":
    case "jsonb":
      return (
        <code className="text-muted-foreground font-mono text-xs">json</code>
      );
    case "double precision":
    case "real":
      return (
        <code className="text-muted-foreground font-mono text-xs">12.3</code>
      );
    case "boolean":
      return (
        <code className="text-muted-foreground font-mono text-xs">bool</code>
      );
    case "USER-DEFINED":
      return (
        <code className="text-muted-foreground font-mono text-xs">enum</code>
      );
    case "timestamp with time zone":
    case "timestamp without time zone":
    case "timestamp":
      return (
        <code className="text-muted-foreground font-mono text-xs">
          timestamp
        </code>
      );
    case "tsquery":
      return (
        <code className="text-muted-foreground font-mono text-xs">tsq</code>
      );
    case "tsvector":
      return (
        <code className="text-muted-foreground font-mono text-xs">tsv</code>
      );
    case "uuid":
      return (
        <code className="text-muted-foreground font-mono text-xs">UID</code>
      );
    case "xml":
      return (
        <code className="text-muted-foreground font-mono text-xs">xml</code>
      );
  }
}
