export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      at_risk: {
        Row: {
          additional_info: string | null
          city: string | null
          created_at: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          lat: number | null
          lng: number | null
          medical_needs: string | null
          mobility_status: string | null
          name: string
          phone: string | null
          state: string | null
          street: string | null
          user_id: string
          zipcode: string | null
        }
        Insert: {
          additional_info?: string | null
          city?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          lat?: number | null
          lng?: number | null
          medical_needs?: string | null
          mobility_status?: string | null
          name: string
          phone?: string | null
          state?: string | null
          street?: string | null
          user_id?: string
          zipcode?: string | null
        }
        Update: {
          additional_info?: string | null
          city?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          lat?: number | null
          lng?: number | null
          medical_needs?: string | null
          mobility_status?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          street?: string | null
          user_id?: string
          zipcode?: string | null
        }
        Relationships: []
      }
      dispatchers: {
        Row: {
          authkey: string | null
          created_at: string | null
          dispatch_center: string | null
          dispatch_center_phone: string | null
          lat: number | null
          lng: number | null
          name: string
          state: string | null
          user_id: string
          zipcode: string | null
        }
        Insert: {
          authkey?: string | null
          created_at?: string | null
          dispatch_center?: string | null
          dispatch_center_phone?: string | null
          lat?: number | null
          lng?: number | null
          name: string
          state?: string | null
          user_id?: string
          zipcode?: string | null
        }
        Update: {
          authkey?: string | null
          created_at?: string | null
          dispatch_center?: string | null
          dispatch_center_phone?: string | null
          lat?: number | null
          lng?: number | null
          name?: string
          state?: string | null
          user_id?: string
          zipcode?: string | null
        }
        Relationships: []
      }
      dispatches: {
        Row: {
          created_at: string | null
          fire_id: string | null
          id: string
          responder_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          fire_id?: string | null
          id?: string
          responder_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          fire_id?: string | null
          id?: string
          responder_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispatches_fire_id_fkey"
            columns: ["fire_id"]
            isOneToOne: false
            referencedRelation: "fires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatches_responder_id_fkey"
            columns: ["responder_id"]
            isOneToOne: false
            referencedRelation: "first_responders"
            referencedColumns: ["user_id"]
          },
        ]
      }
      fires: {
        Row: {
          acq_date: string | null
          confidence: number | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          acq_date?: string | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          acq_date?: string | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
        }
        Relationships: []
      }
      first_responders: {
        Row: {
          city: string | null
          created_at: string | null
          lat: number | null
          lng: number | null
          role: Database["public"]["Enums"]["first_responder_role"]
          state: string | null
          street: string | null
          unit_name: string | null
          unit_size: number | null
          user_id: string
          zipcode: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          lat?: number | null
          lng?: number | null
          role: Database["public"]["Enums"]["first_responder_role"]
          state?: string | null
          street?: string | null
          unit_name?: string | null
          unit_size?: number | null
          user_id?: string
          zipcode?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          lat?: number | null
          lng?: number | null
          role?: Database["public"]["Enums"]["first_responder_role"]
          state?: string | null
          street?: string | null
          unit_name?: string | null
          unit_size?: number | null
          user_id?: string
          zipcode?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      truncate_dispatches: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      truncate_fires: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      first_responder_role: "EMT" | "Firefighter" | "Police" | "Rescue"
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
  public: {
    Enums: {
      first_responder_role: ["EMT", "Firefighter", "Police", "Rescue"],
    },
  },
} as const
