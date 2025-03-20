import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_url ?? ``
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_apiKey ?? ``
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and key are required');
}
export const supabase = createClient(supabaseUrl, supabaseKey)