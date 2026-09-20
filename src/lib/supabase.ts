import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://soojutcecltwccirbusa.supabase.co";
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable__xmaP9O3SRHVGRKeGxI8Cg_jhfstlu4";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// ── Customer & User Types ────────────────────────
export interface CustomerData {
  id?: string;
  email: string;
  full_name?: string;
  phone?: string;
  country?: string;
  company?: string;
  street_address?: string;
  secondary_address?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  permanent_address?: string;
  is_active?: boolean;
}

// ── Main Waitinglist User Interface ───────────────
export interface WaitinglistUser {
  id?: string;
  email: string;
  full_name?: string;
  phone?: string;
  country?: string;
  city?: string;
  avatar_url?: string;
  is_active?: boolean;
  company?: string;
  street_address?: string;
  secondary_address?: string;
  state_province?: string;
  postal_code?: string;
  permanent_address?: string;
  tier?: string;
  preferred_tier?: string;
  tier_id?: number;
  created_at?: string;
  updated_at?: string;
}
