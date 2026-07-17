import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceRole = import.meta.env.VITE_SUPABASE_SERVICE_ROLE

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Check your environment variables.')
}

// Public client (anon key) — respects RLS. Used on the frontend site.
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Admin client (service role key) — bypasses RLS. Used ONLY in admin panel pages.
// Allows full CRUD on all tables regardless of publish/active status.
let _adminSupabase
if (supabaseServiceRole) {
  _adminSupabase = createClient(supabaseUrl || '', supabaseServiceRole)
} else {
  console.warn(
    '[adminSupabase] VITE_SUPABASE_SERVICE_ROLE is not set. ' +
    'Falling back to anon key — admin CRUD operations may fail if RLS blocks writes. ' +
    'Add VITE_SUPABASE_SERVICE_ROLE to your .env file.'
  )
  _adminSupabase = supabase
}

export const adminSupabase = _adminSupabase
