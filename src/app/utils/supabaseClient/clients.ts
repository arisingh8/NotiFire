"use client";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// A do-nothing storage object disables session persistence.
const noStorage = {
  getItem: (_key: string): string | null => null,
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: noStorage,
    autoRefreshToken: false,
  },
});
