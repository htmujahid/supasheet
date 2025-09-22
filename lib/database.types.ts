export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      dashboards: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id: string
          name: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      report_items: {
        Row: {
          description: string | null
          id: string
          is_active: boolean
          name: string
          report_id: string
          view_name: string | null
        }
        Insert: {
          description?: string | null
          id: string
          is_active?: boolean
          name: string
          report_id: string
          view_name?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          report_id?: string
          view_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_items_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id: string
          name: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          account_id: string
          archived: boolean
          code: string
          created_at: string
          due_date: string
          estimated_hours: number
          id: string
          label: Database["public"]["Enums"]["task_label"]
          priority: Database["public"]["Enums"]["task_priority"]
          start_date: string
          status: Database["public"]["Enums"]["task_status"]
          title: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          archived?: boolean
          code: string
          created_at?: string
          due_date?: string
          estimated_hours?: number
          id?: string
          label?: Database["public"]["Enums"]["task_label"]
          priority?: Database["public"]["Enums"]["task_priority"]
          start_date?: string
          status?: Database["public"]["Enums"]["task_status"]
          title?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          archived?: boolean
          code?: string
          created_at?: string
          due_date?: string
          estimated_hours?: number
          id?: string
          label?: Database["public"]["Enums"]["task_label"]
          priority?: Database["public"]["Enums"]["task_priority"]
          start_date?: string
          status?: Database["public"]["Enums"]["task_status"]
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      widgets: {
        Row: {
          dashboard_id: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          view_name: string | null
          widget_type: string
        }
        Insert: {
          dashboard_id: string
          description?: string | null
          id: string
          is_active?: boolean
          name: string
          view_name?: string | null
          widget_type: string
        }
        Update: {
          dashboard_id?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          view_name?: string | null
          widget_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      task_summary_view: {
        Row: {
          bug_count: number | null
          canceled_count: number | null
          completed_hours: number | null
          documentation_count: number | null
          done_count: number | null
          due_today_count: number | null
          due_tomorrow_count: number | null
          enhancement_count: number | null
          feature_count: number | null
          high_priority_count: number | null
          in_progress_count: number | null
          low_priority_count: number | null
          medium_priority_count: number | null
          overdue_count: number | null
          remaining_hours: number | null
          todo_count: number | null
          total_estimated_hours: number | null
          total_tasks: number | null
        }
        Relationships: []
      }
      task_view: {
        Row: {
          account_email: string | null
          account_id: string | null
          account_name: string | null
          archived: boolean | null
          code: string | null
          created_at: string | null
          days_overdue: number | null
          days_since_created: number | null
          days_until_due: number | null
          due_date: string | null
          duration_hours: number | null
          estimated_hours: number | null
          id: string | null
          label: Database["public"]["Enums"]["task_label"] | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          priority_score: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          status_order: number | null
          title: string | null
          updated_at: string | null
          urgency_status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_label: "bug" | "feature" | "enhancement" | "documentation"
      task_priority: "low" | "medium" | "high"
      task_status: "todo" | "in-progress" | "done" | "canceled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  supasheet: {
    Tables: {
      accounts: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          picture_url: string | null
          public_data: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          picture_url?: string | null
          public_data?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          picture_url?: string | null
          public_data?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      columns: {
        Row: {
          actual_type: string | null
          check: string | null
          comment: string | null
          data_type: string | null
          default_value: string | null
          enums: Json | null
          format: string | null
          id: string | null
          identity_generation: string | null
          is_generated: boolean | null
          is_identity: boolean | null
          is_nullable: boolean | null
          is_unique: boolean | null
          is_updatable: boolean | null
          name: string | null
          ordinal_position: string | null
          schema: string | null
          table: string | null
          table_id: number | null
        }
        Insert: {
          actual_type?: string | null
          check?: string | null
          comment?: string | null
          data_type?: string | null
          default_value?: string | null
          enums?: Json | null
          format?: string | null
          id?: string | null
          identity_generation?: string | null
          is_generated?: boolean | null
          is_identity?: boolean | null
          is_nullable?: boolean | null
          is_unique?: boolean | null
          is_updatable?: boolean | null
          name?: string | null
          ordinal_position?: string | null
          schema?: string | null
          table?: string | null
          table_id?: number | null
        }
        Update: {
          actual_type?: string | null
          check?: string | null
          comment?: string | null
          data_type?: string | null
          default_value?: string | null
          enums?: Json | null
          format?: string | null
          id?: string | null
          identity_generation?: string | null
          is_generated?: boolean | null
          is_identity?: boolean | null
          is_nullable?: boolean | null
          is_unique?: boolean | null
          is_updatable?: boolean | null
          name?: string | null
          ordinal_position?: string | null
          schema?: string | null
          table?: string | null
          table_id?: number | null
        }
        Relationships: []
      }
      materialized_views: {
        Row: {
          comment: string | null
          id: number | null
          is_populated: boolean | null
          name: string | null
          schema: string | null
        }
        Insert: {
          comment?: string | null
          id?: number | null
          is_populated?: boolean | null
          name?: string | null
          schema?: string | null
        }
        Update: {
          comment?: string | null
          id?: number | null
          is_populated?: boolean | null
          name?: string | null
          schema?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["supasheet"]["Enums"]["app_permission"]
          role: Database["supasheet"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["supasheet"]["Enums"]["app_permission"]
          role: Database["supasheet"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["supasheet"]["Enums"]["app_permission"]
          role?: Database["supasheet"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      tables: {
        Row: {
          bytes: number | null
          comment: string | null
          dead_rows_estimate: number | null
          id: number | null
          live_rows_estimate: number | null
          name: string | null
          primary_keys: Json | null
          relationships: Json | null
          replica_identity: string | null
          rls_enabled: boolean | null
          rls_forced: boolean | null
          schema: string | null
          size: string | null
        }
        Insert: {
          bytes?: number | null
          comment?: string | null
          dead_rows_estimate?: number | null
          id?: number | null
          live_rows_estimate?: number | null
          name?: string | null
          primary_keys?: Json | null
          relationships?: Json | null
          replica_identity?: string | null
          rls_enabled?: boolean | null
          rls_forced?: boolean | null
          schema?: string | null
          size?: string | null
        }
        Update: {
          bytes?: number | null
          comment?: string | null
          dead_rows_estimate?: number | null
          id?: number | null
          live_rows_estimate?: number | null
          name?: string | null
          primary_keys?: Json | null
          relationships?: Json | null
          replica_identity?: string | null
          rls_enabled?: boolean | null
          rls_forced?: boolean | null
          schema?: string | null
          size?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          account_id: string
          id: number
          role: Database["supasheet"]["Enums"]["app_role"]
        }
        Insert: {
          account_id: string
          id?: number
          role: Database["supasheet"]["Enums"]["app_role"]
        }
        Update: {
          account_id?: string
          id?: number
          role?: Database["supasheet"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      views: {
        Row: {
          comment: string | null
          id: number | null
          is_updatable: boolean | null
          name: string | null
          schema: string | null
        }
        Insert: {
          comment?: string | null
          id?: number | null
          is_updatable?: boolean | null
          name?: string | null
          schema?: string | null
        }
        Update: {
          comment?: string | null
          id?: number | null
          is_updatable?: boolean | null
          name?: string | null
          schema?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_columns: {
        Args: {
          schema_filter?: string
          table_id_filter?: string
          table_identifier_filter?: string
          column_name_filter?: string
          ids_filter?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          table_id: number
          schema: string
          table: string
          id: string
          ordinal_position: string
          name: string
          default_value: string
          data_type: string
          actual_type: string
          format: string
          is_identity: boolean
          identity_generation: string
          is_generated: boolean
          is_nullable: boolean
          is_updatable: boolean
          is_unique: boolean
          check: string
          enums: Json
          comment: string
        }[]
      }
      get_materialized_views: {
        Args: {
          schema_filter?: string
          ids_filter?: string
          materialized_view_identifier_filter?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: number
          schema: string
          name: string
          is_populated: boolean
          comment: string
        }[]
      }
      get_storage_filename_as_uuid: {
        Args: { name: string }
        Returns: string
      }
      get_tables: {
        Args: {
          schema_filter?: string
          ids_filter?: string
          table_identifier_filter?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: number
          schema: string
          name: string
          rls_enabled: boolean
          rls_forced: boolean
          replica_identity: string
          bytes: number
          size: string
          live_rows_estimate: number
          dead_rows_estimate: number
          comment: string
          primary_keys: Json
          relationships: Json
        }[]
      }
      get_views: {
        Args: {
          schema_filter?: string
          ids_filter?: string
          view_identifier_filter?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: number
          schema: string
          name: string
          is_updatable: boolean
          comment: string
        }[]
      }
      has_permission: {
        Args: {
          requested_permission: Database["supasheet"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      has_role: {
        Args: { requested_role: Database["supasheet"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_permission:
        | "resource:accounts:select"
        | "resource:accounts:update"
        | "resource:accounts:insert"
        | "resource:accounts:delete"
        | "tasks"
        | "tasks:select"
        | "tasks:insert"
        | "tasks:update"
        | "tasks:delete"
        | "task_view"
        | "task_summary_view"
      app_role: "x-admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      task_label: ["bug", "feature", "enhancement", "documentation"],
      task_priority: ["low", "medium", "high"],
      task_status: ["todo", "in-progress", "done", "canceled"],
    },
  },
  supasheet: {
    Enums: {
      app_permission: [
        "resource:accounts:select",
        "resource:accounts:update",
        "resource:accounts:insert",
        "resource:accounts:delete",
        "tasks",
        "tasks:select",
        "tasks:insert",
        "tasks:update",
        "tasks:delete",
        "task_view",
        "task_summary_view",
      ],
      app_role: ["x-admin", "user"],
    },
  },
} as const

