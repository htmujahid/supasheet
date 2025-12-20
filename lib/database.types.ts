export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      file_object: {
        name: string | null;
        type: string | null;
        size: number | null;
        url: string | null;
        last_modified: string | null;
      };
    };
  };
  supasheet: {
    Tables: {
      accounts: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          email: string | null;
          id: string;
          name: string;
          picture_url: string | null;
          public_data: Json;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          email?: string | null;
          id?: string;
          name: string;
          picture_url?: string | null;
          public_data?: Json;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          email?: string | null;
          id?: string;
          name?: string;
          picture_url?: string | null;
          public_data?: Json;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          changed_fields: string[] | null;
          created_at: string;
          created_by: string | null;
          error_code: string | null;
          error_message: string | null;
          id: string;
          is_error: boolean | null;
          metadata: Json | null;
          new_data: Json | null;
          old_data: Json | null;
          operation: string;
          record_id: string | null;
          role: Database["supasheet"]["Enums"]["app_role"] | null;
          schema_name: string;
          table_name: string;
          user_type: string;
        };
        Insert: {
          changed_fields?: string[] | null;
          created_at?: string;
          created_by?: string | null;
          error_code?: string | null;
          error_message?: string | null;
          id?: string;
          is_error?: boolean | null;
          metadata?: Json | null;
          new_data?: Json | null;
          old_data?: Json | null;
          operation: string;
          record_id?: string | null;
          role?: Database["supasheet"]["Enums"]["app_role"] | null;
          schema_name: string;
          table_name: string;
          user_type?: string;
        };
        Update: {
          changed_fields?: string[] | null;
          created_at?: string;
          created_by?: string | null;
          error_code?: string | null;
          error_message?: string | null;
          id?: string;
          is_error?: boolean | null;
          metadata?: Json | null;
          new_data?: Json | null;
          old_data?: Json | null;
          operation?: string;
          record_id?: string | null;
          role?: Database["supasheet"]["Enums"]["app_role"] | null;
          schema_name?: string;
          table_name?: string;
          user_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      columns: {
        Row: {
          actual_type: string | null;
          check: string | null;
          comment: string | null;
          data_type: string | null;
          default_value: string | null;
          enums: Json | null;
          format: string | null;
          id: string;
          identity_generation: string | null;
          is_generated: boolean | null;
          is_identity: boolean | null;
          is_nullable: boolean | null;
          is_unique: boolean | null;
          is_updatable: boolean | null;
          name: string | null;
          ordinal_position: string | null;
          schema: string | null;
          table: string | null;
          table_id: number | null;
        };
        Insert: {
          actual_type?: string | null;
          check?: string | null;
          comment?: string | null;
          data_type?: string | null;
          default_value?: string | null;
          enums?: Json | null;
          format?: string | null;
          id: string;
          identity_generation?: string | null;
          is_generated?: boolean | null;
          is_identity?: boolean | null;
          is_nullable?: boolean | null;
          is_unique?: boolean | null;
          is_updatable?: boolean | null;
          name?: string | null;
          ordinal_position?: string | null;
          schema?: string | null;
          table?: string | null;
          table_id?: number | null;
        };
        Update: {
          actual_type?: string | null;
          check?: string | null;
          comment?: string | null;
          data_type?: string | null;
          default_value?: string | null;
          enums?: Json | null;
          format?: string | null;
          id?: string;
          identity_generation?: string | null;
          is_generated?: boolean | null;
          is_identity?: boolean | null;
          is_nullable?: boolean | null;
          is_unique?: boolean | null;
          is_updatable?: boolean | null;
          name?: string | null;
          ordinal_position?: string | null;
          schema?: string | null;
          table?: string | null;
          table_id?: number | null;
        };
        Relationships: [];
      };
      materialized_views: {
        Row: {
          comment: string | null;
          id: number;
          is_populated: boolean | null;
          name: string | null;
          schema: string | null;
        };
        Insert: {
          comment?: string | null;
          id: number;
          is_populated?: boolean | null;
          name?: string | null;
          schema?: string | null;
        };
        Update: {
          comment?: string | null;
          id?: number;
          is_populated?: boolean | null;
          name?: string | null;
          schema?: string | null;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          id: number;
          permission: Database["supasheet"]["Enums"]["app_permission"];
          role: Database["supasheet"]["Enums"]["app_role"];
        };
        Insert: {
          id?: number;
          permission: Database["supasheet"]["Enums"]["app_permission"];
          role: Database["supasheet"]["Enums"]["app_role"];
        };
        Update: {
          id?: number;
          permission?: Database["supasheet"]["Enums"]["app_permission"];
          role?: Database["supasheet"]["Enums"]["app_role"];
        };
        Relationships: [];
      };
      tables: {
        Row: {
          bytes: number | null;
          comment: string | null;
          dead_rows_estimate: number | null;
          id: number;
          live_rows_estimate: number | null;
          name: string | null;
          primary_keys: Json | null;
          relationships: Json | null;
          replica_identity: string | null;
          rls_enabled: boolean | null;
          rls_forced: boolean | null;
          schema: string | null;
          size: string | null;
        };
        Insert: {
          bytes?: number | null;
          comment?: string | null;
          dead_rows_estimate?: number | null;
          id: number;
          live_rows_estimate?: number | null;
          name?: string | null;
          primary_keys?: Json | null;
          relationships?: Json | null;
          replica_identity?: string | null;
          rls_enabled?: boolean | null;
          rls_forced?: boolean | null;
          schema?: string | null;
          size?: string | null;
        };
        Update: {
          bytes?: number | null;
          comment?: string | null;
          dead_rows_estimate?: number | null;
          id?: number;
          live_rows_estimate?: number | null;
          name?: string | null;
          primary_keys?: Json | null;
          relationships?: Json | null;
          replica_identity?: string | null;
          rls_enabled?: boolean | null;
          rls_forced?: boolean | null;
          schema?: string | null;
          size?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          account_id: string;
          id: number;
          role: Database["supasheet"]["Enums"]["app_role"];
        };
        Insert: {
          account_id: string;
          id?: number;
          role: Database["supasheet"]["Enums"]["app_role"];
        };
        Update: {
          account_id?: string;
          id?: number;
          role?: Database["supasheet"]["Enums"]["app_role"];
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
      views: {
        Row: {
          comment: string | null;
          id: number;
          is_updatable: boolean | null;
          name: string | null;
          schema: string | null;
        };
        Insert: {
          comment?: string | null;
          id: number;
          is_updatable?: boolean | null;
          name?: string | null;
          schema?: string | null;
        };
        Update: {
          comment?: string | null;
          id?: number;
          is_updatable?: boolean | null;
          name?: string | null;
          schema?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_audit_log: {
        Args: {
          p_metadata?: Json;
          p_new_data?: Json;
          p_old_data?: Json;
          p_operation: string;
          p_record_id?: string;
          p_schema_name: string;
          p_table_name: string;
        };
        Returns: string;
      };
      generate_columns: {
        Args: {
          column_name_filter?: string;
          ids_filter?: string;
          limit_count?: number;
          offset_count?: number;
          schema_filter?: string;
          table_id_filter?: string;
          table_identifier_filter?: string;
        };
        Returns: {
          actual_type: string;
          check: string;
          comment: string;
          data_type: string;
          default_value: string;
          enums: Json;
          format: string;
          id: string;
          identity_generation: string;
          is_generated: boolean;
          is_identity: boolean;
          is_nullable: boolean;
          is_unique: boolean;
          is_updatable: boolean;
          name: string;
          ordinal_position: string;
          schema: string;
          table: string;
          table_id: number;
        }[];
      };
      generate_materialized_views: {
        Args: {
          ids_filter?: string;
          limit_count?: number;
          materialized_view_identifier_filter?: string;
          offset_count?: number;
          schema_filter?: string;
        };
        Returns: {
          comment: string;
          id: number;
          is_populated: boolean;
          name: string;
          schema: string;
        }[];
      };
      generate_tables: {
        Args: {
          ids_filter?: string;
          limit_count?: number;
          offset_count?: number;
          schema_filter?: string;
          table_identifier_filter?: string;
        };
        Returns: {
          bytes: number;
          comment: string;
          dead_rows_estimate: number;
          id: number;
          live_rows_estimate: number;
          name: string;
          primary_keys: Json;
          relationships: Json;
          replica_identity: string;
          rls_enabled: boolean;
          rls_forced: boolean;
          schema: string;
          size: string;
        }[];
      };
      generate_views: {
        Args: {
          ids_filter?: string;
          limit_count?: number;
          offset_count?: number;
          schema_filter?: string;
          view_identifier_filter?: string;
        };
        Returns: {
          comment: string;
          id: number;
          is_updatable: boolean;
          name: string;
          schema: string;
        }[];
      };
      get_charts: {
        Args: { p_schema?: string };
        Returns: {
          comment: string;
          id: number;
          is_updatable: boolean;
          name: string;
          schema: string;
        }[];
      };
      get_columns: {
        Args: { schema_name?: string; table_name?: string };
        Returns: {
          actual_type: string | null;
          check: string | null;
          comment: string | null;
          data_type: string | null;
          default_value: string | null;
          enums: Json | null;
          format: string | null;
          id: string;
          identity_generation: string | null;
          is_generated: boolean | null;
          is_identity: boolean | null;
          is_nullable: boolean | null;
          is_unique: boolean | null;
          is_updatable: boolean | null;
          name: string | null;
          ordinal_position: string | null;
          schema: string | null;
          table: string | null;
          table_id: number | null;
        }[];
      };
      get_materialized_views: {
        Args: { schema_name?: string; view_name?: string };
        Returns: {
          comment: string | null;
          id: number;
          is_populated: boolean | null;
          name: string | null;
          schema: string | null;
        }[];
      };
      get_related_tables: {
        Args: { schema_name: string; table_name: string };
        Returns: {
          bytes: number;
          columns: Database["supasheet"]["Tables"]["columns"]["Row"][];
          comment: string;
          dead_rows_estimate: number;
          id: number;
          live_rows_estimate: number;
          name: string;
          primary_keys: Json;
          relationships: Json;
          replica_identity: string;
          rls_enabled: boolean;
          rls_forced: boolean;
          schema: string;
          size: string;
        }[];
      };
      get_reports: {
        Args: { p_schema?: string };
        Returns: {
          comment: string;
          id: number;
          is_updatable: boolean;
          name: string;
          schema: string;
        }[];
      };
      get_schemas: {
        Args: Record<PropertyKey, never>;
        Returns: {
          schema: string;
        }[];
      };
      get_storage_filename_as_uuid: {
        Args: { name: string };
        Returns: string;
      };
      get_tables: {
        Args: { schema_name?: string; table_name?: string };
        Returns: {
          bytes: number | null;
          comment: string | null;
          dead_rows_estimate: number | null;
          id: number;
          live_rows_estimate: number | null;
          name: string | null;
          primary_keys: Json | null;
          relationships: Json | null;
          replica_identity: string | null;
          rls_enabled: boolean | null;
          rls_forced: boolean | null;
          schema: string | null;
          size: string | null;
        }[];
      };
      get_views: {
        Args: { schema_name?: string; view_name?: string };
        Returns: {
          comment: string | null;
          id: number;
          is_updatable: boolean | null;
          name: string | null;
          schema: string | null;
        }[];
      };
      get_widgets: {
        Args: { p_schema?: string };
        Returns: {
          comment: string;
          id: number;
          is_updatable: boolean;
          name: string;
          schema: string;
        }[];
      };
      has_permission: {
        Args: {
          requested_permission: Database["supasheet"]["Enums"]["app_permission"];
        };
        Returns: boolean;
      };
      has_role: {
        Args: { requested_role: Database["supasheet"]["Enums"]["app_role"] };
        Returns: boolean;
      };
    };
    Enums: {
      app_permission:
        | "supasheet.accounts:select"
        | "supasheet.accounts:update"
        | "supasheet.accounts:insert"
        | "supasheet.accounts:delete";
      app_role: "x-admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  supasheet: {
    Enums: {
      app_permission: [
        "supasheet.accounts:select",
        "supasheet.accounts:update",
        "supasheet.accounts:insert",
        "supasheet.accounts:delete",
      ],
      app_role: ["x-admin", "user"],
    },
  },
} as const;
