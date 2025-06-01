export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          discord_id: string
          username: string
          avatar_url: string | null
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          discord_id: string
          username: string
          avatar_url?: string | null
          role?: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          discord_id?: string
          username?: string
          avatar_url?: string | null
          role?: 'admin' | 'user'
          created_at?: string
        }
      }
      servers: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string
          invite_link: string
          tags: string[]
          language: string
          region: string
          member_count: number
          is_verified: boolean
          is_approved: boolean
          created_at: string
          icon_url: string | null
          banner_url: string | null
          last_bumped_at: string | null
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description: string
          invite_link: string
          tags: string[]
          language: string
          region: string
          member_count: number
          is_verified?: boolean
          is_approved?: boolean
          created_at?: string
          icon_url?: string | null
          banner_url?: string | null
          last_bumped_at?: string | null
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string
          invite_link?: string
          tags?: string[]
          language?: string
          region?: string
          member_count?: number
          is_verified?: boolean
          is_approved?: boolean
          created_at?: string
          icon_url?: string | null
          banner_url?: string | null
          last_bumped_at?: string | null
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          server_id: string
          voted_at: string
        }
        Insert: {
          id?: string
          user_id: string
          server_id: string
          voted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          server_id?: string
          voted_at?: string
        }
      }
      bump_logs: {
        Row: {
          id: string
          user_id: string
          server_id: string
          bumped_at: string
        }
        Insert: {
          id?: string
          user_id: string
          server_id: string
          bumped_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          server_id?: string
          bumped_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          server_id: string
          reason: string
          status: 'pending' | 'resolved' | 'dismissed'
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          server_id: string
          reason: string
          status?: 'pending' | 'resolved' | 'dismissed'
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          server_id?: string
          reason?: string
          status?: 'pending' | 'resolved' | 'dismissed'
          created_at?: string
        }
      }
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
  }
}