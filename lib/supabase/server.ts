import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export const supabaseServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

export const getUserSession = async () => {
  const supabase = supabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}