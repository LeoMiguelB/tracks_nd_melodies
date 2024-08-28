import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export const supabase = createClient<Database>(process.env.SUPA_URL!, process.env.SUPA_PUBLIC_ANON!)