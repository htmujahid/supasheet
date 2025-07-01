export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      _pg_meta_columns: {
        Row: {
          actual_type: unknown | null;
          check: string | null;
          comment: string | null;
          data_type: string | null;
          default_value: string | null;
          enums: Json | null;
          format: unknown | null;
          id: string;
          identity_generation: string | null;
          is_generated: boolean | null;
          is_identity: boolean | null;
          is_nullable: boolean | null;
          is_unique: boolean | null;
          is_updatable: boolean | null;
          name: unknown | null;
          ordinal_position: number | null;
          relation: unknown | null;
          schema: unknown | null;
          table_id: number | null;
        };
        Insert: {
          actual_type?: unknown | null;
          check?: string | null;
          comment?: string | null;
          data_type?: string | null;
          default_value?: string | null;
          enums?: Json | null;
          format?: unknown | null;
          id: string;
          identity_generation?: string | null;
          is_generated?: boolean | null;
          is_identity?: boolean | null;
          is_nullable?: boolean | null;
          is_unique?: boolean | null;
          is_updatable?: boolean | null;
          name?: unknown | null;
          ordinal_position?: number | null;
          relation?: unknown | null;
          schema?: unknown | null;
          table_id?: number | null;
        };
        Update: {
          actual_type?: unknown | null;
          check?: string | null;
          comment?: string | null;
          data_type?: string | null;
          default_value?: string | null;
          enums?: Json | null;
          format?: unknown | null;
          id?: string;
          identity_generation?: string | null;
          is_generated?: boolean | null;
          is_identity?: boolean | null;
          is_nullable?: boolean | null;
          is_unique?: boolean | null;
          is_updatable?: boolean | null;
          name?: unknown | null;
          ordinal_position?: number | null;
          relation?: unknown | null;
          schema?: unknown | null;
          table_id?: number | null;
        };
        Relationships: [];
      };
      _pg_meta_foreign_tables: {
        Row: {
          comment: string | null;
          id: number;
          name: unknown | null;
          schema: unknown | null;
        };
        Insert: {
          comment?: string | null;
          id: number;
          name?: unknown | null;
          schema?: unknown | null;
        };
        Update: {
          comment?: string | null;
          id?: number;
          name?: unknown | null;
          schema?: unknown | null;
        };
        Relationships: [];
      };
      _pg_meta_materialized_views: {
        Row: {
          comment: string | null;
          id: number;
          is_populated: boolean | null;
          name: unknown | null;
          schema: unknown | null;
        };
        Insert: {
          comment?: string | null;
          id: number;
          is_populated?: boolean | null;
          name?: unknown | null;
          schema?: unknown | null;
        };
        Update: {
          comment?: string | null;
          id?: number;
          is_populated?: boolean | null;
          name?: unknown | null;
          schema?: unknown | null;
        };
        Relationships: [];
      };
      _pg_meta_table_relationships: {
        Row: {
          columns: Json | null;
          foreign_key_name: unknown;
          is_one_to_one: boolean | null;
          referenced_columns: Json | null;
          referenced_relation: unknown | null;
          referenced_schema: unknown | null;
          relation: unknown;
          schema: unknown;
        };
        Insert: {
          columns?: Json | null;
          foreign_key_name: unknown;
          is_one_to_one?: boolean | null;
          referenced_columns?: Json | null;
          referenced_relation?: unknown | null;
          referenced_schema?: unknown | null;
          relation: unknown;
          schema: unknown;
        };
        Update: {
          columns?: Json | null;
          foreign_key_name?: unknown;
          is_one_to_one?: boolean | null;
          referenced_columns?: Json | null;
          referenced_relation?: unknown | null;
          referenced_schema?: unknown | null;
          relation?: unknown;
          schema?: unknown;
        };
        Relationships: [];
      };
      _pg_meta_tables: {
        Row: {
          bytes: number | null;
          comment: string | null;
          dead_rows_estimate: number | null;
          id: number;
          live_rows_estimate: number | null;
          name: unknown | null;
          primary_keys: Json | null;
          relationships: Json | null;
          replica_identity: string | null;
          rls_enabled: boolean | null;
          rls_forced: boolean | null;
          schema: unknown | null;
          size: string | null;
        };
        Insert: {
          bytes?: number | null;
          comment?: string | null;
          dead_rows_estimate?: number | null;
          id: number;
          live_rows_estimate?: number | null;
          name?: unknown | null;
          primary_keys?: Json | null;
          relationships?: Json | null;
          replica_identity?: string | null;
          rls_enabled?: boolean | null;
          rls_forced?: boolean | null;
          schema?: unknown | null;
          size?: string | null;
        };
        Update: {
          bytes?: number | null;
          comment?: string | null;
          dead_rows_estimate?: number | null;
          id?: number;
          live_rows_estimate?: number | null;
          name?: unknown | null;
          primary_keys?: Json | null;
          relationships?: Json | null;
          replica_identity?: string | null;
          rls_enabled?: boolean | null;
          rls_forced?: boolean | null;
          schema?: unknown | null;
          size?: string | null;
        };
        Relationships: [];
      };
      _pg_meta_types: {
        Row: {
          attributes: Json | null;
          comment: string | null;
          enums: Json | null;
          format: string | null;
          id: number;
          name: unknown | null;
          schema: unknown | null;
        };
        Insert: {
          attributes?: Json | null;
          comment?: string | null;
          enums?: Json | null;
          format?: string | null;
          id: number;
          name?: unknown | null;
          schema?: unknown | null;
        };
        Update: {
          attributes?: Json | null;
          comment?: string | null;
          enums?: Json | null;
          format?: string | null;
          id?: number;
          name?: unknown | null;
          schema?: unknown | null;
        };
        Relationships: [];
      };
      _pg_meta_views: {
        Row: {
          comment: string | null;
          id: number;
          is_updatable: boolean | null;
          name: unknown | null;
          schema: unknown | null;
        };
        Insert: {
          comment?: string | null;
          id: number;
          is_updatable?: boolean | null;
          name?: unknown | null;
          schema?: unknown | null;
        };
        Update: {
          comment?: string | null;
          id?: number;
          is_updatable?: boolean | null;
          name?: unknown | null;
          schema?: unknown | null;
        };
        Relationships: [];
      };
      accounts: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          name: string;
          picture_url: string | null;
          public_data: Json;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          name: string;
          picture_url?: string | null;
          public_data?: Json;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          name?: string;
          picture_url?: string | null;
          public_data?: Json;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          description: string | null;
          grp: string;
          icon: string | null;
          id: string;
          name: string;
          type: Database["public"]["Enums"]["resource_type"];
        };
        Insert: {
          description?: string | null;
          grp: string;
          icon?: string | null;
          id: string;
          name: string;
          type: Database["public"]["Enums"]["resource_type"];
        };
        Update: {
          description?: string | null;
          grp?: string;
          icon?: string | null;
          id?: string;
          name?: string;
          type?: Database["public"]["Enums"]["resource_type"];
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          id: number;
          permission: Database["public"]["Enums"]["app_permission"];
          role: Database["public"]["Enums"]["app_role"];
        };
        Insert: {
          id?: number;
          permission: Database["public"]["Enums"]["app_permission"];
          role: Database["public"]["Enums"]["app_role"];
        };
        Update: {
          id?: number;
          permission?: Database["public"]["Enums"]["app_permission"];
          role?: Database["public"]["Enums"]["app_role"];
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          account_id: string;
          archived: boolean;
          code: string;
          created_at: string;
          estimated_hours: number;
          id: string;
          label: Database["public"]["Enums"]["task_label"];
          priority: Database["public"]["Enums"]["task_priority"];
          status: Database["public"]["Enums"]["task_status"];
          title: string | null;
          updated_at: string;
        };
        Insert: {
          account_id: string;
          archived?: boolean;
          code: string;
          created_at?: string;
          estimated_hours?: number;
          id?: string;
          label?: Database["public"]["Enums"]["task_label"];
          priority?: Database["public"]["Enums"]["task_priority"];
          status?: Database["public"]["Enums"]["task_status"];
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          account_id?: string;
          archived?: boolean;
          code?: string;
          created_at?: string;
          estimated_hours?: number;
          id?: string;
          label?: Database["public"]["Enums"]["task_label"];
          priority?: Database["public"]["Enums"]["task_priority"];
          status?: Database["public"]["Enums"]["task_status"];
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          account_id: string;
          id: number;
          role: Database["public"]["Enums"]["app_role"];
        };
        Insert: {
          account_id: string;
          id?: number;
          role: Database["public"]["Enums"]["app_role"];
        };
        Update: {
          account_id?: string;
          id?: number;
          role?: Database["public"]["Enums"]["app_role"];
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_all_pg_meta_tables: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      create_pg_meta_columns: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      create_pg_meta_foreign_tables: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      create_pg_meta_materialized_views: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      create_pg_meta_table_relationships: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      create_pg_meta_tables: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      create_pg_meta_types: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      create_pg_meta_views: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_storage_filename_as_uuid: {
        Args: { name: string };
        Returns: string;
      };
      has_permission: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"];
        };
        Returns: boolean;
      };
      has_role: {
        Args: { requested_role: Database["public"]["Enums"]["app_role"] };
        Returns: boolean;
      };
      unaccent: {
        Args: { "": string };
        Returns: string;
      };
      unaccent_init: {
        Args: { "": unknown };
        Returns: unknown;
      };
    };
    Enums: {
      app_permission:
        | "tasks"
        | "tasks:select"
        | "tasks:insert"
        | "tasks:update"
        | "tasks:delete";
      app_role: "admin" | "user";
      resource_type: "table" | "view";
      task_label: "bug" | "feature" | "enhancement" | "documentation";
      task_priority: "low" | "medium" | "high";
      task_status: "todo" | "in-progress" | "done" | "canceled";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_permission: [
        "tasks",
        "tasks:select",
        "tasks:insert",
        "tasks:update",
        "tasks:delete",
      ],
      app_role: ["admin", "user"],
      resource_type: ["table", "view"],
      task_label: ["bug", "feature", "enhancement", "documentation"],
      task_priority: ["low", "medium", "high"],
      task_status: ["todo", "in-progress", "done", "canceled"],
    },
  },
} as const;
