export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  charts: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  dashboards: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      tasks: {
        Row: {
          account_id: string | null
          attachments: string[] | null
          color: string | null
          completed_at: string | null
          completion: number | null
          cover: string[] | null
          created_at: string | null
          description: string | null
          due_date: string | null
          duration: number | null
          id: string
          is_important: boolean | null
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          attachments?: string[] | null
          color?: string | null
          completed_at?: string | null
          completion?: number | null
          cover?: string[] | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          duration?: number | null
          id?: string
          is_important?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          attachments?: string[] | null
          color?: string | null
          completed_at?: string | null
          completion?: number | null
          cover?: string[] | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          duration?: number | null
          id?: string
          is_important?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_details: {
        Row: {
          avatar: string | null
          created_at: string
          created_by: string | null
          department: Database["public"]["Enums"]["user_department"] | null
          email: string
          id: number
          join_date: string | null
          last_active: string | null
          name: string
          notes: string | null
          phone: string | null
          projects: number | null
          rating: number | null
          role: Database["public"]["Enums"]["user_role"]
          salary: unknown | null
          skills: Database["public"]["Enums"]["user_skill"][] | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          verified: boolean
          website: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          created_by?: string | null
          department?: Database["public"]["Enums"]["user_department"] | null
          email: string
          id?: never
          join_date?: string | null
          last_active?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          projects?: number | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          salary?: unknown | null
          skills?: Database["public"]["Enums"]["user_skill"][] | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          verified?: boolean
          website?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          created_by?: string | null
          department?: Database["public"]["Enums"]["user_department"] | null
          email?: string
          id?: never
          join_date?: string | null
          last_active?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          projects?: number | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          salary?: unknown | null
          skills?: Database["public"]["Enums"]["user_skill"][] | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          verified?: boolean
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      active_tasks_simple: {
        Row: {
          due: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          title: string | null
        }
        Relationships: []
      }
      task_analytics_detailed: {
        Row: {
          attachments: string[] | null
          completion: number | null
          created: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string | null
          task: string | null
        }
        Relationships: []
      }
      task_completion_line: {
        Row: {
          completed: number | null
          created: number | null
          date: string | null
        }
        Relationships: []
      }
      task_completion_rate: {
        Row: {
          primary: number | null
          primary_label: string | null
          secondary: number | null
          secondary_label: string | null
        }
        Relationships: []
      }
      task_list_detailed: {
        Row: {
          completion: number | null
          created: string | null
          due: string | null
          duration: number | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string | null
        }
        Relationships: []
      }
      task_list_simple: {
        Row: {
          completion: number | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string | null
        }
        Relationships: []
      }
      task_metrics_radar: {
        Row: {
          completed: number | null
          metric: Database["public"]["Enums"]["task_priority"] | null
          overdue: number | null
          total: number | null
        }
        Relationships: []
      }
      task_priority_bar: {
        Row: {
          completed: number | null
          label: Database["public"]["Enums"]["task_priority"] | null
          total: number | null
        }
        Relationships: []
      }
      task_report: {
        Row: {
          account_id: string | null
          account_name: string | null
          attachments: string[] | null
          color: string | null
          completed_at: string | null
          completion: number | null
          cover: string[] | null
          created_at: string | null
          description: string | null
          due_date: string | null
          duration: number | null
          id: string | null
          is_important: boolean | null
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      task_status_pie: {
        Row: {
          label: Database["public"]["Enums"]["task_status"] | null
          value: number | null
        }
        Relationships: []
      }
      task_summary: {
        Row: {
          icon: string | null
          label: string | null
          value: number | null
        }
        Relationships: []
      }
      task_trend_area: {
        Row: {
          active: number | null
          completed: number | null
          date: string | null
          pending: number | null
        }
        Relationships: []
      }
      task_urgent_count: {
        Row: {
          current: number | null
          segments: Json | null
          total: number | null
        }
        Relationships: []
      }
      tasks_by_status: {
        Row: {
          percent: number | null
          value: number | null
        }
        Relationships: []
      }
      user_tasks: {
        Row: {
          account_id: string | null
          account_name: string | null
          attachments: string[] | null
          color: string | null
          completed_at: string | null
          completion: number | null
          cover: string[] | null
          created_at: string | null
          description: string | null
          due_date: string | null
          duration: number | null
          id: string | null
          is_important: boolean | null
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "pending" | "in_progress" | "completed" | "archived"
      user_department:
        | "engineering"
        | "marketing"
        | "sales"
        | "design"
        | "operations"
        | "hr"
        | "finance"
        | "product"
      user_role: "admin" | "user" | "moderator"
      user_skill:
        | "security"
        | "swift"
        | "kotlin"
        | "devops"
        | "javascript"
        | "rust"
        | "php"
        | "sql"
        | "nosql"
        | "cloud"
        | "java"
        | "go"
      user_status: "active" | "inactive" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  reports: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
      audit_logs: {
        Row: {
          changed_fields: string[] | null
          created_at: string
          created_by: string | null
          error_code: string | null
          error_message: string | null
          id: string
          is_error: boolean | null
          metadata: Json | null
          new_data: Json | null
          old_data: Json | null
          operation: string
          record_id: string | null
          role: Database["supasheet"]["Enums"]["app_role"] | null
          schema_name: string
          table_name: string
          user_type: string
        }
        Insert: {
          changed_fields?: string[] | null
          created_at?: string
          created_by?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          is_error?: boolean | null
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          record_id?: string | null
          role?: Database["supasheet"]["Enums"]["app_role"] | null
          schema_name: string
          table_name: string
          user_type?: string
        }
        Update: {
          changed_fields?: string[] | null
          created_at?: string
          created_by?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          is_error?: boolean | null
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          record_id?: string | null
          role?: Database["supasheet"]["Enums"]["app_role"] | null
          schema_name?: string
          table_name?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      charts: {
        Row: {
          caption: string | null
          chart_type: string
          description: string | null
          group: string | null
          id: string
          is_active: boolean
          name: string
          view_name: string | null
        }
        Insert: {
          caption?: string | null
          chart_type: string
          description?: string | null
          group?: string | null
          id?: string
          is_active?: boolean
          name: string
          view_name?: string | null
        }
        Update: {
          caption?: string | null
          chart_type?: string
          description?: string | null
          group?: string | null
          id?: string
          is_active?: boolean
          name?: string
          view_name?: string | null
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
          id: string
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
          id: string
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
          id?: string
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
      dashboards: {
        Row: {
          caption: string | null
          description: string | null
          filter_field: string | null
          group: string | null
          id: string
          is_active: boolean
          name: string
          view_name: string | null
          widget_type: string
        }
        Insert: {
          caption?: string | null
          description?: string | null
          filter_field?: string | null
          group?: string | null
          id?: string
          is_active?: boolean
          name: string
          view_name?: string | null
          widget_type: string
        }
        Update: {
          caption?: string | null
          description?: string | null
          filter_field?: string | null
          group?: string | null
          id?: string
          is_active?: boolean
          name?: string
          view_name?: string | null
          widget_type?: string
        }
        Relationships: []
      }
      materialized_views: {
        Row: {
          comment: string | null
          id: number
          is_populated: boolean | null
          name: string | null
          schema: string | null
        }
        Insert: {
          comment?: string | null
          id: number
          is_populated?: boolean | null
          name?: string | null
          schema?: string | null
        }
        Update: {
          comment?: string | null
          id?: number
          is_populated?: boolean | null
          name?: string | null
          schema?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          description: string | null
          filter_field: string | null
          group: string | null
          id: string
          is_active: boolean
          name: string
          view_name: string | null
        }
        Insert: {
          description?: string | null
          filter_field?: string | null
          group?: string | null
          id?: string
          is_active?: boolean
          name: string
          view_name?: string | null
        }
        Update: {
          description?: string | null
          filter_field?: string | null
          group?: string | null
          id?: string
          is_active?: boolean
          name?: string
          view_name?: string | null
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
          id: number
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
          id: number
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
          id?: number
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
          id: number
          is_updatable: boolean | null
          name: string | null
          schema: string | null
        }
        Insert: {
          comment?: string | null
          id: number
          is_updatable?: boolean | null
          name?: string | null
          schema?: string | null
        }
        Update: {
          comment?: string | null
          id?: number
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
      create_audit_log: {
        Args: {
          p_metadata?: Json
          p_new_data?: Json
          p_old_data?: Json
          p_operation: string
          p_record_id?: string
          p_schema_name: string
          p_table_name: string
        }
        Returns: string
      }
      generate_columns: {
        Args: {
          column_name_filter?: string
          ids_filter?: string
          limit_count?: number
          offset_count?: number
          schema_filter?: string
          table_id_filter?: string
          table_identifier_filter?: string
        }
        Returns: {
          actual_type: string
          check: string
          comment: string
          data_type: string
          default_value: string
          enums: Json
          format: string
          id: string
          identity_generation: string
          is_generated: boolean
          is_identity: boolean
          is_nullable: boolean
          is_unique: boolean
          is_updatable: boolean
          name: string
          ordinal_position: string
          schema: string
          table: string
          table_id: number
        }[]
      }
      generate_materialized_views: {
        Args: {
          ids_filter?: string
          limit_count?: number
          materialized_view_identifier_filter?: string
          offset_count?: number
          schema_filter?: string
        }
        Returns: {
          comment: string
          id: number
          is_populated: boolean
          name: string
          schema: string
        }[]
      }
      generate_tables: {
        Args: {
          ids_filter?: string
          limit_count?: number
          offset_count?: number
          schema_filter?: string
          table_identifier_filter?: string
        }
        Returns: {
          bytes: number
          comment: string
          dead_rows_estimate: number
          id: number
          live_rows_estimate: number
          name: string
          primary_keys: Json
          relationships: Json
          replica_identity: string
          rls_enabled: boolean
          rls_forced: boolean
          schema: string
          size: string
        }[]
      }
      generate_views: {
        Args: {
          ids_filter?: string
          limit_count?: number
          offset_count?: number
          schema_filter?: string
          view_identifier_filter?: string
        }
        Returns: {
          comment: string
          id: number
          is_updatable: boolean
          name: string
          schema: string
        }[]
      }
      get_chart_groups: {
        Args: Record<PropertyKey, never>
        Returns: {
          charts_count: number
          group_name: string
        }[]
      }
      get_charts: {
        Args: { p_schema?: string }
        Returns: {
          comment: string
          id: number
          is_updatable: boolean
          name: string
          schema: string
        }[]
      }
      get_columns: {
        Args: { schema_name?: string; table_name?: string }
        Returns: {
          actual_type: string | null
          check: string | null
          comment: string | null
          data_type: string | null
          default_value: string | null
          enums: Json | null
          format: string | null
          id: string
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
        }[]
      }
      get_dashboards: {
        Args: Record<PropertyKey, never>
        Returns: {
          group_name: string
          widgets_count: number
        }[]
      }
      get_materialized_views: {
        Args: { schema_name?: string; view_name?: string }
        Returns: {
          comment: string | null
          id: number
          is_populated: boolean | null
          name: string | null
          schema: string | null
        }[]
      }
      get_report_groups: {
        Args: Record<PropertyKey, never>
        Returns: {
          group_name: string
          report_count: number
        }[]
      }
      get_reports: {
        Args: { p_schema?: string }
        Returns: {
          comment: string
          id: number
          is_updatable: boolean
          name: string
          schema: string
        }[]
      }
      get_schemas: {
        Args: Record<PropertyKey, never>
        Returns: {
          schema: string
        }[]
      }
      get_storage_filename_as_uuid: {
        Args: { name: string }
        Returns: string
      }
      get_tables: {
        Args: { schema_name?: string; table_name?: string }
        Returns: {
          bytes: number | null
          comment: string | null
          dead_rows_estimate: number | null
          id: number
          live_rows_estimate: number | null
          name: string | null
          primary_keys: Json | null
          relationships: Json | null
          replica_identity: string | null
          rls_enabled: boolean | null
          rls_forced: boolean | null
          schema: string | null
          size: string | null
        }[]
      }
      get_views: {
        Args: { schema_name?: string; view_name?: string }
        Returns: {
          comment: string | null
          id: number
          is_updatable: boolean | null
          name: string | null
          schema: string | null
        }[]
      }
      get_widgets: {
        Args: { p_schema?: string }
        Returns: {
          comment: string
          id: number
          is_updatable: boolean
          name: string
          schema: string
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
        | "supasheet.accounts:select"
        | "supasheet.accounts:update"
        | "supasheet.accounts:insert"
        | "supasheet.accounts:delete"
        | "public.tasks:select"
        | "public.tasks:insert"
        | "public.tasks:update"
        | "public.tasks:delete"
        | "public.user_tasks:select"
        | "public.task_report:select"
        | "public.task_summary:select"
        | "public.task_completion_rate:select"
        | "public.tasks_by_status:select"
        | "public.task_urgent_count:select"
        | "public.task_list_simple:select"
        | "public.active_tasks_simple:select"
        | "public.task_list_detailed:select"
        | "public.task_analytics_detailed:select"
        | "public.task_trend_area:select"
        | "public.task_priority_bar:select"
        | "public.task_completion_line:select"
        | "public.task_status_pie:select"
        | "public.task_metrics_radar:select"
        | "public.user_details:select"
        | "public.user_details:insert"
        | "public.user_details:update"
        | "public.user_details:delete"
      app_role: "x-admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

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
      user_department: [
        "engineering",
        "marketing",
        "sales",
        "design",
        "operations",
        "hr",
        "finance",
        "product",
      ],
      user_role: ["admin", "user", "moderator"],
      user_skill: [
        "security",
        "swift",
        "kotlin",
        "devops",
        "javascript",
        "rust",
        "php",
        "sql",
        "nosql",
        "cloud",
        "java",
        "go",
      ],
      user_status: ["active", "inactive", "pending"],
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
        "public.user_tasks:select",
        "public.task_report:select",
        "public.task_summary:select",
        "public.task_completion_rate:select",
        "public.tasks_by_status:select",
        "public.task_urgent_count:select",
        "public.task_list_simple:select",
        "public.active_tasks_simple:select",
        "public.task_list_detailed:select",
        "public.task_analytics_detailed:select",
        "public.task_trend_area:select",
        "public.task_priority_bar:select",
        "public.task_completion_line:select",
        "public.task_status_pie:select",
        "public.task_metrics_radar:select",
        "public.user_details:select",
        "public.user_details:insert",
        "public.user_details:update",
        "public.user_details:delete",
      ],
      app_role: ["x-admin", "user"],
    },
  },
} as const

