'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function checkUsername(username: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single()
    
  return !!data
}

export async function login(formData: FormData) {
  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  let email = identifier
  
  // If it doesn't look like an email, assume it's a username and resolve it via RPC
  if (!identifier.includes('@')) {
    const { data: resolvedEmail, error: rpcError } = await supabase.rpc('get_email_by_username', {
      p_username: identifier
    })
    
    if (rpcError || !resolvedEmail) {
      return { error: 'Invalid username or password' }
    }
    email = resolvedEmail as string
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Invalid username/email or password' }
  }

  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const email = formData.get('email') as string
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const department = formData.get('department') as string
  const role = formData.get('role') as string

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  // Validate username
  const usernameRegex = /^[a-z0-9_]{3,20}$/
  if (!usernameRegex.test(username)) {
    return { error: 'Username must be 3-20 characters, lowercase letters, numbers, or underscores' }
  }

  // Check if username is taken
  const isTaken = await checkUsername(username)
  if (isTaken) {
    return { error: 'Username is already taken' }
  }

  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: `${firstName} ${lastName}`,
        username,
        department,
        role
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // With "Confirm email" OFF, the user is immediately signed in and their session is established.
  redirect('/pending')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
