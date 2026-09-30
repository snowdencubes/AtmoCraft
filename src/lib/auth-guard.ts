import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { User } from '@/lib/types'

export async function requireAuth(allowedRoles?: string[]) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login')
  }

  // Fetch full user record from public.users to get role and status
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (dbError || !userData) {
    // Edge case: trigger hasn't fired yet or user doesn't exist in public schema
    redirect('/pending')
  }

  const dbUser = userData as User

  // Check status
  if (dbUser.status === 'pending') {
    redirect('/pending')
  }
  
  if (dbUser.status === 'rejected' || dbUser.status === 'deactivated') {
    // You could redirect to a specific /banned or /rejected page
    redirect('/login?error=account_deactivated')
  }

  // Check role if specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(dbUser.role)) {
      redirect('/403') // Assuming we have a 403 page, or just redirect to their proper dashboard
    }
  }

  return { authUser: user, dbUser }
}
