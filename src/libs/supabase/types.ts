export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      api_rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      credit_purchases: {
        Row: {
          amount_paid: number
          credits_purchased: number
          currency: string
          id: string
          metadata: Json | null
          order_id: string | null
          price_id: string | null
          product_id: string | null
          purchased_at: string
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          credits_purchased: number
          currency?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          price_id?: string | null
          product_id?: string | null
          purchased_at?: string
          status?: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          credits_purchased?: number
          currency?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          price_id?: string | null
          product_id?: string | null
          purchased_at?: string
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_purchases_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_purchases_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          type: Database["public"]["Enums"]["credit_transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          type: Database["public"]["Enums"]["credit_transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          type?: Database["public"]["Enums"]["credit_transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          email: string | null
          id: string
          polar_customer_id: string | null
        }
        Insert: {
          email?: string | null
          id: string
          polar_customer_id?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          polar_customer_id?: string | null
        }
        Relationships: []
      }
      edit_operations: {
        Row: {
          aspect_ratio: string | null
          completed_at: string | null
          created_at: string | null
          credit_transaction_id: string | null
          edit_prompt: string
          error_message: string | null
          id: string
          product_image_id: string
          result_version_id: string | null
          source_version_id: string
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          aspect_ratio?: string | null
          completed_at?: string | null
          created_at?: string | null
          credit_transaction_id?: string | null
          edit_prompt: string
          error_message?: string | null
          id?: string
          product_image_id: string
          result_version_id?: string | null
          source_version_id: string
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          aspect_ratio?: string | null
          completed_at?: string | null
          created_at?: string | null
          credit_transaction_id?: string | null
          edit_prompt?: string
          error_message?: string | null
          id?: string
          product_image_id?: string
          result_version_id?: string | null
          source_version_id?: string
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edit_operations_credit_transaction_id_fkey"
            columns: ["credit_transaction_id"]
            isOneToOne: false
            referencedRelation: "credit_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edit_operations_product_image_id_fkey"
            columns: ["product_image_id"]
            isOneToOne: false
            referencedRelation: "product_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edit_operations_result_version_id_fkey"
            columns: ["result_version_id"]
            isOneToOne: false
            referencedRelation: "image_edit_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edit_operations_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "image_edit_history"
            referencedColumns: ["id"]
          },
        ]
      }
      etsy_connections: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          refresh_token: string | null
          shop_id: string
          shop_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          refresh_token?: string | null
          shop_id: string
          shop_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          refresh_token?: string | null
          shop_id?: string
          shop_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      etsy_listing_history: {
        Row: {
          connection_id: string
          created_at: string
          error_message: string | null
          etsy_listing_id: string | null
          etsy_listing_url: string | null
          id: string
          listing_data: Json | null
          product_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connection_id: string
          created_at?: string
          error_message?: string | null
          etsy_listing_id?: string | null
          etsy_listing_url?: string | null
          id?: string
          listing_data?: Json | null
          product_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connection_id?: string
          created_at?: string
          error_message?: string | null
          etsy_listing_id?: string | null
          etsy_listing_url?: string | null
          id?: string
          listing_data?: Json | null
          product_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "etsy_listing_history_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "etsy_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etsy_listing_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "user_products"
            referencedColumns: ["id"]
          },
        ]
      }
      etsy_oauth_states: {
        Row: {
          code_challenge: string
          code_verifier: string
          created_at: string
          expires_at: string
          id: string
          state: string
          user_id: string
        }
        Insert: {
          code_challenge: string
          code_verifier: string
          created_at?: string
          expires_at: string
          id?: string
          state: string
          user_id: string
        }
        Update: {
          code_challenge?: string
          code_verifier?: string
          created_at?: string
          expires_at?: string
          id?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      etsy_shop_data: {
        Row: {
          connection_id: string
          created_at: string
          id: string
          last_refreshed_at: string
          production_partners: Json | null
          shipping_profiles: Json | null
          shop_id: string
          taxonomies: Json | null
          updated_at: string
        }
        Insert: {
          connection_id: string
          created_at?: string
          id?: string
          last_refreshed_at?: string
          production_partners?: Json | null
          shipping_profiles?: Json | null
          shop_id: string
          taxonomies?: Json | null
          updated_at?: string
        }
        Update: {
          connection_id?: string
          created_at?: string
          id?: string
          last_refreshed_at?: string
          production_partners?: Json | null
          shipping_profiles?: Json | null
          shop_id?: string
          taxonomies?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "etsy_shop_data_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: true
            referencedRelation: "etsy_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_submissions: {
        Row: {
          can_follow_up: boolean | null
          category: string[] | null
          created_at: string
          description: string
          feedback_id: string
          id: string
          metadata: Json | null
          priority: string | null
          rating: number | null
          reviewed_at: string | null
          severity: string | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          can_follow_up?: boolean | null
          category?: string[] | null
          created_at?: string
          description: string
          feedback_id: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          rating?: number | null
          reviewed_at?: string | null
          severity?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          can_follow_up?: boolean | null
          category?: string[] | null
          created_at?: string
          description?: string
          feedback_id?: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          rating?: number | null
          reviewed_at?: string | null
          severity?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      image_edit_history: {
        Row: {
          created_at: string | null
          edit_prompt: string | null
          id: string
          is_current: boolean | null
          metadata: Json | null
          product_image_id: string
          r2_key: string
          r2_url: string
          user_id: string
          version_number: number
        }
        Insert: {
          created_at?: string | null
          edit_prompt?: string | null
          id?: string
          is_current?: boolean | null
          metadata?: Json | null
          product_image_id: string
          r2_key: string
          r2_url: string
          user_id: string
          version_number: number
        }
        Update: {
          created_at?: string | null
          edit_prompt?: string | null
          id?: string
          is_current?: boolean | null
          metadata?: Json | null
          product_image_id?: string
          r2_key?: string
          r2_url?: string
          user_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "image_edit_history_product_image_id_fkey"
            columns: ["product_image_id"]
            isOneToOne: false
            referencedRelation: "product_images"
            referencedColumns: ["id"]
          },
        ]
      }
      image_regeneration_history: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          image_id: string
          new_aspect_ratio: string
          new_custom_prompt: string | null
          new_image_size: string
          new_style: string
          previous_aspect_ratio: string | null
          previous_custom_prompt: string | null
          previous_image_size: string | null
          previous_style: string | null
          success: boolean
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          image_id: string
          new_aspect_ratio: string
          new_custom_prompt?: string | null
          new_image_size: string
          new_style: string
          previous_aspect_ratio?: string | null
          previous_custom_prompt?: string | null
          previous_image_size?: string | null
          previous_style?: string | null
          success?: boolean
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          image_id?: string
          new_aspect_ratio?: string
          new_custom_prompt?: string | null
          new_image_size?: string
          new_style?: string
          previous_aspect_ratio?: string | null
          previous_custom_prompt?: string | null
          previous_image_size?: string | null
          previous_style?: string | null
          success?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_regeneration_history_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "product_images"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_history: {
        Row: {
          connection_id: string
          created_at: string
          error_message: string | null
          id: string
          listing_data: Json | null
          product_id: string
          shopify_product_id: string | null
          shopify_product_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connection_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          listing_data?: Json | null
          product_id: string
          shopify_product_id?: string | null
          shopify_product_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connection_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          listing_data?: Json | null
          product_id?: string
          shopify_product_id?: string | null
          shopify_product_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_history_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "shopify_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "user_products"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_states: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          shop_domain: string
          state: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          shop_domain: string
          state: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          shop_domain?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          additional_info: string | null
          angle: string
          archived_at: string | null
          aspect_ratio: string
          completed_at: string | null
          created_at: string
          current_version_id: string | null
          custom_prompt: string | null
          error_message: string | null
          extracted_style_description: string | null
          id: string
          image_size: string
          model_info: string | null
          product_id: string
          public_url: string
          r2_key: string
          size_bytes: number
          started_at: string | null
          status: Database["public"]["Enums"]["image_status"] | null
          style: string
          style_ref_use_direct_image: boolean | null
          style_reference_image_r2_key: string | null
          style_reference_image_thumbnail_r2_key: string | null
          style_reference_image_thumbnail_url: string | null
          style_reference_image_url: string | null
        }
        Insert: {
          additional_info?: string | null
          angle: string
          archived_at?: string | null
          aspect_ratio?: string
          completed_at?: string | null
          created_at?: string
          current_version_id?: string | null
          custom_prompt?: string | null
          error_message?: string | null
          extracted_style_description?: string | null
          id?: string
          image_size?: string
          model_info?: string | null
          product_id: string
          public_url: string
          r2_key: string
          size_bytes: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["image_status"] | null
          style?: string
          style_ref_use_direct_image?: boolean | null
          style_reference_image_r2_key?: string | null
          style_reference_image_thumbnail_r2_key?: string | null
          style_reference_image_thumbnail_url?: string | null
          style_reference_image_url?: string | null
        }
        Update: {
          additional_info?: string | null
          angle?: string
          archived_at?: string | null
          aspect_ratio?: string
          completed_at?: string | null
          created_at?: string
          current_version_id?: string | null
          custom_prompt?: string | null
          error_message?: string | null
          extracted_style_description?: string | null
          id?: string
          image_size?: string
          model_info?: string | null
          product_id?: string
          public_url?: string
          r2_key?: string
          size_bytes?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["image_status"] | null
          style?: string
          style_ref_use_direct_image?: boolean | null
          style_reference_image_r2_key?: string | null
          style_reference_image_thumbnail_r2_key?: string | null
          style_reference_image_thumbnail_url?: string | null
          style_reference_image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_current_version_id_fkey"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "image_edit_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "user_products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      shopify_connections: {
        Row: {
          access_token: string
          created_at: string
          encrypted_access_token: string | null
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          scopes: string
          shop_domain: string
          shop_email: string | null
          shop_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          encrypted_access_token?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          scopes: string
          shop_domain: string
          shop_email?: string | null
          shop_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          encrypted_access_token?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          scopes?: string
          shop_domain?: string
          shop_email?: string | null
          shop_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          priority: string | null
          product_id: string | null
          resolved_at: string | null
          status: string
          subject: string
          ticket_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          product_id?: string | null
          resolved_at?: string | null
          status?: string
          subject: string
          ticket_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          product_id?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string
          ticket_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "user_products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string
          credits: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_product_source_images: {
        Row: {
          created_at: string
          id: string
          image_index: number
          image_url: string
          product_id: string
          r2_key: string
          size_bytes: number | null
          thumbnail_r2_key: string | null
          thumbnail_url: string | null
          view_angle: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_index?: number
          image_url: string
          product_id: string
          r2_key: string
          size_bytes?: number | null
          thumbnail_r2_key?: string | null
          thumbnail_url?: string | null
          view_angle?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_index?: number
          image_url?: string
          product_id?: string
          r2_key?: string
          size_bytes?: number | null
          thumbnail_r2_key?: string | null
          thumbnail_url?: string | null
          view_angle?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_product_source_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "user_products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_products: {
        Row: {
          completed_images: number | null
          created_at: string
          custom_description_prompt: string | null
          custom_title_prompt: string | null
          description: string | null
          description_length: string | null
          failed_images: number | null
          generation_status:
            | Database["public"]["Enums"]["generation_status"]
            | null
          id: string
          name: string | null
          product_facts: Json | null
          product_specs: string | null
          reference_count: number
          reference_image_r2_key: string
          reference_image_source: string | null
          reference_image_source_metadata: Json | null
          reference_image_thumbnail_r2_key: string | null
          reference_image_thumbnail_url: string | null
          reference_image_url: string
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          template_id: string | null
          title: string | null
          title_length: string | null
          total_images: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_images?: number | null
          created_at?: string
          custom_description_prompt?: string | null
          custom_title_prompt?: string | null
          description?: string | null
          description_length?: string | null
          failed_images?: number | null
          generation_status?:
            | Database["public"]["Enums"]["generation_status"]
            | null
          id?: string
          name?: string | null
          product_facts?: Json | null
          product_specs?: string | null
          reference_count?: number
          reference_image_r2_key: string
          reference_image_source?: string | null
          reference_image_source_metadata?: Json | null
          reference_image_thumbnail_r2_key?: string | null
          reference_image_thumbnail_url?: string | null
          reference_image_url: string
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          template_id?: string | null
          title?: string | null
          title_length?: string | null
          total_images?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_images?: number | null
          created_at?: string
          custom_description_prompt?: string | null
          custom_title_prompt?: string | null
          description?: string | null
          description_length?: string | null
          failed_images?: number | null
          generation_status?:
            | Database["public"]["Enums"]["generation_status"]
            | null
          id?: string
          name?: string | null
          product_facts?: Json | null
          product_specs?: string | null
          reference_count?: number
          reference_image_r2_key?: string
          reference_image_source?: string | null
          reference_image_source_metadata?: Json | null
          reference_image_thumbnail_r2_key?: string | null
          reference_image_thumbnail_url?: string | null
          reference_image_url?: string
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          template_id?: string | null
          title?: string | null
          title_length?: string | null
          total_images?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_products_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "user_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_style_reference_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          mime_type: string
          r2_key: string
          size_bytes: number
          thumbnail_r2_key: string | null
          thumbnail_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          mime_type: string
          r2_key: string
          size_bytes: number
          thumbnail_r2_key?: string | null
          thumbnail_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          mime_type?: string
          r2_key?: string
          size_bytes?: number
          thumbnail_r2_key?: string | null
          thumbnail_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_templates: {
        Row: {
          additional_info: string | null
          created_at: string
          custom_description_prompt: string | null
          custom_title_prompt: string | null
          description: string | null
          description_length: string | null
          icon: string | null
          id: string
          image_configs: Json
          is_default: boolean | null
          name: string
          style_references: Json | null
          title_length: string | null
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          additional_info?: string | null
          created_at?: string
          custom_description_prompt?: string | null
          custom_title_prompt?: string | null
          description?: string | null
          description_length?: string | null
          icon?: string | null
          id?: string
          image_configs: Json
          is_default?: boolean | null
          name: string
          style_references?: Json | null
          title_length?: string | null
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          additional_info?: string | null
          created_at?: string
          custom_description_prompt?: string | null
          custom_title_prompt?: string | null
          description?: string | null
          description_length?: string | null
          icon?: string | null
          id?: string
          image_configs?: Json
          is_default?: boolean | null
          name?: string
          style_references?: Json | null
          title_length?: string | null
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          first_product_created_at: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          onboarding_step: string | null
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          first_product_created_at?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          onboarding_step?: string | null
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          first_product_created_at?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          onboarding_step?: string | null
          payment_method?: Json | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json | null
          processed_at: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id: string
          payload?: Json | null
          processed_at?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json | null
          processed_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_credits: {
        Args: {
          p_amount: number
          p_description?: string
          p_reference_id?: string
          p_type: Database["public"]["Enums"]["credit_transaction_type"]
          p_user_id: string
        }
        Returns: number
      }
      cleanup_expired_etsy_oauth_states: { Args: never; Returns: undefined }
      cleanup_expired_oauth_states: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      decrement_reference_count: {
        Args: { r2_key_param: string }
        Returns: undefined
      }
      deduct_user_credits: {
        Args: {
          p_amount: number
          p_description?: string
          p_reference_id?: string
          p_user_id: string
        }
        Returns: boolean
      }
      increment_completed_images: {
        Args: { product_uuid: string }
        Returns: undefined
      }
      increment_failed_images: {
        Args: { product_uuid: string }
        Returns: undefined
      }
      increment_reference_count: {
        Args: { r2_key_param: string }
        Returns: undefined
      }
      increment_template_usage: {
        Args: { template_id: string }
        Returns: undefined
      }
    }
    Enums: {
      credit_transaction_type:
        | "purchase"
        | "usage"
        | "refund"
        | "bonus"
        | "adjustment"
      generation_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "partial"
        | "failed"
      image_status:
        | "pending"
        | "generating"
        | "completed"
        | "failed"
        | "archived"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
        | "revoked"
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
  public: {
    Enums: {
      credit_transaction_type: [
        "purchase",
        "usage",
        "refund",
        "bonus",
        "adjustment",
      ],
      generation_status: [
        "pending",
        "in_progress",
        "completed",
        "partial",
        "failed",
      ],
      image_status: [
        "pending",
        "generating",
        "completed",
        "failed",
        "archived",
      ],
      pricing_plan_interval: ["day", "week", "month", "year"],
      pricing_type: ["one_time", "recurring"],
      subscription_status: [
        "trialing",
        "active",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "past_due",
        "unpaid",
        "paused",
        "revoked",
      ],
    },
  },
} as const
