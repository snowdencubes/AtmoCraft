'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveUser(userId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('users')
    .update({ status: 'approved' })
    .eq('id', userId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function rejectUser(userId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('users')
    .update({ status: 'rejected' })
    .eq('id', userId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function deactivateUser(userId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('users')
    .update({ status: 'deactivated' })
    .eq('id', userId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}
