/**
 * Supabase database type definitions.
 *
 * These mirror the SQL schema in supabase/migrations/00001_initial_schema.sql
 * and map snake_case DB columns to camelCase app types in tenant-data.ts.
 */

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          address: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
          phone: string | null;
          email: string | null;
          logo_url: string | null;
          website: string | null;
          ein: string | null;
          created_at: string;
          is_active: boolean;
        };
        Insert: Partial<Database['public']['Tables']['tenants']['Row']> & {
          id: string;
          name: string;
          slug: string;
        };
        Update: Partial<Database['public']['Tables']['tenants']['Row']>;
      };
      users: {
        Row: {
          id: string;
          tenant_id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: string;
          permissions: Record<string, string>;
          auth_uid: string | null;
          is_active: boolean;
          created_at: string;
          last_login_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['users']['Row']> & {
          id: string;
          tenant_id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      people: {
        Row: {
          id: string;
          tenant_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          address: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
          roles: string[];
          tags: string[];
          organization_id: string | null;
          organization_name: string | null;
          created_at: string;
          updated_at: string;
          total_donations: number;
          total_volunteer_hours: number;
          is_active: boolean;
        };
        Insert: Partial<Database['public']['Tables']['people']['Row']> & {
          id: string;
          tenant_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
        };
        Update: Partial<Database['public']['Tables']['people']['Row']>;
      };
      moves: {
        Row: {
          id: string;
          tenant_id: string;
          person_id: string;
          from_roles: string[];
          to_roles: string[];
          date: string;
          trigger: string | null;
        };
        Insert: Partial<Database['public']['Tables']['moves']['Row']> & {
          id: string;
          tenant_id: string;
          person_id: string;
          date: string;
        };
        Update: Partial<Database['public']['Tables']['moves']['Row']>;
      };
      organizations: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          type: string;
          ein: string | null;
          contact_name: string;
          contact_email: string;
          contact_phone: string;
          address: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
          member_ids: string[];
          roles: string[];
          total_donations: number;
          total_volunteer_hours: number;
          matching_gift_program: boolean;
          match_ratio: number | null;
          tags: string[];
          notes: string | null;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: Partial<Database['public']['Tables']['organizations']['Row']> & {
          id: string;
          tenant_id: string;
          name: string;
          type: string;
          contact_name: string;
          contact_email: string;
          contact_phone: string;
        };
        Update: Partial<Database['public']['Tables']['organizations']['Row']>;
      };
      donations: {
        Row: {
          id: string;
          tenant_id: string;
          person_id: string | null;
          person_name: string | null;
          organization_id: string | null;
          organization_name: string | null;
          type: string;
          amount: number | null;
          description: string;
          date: string;
          category: string;
          hours: number | null;
          item_description: string | null;
          estimated_value: number | null;
          receipt_issued: boolean;
          notes: string | null;
        };
        Insert: Partial<Database['public']['Tables']['donations']['Row']> & {
          id: string;
          tenant_id: string;
          type: string;
          description: string;
          date: string;
          category: string;
        };
        Update: Partial<Database['public']['Tables']['donations']['Row']>;
      };
      animals: {
        Row: {
          id: string;
          tenant_id: string;
          animal_id: string;
          name: string;
          species: string;
          breed: string;
          color: string;
          gender: string;
          size: string;
          age: string | null;
          date_of_birth: string | null;
          weight: number | null;
          microchip_id: string | null;
          status: string;
          intake_date: string;
          intake_type: string;
          intake_condition: string;
          intake_person_id: string | null;
          intake_person_name: string | null;
          altered_status: string;
          description: string;
          medical_notes: string[];
          tags: string[];
          photo_url: string | null;
          kennel_location: string | null;
          hold_expiration_date: string | null;
          outcome_type: string | null;
          outcome_date: string | null;
          foster_home_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['animals']['Row']> & {
          id: string;
          tenant_id: string;
          animal_id: string;
          name: string;
          species: string;
          breed: string;
          color: string;
          gender: string;
          size: string;
          status: string;
          intake_date: string;
          intake_type: string;
          description: string;
        };
        Update: Partial<Database['public']['Tables']['animals']['Row']>;
      };
      medical_records: {
        Row: {
          id: string;
          tenant_id: string;
          animal_id: string;
          type: string;
          description: string;
          date: string;
          veterinarian: string | null;
          notes: string | null;
          next_due_date: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['medical_records']['Row']> & {
          id: string;
          tenant_id: string;
          animal_id: string;
          type: string;
          description: string;
          date: string;
        };
        Update: Partial<Database['public']['Tables']['medical_records']['Row']>;
      };
      foster_homes: {
        Row: {
          id: string;
          tenant_id: string;
          person_id: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          address: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
          capacity: number;
          current_count: number;
          species_preference: string[];
          size_preference: string[];
          is_active: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['foster_homes']['Row']> & {
          id: string;
          tenant_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
        };
        Update: Partial<Database['public']['Tables']['foster_homes']['Row']>;
      };
      foster_placements: {
        Row: {
          id: string;
          tenant_id: string;
          animal_id: string;
          animal_name: string;
          foster_home_id: string;
          foster_name: string;
          start_date: string;
          end_date: string | null;
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['foster_placements']['Row']> & {
          id: string;
          tenant_id: string;
          animal_id: string;
          animal_name: string;
          foster_home_id: string;
          foster_name: string;
          start_date: string;
          status: string;
        };
        Update: Partial<Database['public']['Tables']['foster_placements']['Row']>;
      };
      kennel_locations: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          zone: string;
          species: string;
          size: string;
          is_occupied: boolean;
          current_animal_id: string | null;
          current_animal_name: string | null;
          notes: string | null;
        };
        Insert: Partial<Database['public']['Tables']['kennel_locations']['Row']> & {
          id: string;
          tenant_id: string;
          name: string;
          zone: string;
          species: string;
          size: string;
        };
        Update: Partial<Database['public']['Tables']['kennel_locations']['Row']>;
      };
      admin_tags: {
        Row: {
          id: string;
          tenant_id: string;
          label: string;
          category: string;
          severity: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['admin_tags']['Row']> & {
          id: string;
          tenant_id: string;
          label: string;
          category: string;
        };
        Update: Partial<Database['public']['Tables']['admin_tags']['Row']>;
      };
      alert_rules: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string;
          condition: string;
          threshold: number;
          severity: string;
          is_active: boolean;
        };
        Insert: Partial<Database['public']['Tables']['alert_rules']['Row']> & {
          id: string;
          tenant_id: string;
          name: string;
          description: string;
          condition: string;
          threshold: number;
          severity: string;
        };
        Update: Partial<Database['public']['Tables']['alert_rules']['Row']>;
      };
      adopters: {
        Row: {
          id: string;
          tenant_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          address: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
          flagged: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['adopters']['Row']> & {
          id: string;
          tenant_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
        };
        Update: Partial<Database['public']['Tables']['adopters']['Row']>;
      };
      structured_notes: {
        Row: {
          id: string;
          tenant_id: string;
          adopter_id: string;
          tag_id: string;
          tag_label: string;
          severity: string;
          date: string;
          added_by: string;
        };
        Insert: Partial<Database['public']['Tables']['structured_notes']['Row']> & {
          id: string;
          tenant_id: string;
          adopter_id: string;
          tag_id: string;
          tag_label: string;
          severity: string;
          date: string;
          added_by: string;
        };
        Update: Partial<Database['public']['Tables']['structured_notes']['Row']>;
      };
      adoptions: {
        Row: {
          id: string;
          tenant_id: string;
          animal_id: string;
          animal_name: string;
          adopter_id: string;
          adopter_name: string;
          date: string;
          fee: number;
          status: string;
          return_date: string | null;
          return_reason: string | null;
        };
        Insert: Partial<Database['public']['Tables']['adoptions']['Row']> & {
          id: string;
          tenant_id: string;
          animal_id: string;
          animal_name: string;
          adopter_id: string;
          adopter_name: string;
          date: string;
          fee: number;
          status: string;
        };
        Update: Partial<Database['public']['Tables']['adoptions']['Row']>;
      };
      animal_returns: {
        Row: {
          id: string;
          tenant_id: string;
          adoption_id: string;
          animal_id: string;
          animal_name: string;
          adopter_id: string;
          date: string;
          reason_tag_id: string;
          reason_label: string;
        };
        Insert: Partial<Database['public']['Tables']['animal_returns']['Row']> & {
          id: string;
          tenant_id: string;
          adoption_id: string;
          animal_id: string;
          animal_name: string;
          adopter_id: string;
          date: string;
          reason_tag_id: string;
          reason_label: string;
        };
        Update: Partial<Database['public']['Tables']['animal_returns']['Row']>;
      };
    };
  };
}
