export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  charts: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      task_completion_line: {
        Row: {
          completed: number | null;
          created: number | null;
          date: string | null;
        };
        Relationships: [];
      };
      task_metrics_radar: {
        Row: {
          completed: number | null;
          metric: Database["public"]["Enums"]["task_priority"] | null;
          overdue: number | null;
          total: number | null;
        };
        Relationships: [];
      };
      task_priority_bar: {
        Row: {
          completed: number | null;
          label: Database["public"]["Enums"]["task_priority"] | null;
          total: number | null;
        };
        Relationships: [];
      };
      task_status_pie: {
        Row: {
          label: Database["public"]["Enums"]["task_status"] | null;
          value: number | null;
        };
        Relationships: [];
      };
      task_trend_area: {
        Row: {
          active: number | null;
          completed: number | null;
          date: string | null;
          pending: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  dashboards: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      active_tasks_simple: {
        Row: {
          due: string | null;
          priority: Database["public"]["Enums"]["task_priority"] | null;
          title: string | null;
        };
        Relationships: [];
      };
      task_analytics_detailed: {
        Row: {
          created: string | null;
          priority: Database["public"]["Enums"]["task_priority"] | null;
          status: Database["public"]["Enums"]["task_status"] | null;
          tags: string | null;
          task: string | null;
        };
        Relationships: [];
      };
      task_completion_rate: {
        Row: {
          primary: number | null;
          primary_label: string | null;
          secondary: number | null;
          secondary_label: string | null;
        };
        Relationships: [];
      };
      task_list_detailed: {
        Row: {
          created: string | null;
          due: string | null;
          priority: Database["public"]["Enums"]["task_priority"] | null;
          status: Database["public"]["Enums"]["task_status"] | null;
          title: string | null;
        };
        Relationships: [];
      };
      task_list_simple: {
        Row: {
          priority: Database["public"]["Enums"]["task_priority"] | null;
          status: Database["public"]["Enums"]["task_status"] | null;
          title: string | null;
        };
        Relationships: [];
      };
      task_summary: {
        Row: {
          icon: string | null;
          label: string | null;
          value: number | null;
        };
        Relationships: [];
      };
      task_urgent_count: {
        Row: {
          current: number | null;
          segments: Json | null;
          total: number | null;
        };
        Relationships: [];
      };
      tasks_by_status: {
        Row: {
          percent: number | null;
          value: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
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
          query?: string;
          operationName?: string;
          variables?: Json;
          extensions?: Json;
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
      tasks: {
        Row: {
          account_id: string | null;
          completed_at: string | null;
          created_at: string | null;
          description: string | null;
          due_date: string | null;
          id: string;
          is_important: boolean | null;
          priority: Database["public"]["Enums"]["task_priority"] | null;
          status: Database["public"]["Enums"]["task_status"] | null;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          account_id?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          is_important?: boolean | null;
          priority?: Database["public"]["Enums"]["task_priority"] | null;
          status?: Database["public"]["Enums"]["task_status"] | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          account_id?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          is_important?: boolean | null;
          priority?: Database["public"]["Enums"]["task_priority"] | null;
          status?: Database["public"]["Enums"]["task_status"] | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      vw_tasks: {
        Row: {
          account_id: string | null;
          account_name: string | null;
          completed_at: string | null;
          created_at: string | null;
          description: string | null;
          due_date: string | null;
          id: string | null;
          is_important: boolean | null;
          priority: Database["public"]["Enums"]["task_priority"] | null;
          status: Database["public"]["Enums"]["task_status"] | null;
          tags: string[] | null;
          title: string | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      task_priority: "low" | "medium" | "high" | "urgent";
      task_status: "pending" | "in_progress" | "completed" | "archived";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  reports: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      task_report: {
        Row: {
          account_id: string | null;
          account_name: string | null;
          completed_at: string | null;
          created_at: string | null;
          description: string | null;
          due_date: string | null;
          id: string | null;
          is_important: boolean | null;
          priority: Database["public"]["Enums"]["task_priority"] | null;
          status: Database["public"]["Enums"]["task_status"] | null;
          tags: string[] | null;
          title: string | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
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
      charts: {
        Row: {
          caption: string | null;
          chart_type: string;
          description: string | null;
          group: string | null;
          id: string;
          is_active: boolean;
          name: string;
          view_name: string | null;
        };
        Insert: {
          caption?: string | null;
          chart_type: string;
          description?: string | null;
          group?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          view_name?: string | null;
        };
        Update: {
          caption?: string | null;
          chart_type?: string;
          description?: string | null;
          group?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          view_name?: string | null;
        };
        Relationships: [];
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
      dashboards: {
        Row: {
          caption: string | null;
          description: string | null;
          filter_field: string | null;
          group: string | null;
          id: string;
          is_active: boolean;
          name: string;
          view_name: string | null;
          widget_type: string;
        };
        Insert: {
          caption?: string | null;
          description?: string | null;
          filter_field?: string | null;
          group?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          view_name?: string | null;
          widget_type: string;
        };
        Update: {
          caption?: string | null;
          description?: string | null;
          filter_field?: string | null;
          group?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          view_name?: string | null;
          widget_type?: string;
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
      reports: {
        Row: {
          description: string | null;
          filter_field: string | null;
          group: string | null;
          id: string;
          is_active: boolean;
          name: string;
          view_name: string | null;
        };
        Insert: {
          description?: string | null;
          filter_field?: string | null;
          group?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          view_name?: string | null;
        };
        Update: {
          description?: string | null;
          filter_field?: string | null;
          group?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          view_name?: string | null;
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
          p_table_name: string;
          p_metadata?: Json;
          p_record_id?: string;
          p_new_data?: Json;
          p_old_data?: Json;
          p_operation: string;
          p_schema_name: string;
        };
        Returns: string;
      };
      generate_columns: {
        Args: {
          schema_filter?: string;
          table_id_filter?: string;
          table_identifier_filter?: string;
          column_name_filter?: string;
          ids_filter?: string;
          limit_count?: number;
          offset_count?: number;
        };
        Returns: {
          schema: string;
          table_id: number;
          table: string;
          id: string;
          ordinal_position: string;
          name: string;
          default_value: string;
          data_type: string;
          actual_type: string;
          format: string;
          is_identity: boolean;
          identity_generation: string;
          is_generated: boolean;
          is_nullable: boolean;
          is_updatable: boolean;
          is_unique: boolean;
          check: string;
          enums: Json;
          comment: string;
        }[];
      };
      generate_materialized_views: {
        Args: {
          schema_filter?: string;
          ids_filter?: string;
          materialized_view_identifier_filter?: string;
          limit_count?: number;
          offset_count?: number;
        };
        Returns: {
          schema: string;
          is_populated: boolean;
          comment: string;
          id: number;
          name: string;
        }[];
      };
      generate_tables: {
        Args: {
          table_identifier_filter?: string;
          schema_filter?: string;
          ids_filter?: string;
          limit_count?: number;
          offset_count?: number;
        };
        Returns: {
          id: number;
          schema: string;
          name: string;
          rls_enabled: boolean;
          rls_forced: boolean;
          replica_identity: string;
          bytes: number;
          size: string;
          live_rows_estimate: number;
          dead_rows_estimate: number;
          comment: string;
          primary_keys: Json;
          relationships: Json;
        }[];
      };
      generate_views: {
        Args: {
          limit_count?: number;
          offset_count?: number;
          schema_filter?: string;
          ids_filter?: string;
          view_identifier_filter?: string;
        };
        Returns: {
          id: number;
          comment: string;
          is_updatable: boolean;
          name: string;
          schema: string;
        }[];
      };
      get_chart_groups: {
        Args: Record<PropertyKey, never>;
        Returns: {
          charts_count: number;
          group_name: string;
        }[];
      };
      get_charts: {
        Args: { p_group?: string };
        Returns: {
          caption: string | null;
          chart_type: string;
          description: string | null;
          group: string | null;
          id: string;
          is_active: boolean;
          name: string;
          view_name: string | null;
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
      get_dashboards: {
        Args: Record<PropertyKey, never>;
        Returns: {
          widgets_count: number;
          group_name: string;
        }[];
      };
      get_materialized_views: {
        Args: { view_name?: string; schema_name?: string };
        Returns: {
          comment: string | null;
          id: number;
          is_populated: boolean | null;
          name: string | null;
          schema: string | null;
        }[];
      };
      get_report_groups: {
        Args: Record<PropertyKey, never>;
        Returns: {
          group_name: string;
          report_count: number;
        }[];
      };
      get_reports: {
        Args: { p_group?: string };
        Returns: {
          description: string | null;
          filter_field: string | null;
          group: string | null;
          id: string;
          is_active: boolean;
          name: string;
          view_name: string | null;
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
        Args: { table_name?: string; schema_name?: string };
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
        Args: { view_name?: string; schema_name?: string };
        Returns: {
          comment: string | null;
          id: number;
          is_updatable: boolean | null;
          name: string | null;
          schema: string | null;
        }[];
      };
      get_widgets: {
        Args: { p_group?: string };
        Returns: {
          caption: string | null;
          description: string | null;
          filter_field: string | null;
          group: string | null;
          id: string;
          is_active: boolean;
          name: string;
          view_name: string | null;
          widget_type: string;
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
        | "supasheet.accounts:delete"
        | "public.tasks:select"
        | "public.tasks:insert"
        | "public.tasks:update"
        | "public.tasks:delete"
        | "public.vw_tasks:select"
        | "reports.task_report:select"
        | "dashboards.task_summary:select"
        | "dashboards.task_completion_rate:select"
        | "dashboards.tasks_by_status:select"
        | "dashboards.task_urgent_count:select"
        | "dashboards.task_list_simple:select"
        | "dashboards.active_tasks_simple:select"
        | "dashboards.task_list_detailed:select"
        | "dashboards.task_analytics_detailed:select"
        | "charts.task_trend_area:select"
        | "charts.task_priority_bar:select"
        | "charts.task_completion_line:select"
        | "charts.task_status_pie:select"
        | "charts.task_metrics_radar:select";
      app_role: "x-admin" | "user";
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
  charts: {
    Enums: {},
  },
  dashboards: {
    Enums: {},
  },
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["pending", "in_progress", "completed", "archived"],
    },
  },
  reports: {
    Enums: {},
  },
  supasheet: {
    Enums: {
      app_permission: [
        "supasheet.accounts:select",
        "supasheet.accounts:update",
        "supasheet.accounts:insert",
        "supasheet.accounts:delete",
        "public.tasks:select",
        "public.tasks:insert",
        "public.tasks:update",
        "public.tasks:delete",
        "public.vw_tasks:select",
        "reports.task_report:select",
        "dashboards.task_summary:select",
        "dashboards.task_completion_rate:select",
        "dashboards.tasks_by_status:select",
        "dashboards.task_urgent_count:select",
        "dashboards.task_list_simple:select",
        "dashboards.active_tasks_simple:select",
        "dashboards.task_list_detailed:select",
        "dashboards.task_analytics_detailed:select",
        "charts.task_trend_area:select",
        "charts.task_priority_bar:select",
        "charts.task_completion_line:select",
        "charts.task_status_pie:select",
        "charts.task_metrics_radar:select",
      ],
      app_role: ["x-admin", "user"],
    },
  },
} as const;
