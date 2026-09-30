const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function diagnose() {
  console.log("=== DIAGNOSTICS ===");
  
  // 1. Check auth.users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error("Error fetching auth.users:", authError.message);
  } else {
    console.log(`Found ${authUsers.users.length} users in auth.users.`);
    authUsers.users.forEach(u => {
      console.log(`- ${u.email} (ID: ${u.id})`);
    });
  }

  // 2. Check public.users
  const { data: publicUsers, error: pubError } = await supabase.from('users').select('*');
  if (pubError) {
    console.error("Error fetching public.users:", pubError.message);
  } else {
    console.log(`\nFound ${publicUsers.length} users in public.users.`);
    publicUsers.forEach(u => {
      console.log(`- ${u.email} (ID: ${u.id}) | Role: ${u.role} | Status: ${u.status} | Username: ${u.username}`);
    });
  }

  // 3. Check public.profiles
  const { data: profiles, error: profError } = await supabase.from('profiles').select('userId');
  if (profError) {
    console.error("Error fetching public.profiles:", profError.message);
  } else {
    console.log(`\nFound ${profiles.length} profiles in public.profiles.`);
  }
  
  // 4. Test login-by-username RPC
  const { data: rpcEmail, error: rpcError } = await supabase.rpc('get_email_by_username', { p_username: 'admin' });
  if (rpcError) {
    console.error("Error calling RPC get_email_by_username:", rpcError.message);
  } else {
    console.log(`\nRPC get_email_by_username('admin') returned: ${rpcEmail}`);
  }
}

diagnose();
