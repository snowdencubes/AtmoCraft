const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables directly from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8').split('\n');
  envConfig.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...values] = line.split('=');
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const DEMO_PASSWORD = "Password123!";

const demoUsers = [
  {
    email: 'admin@imd.gov.in',
    name: 'Admin User',
    username: 'admin',
    role: 'admin',
    department: 'Administration',
    status: 'active' // Route guards expect 'active' (or 'approved' depending on recent code changes. We'll use 'active' to match authService)
  },
  {
    email: 'trainer1@imd.gov.in',
    name: 'Senior Trainer',
    username: 'trainer1',
    role: 'trainer',
    department: 'Forecasting',
    status: 'active'
  },
  {
    email: 'trainer2@imd.gov.in',
    name: 'Radar Specialist',
    username: 'trainer2',
    role: 'trainer',
    department: 'Radar',
    status: 'active'
  },
  {
    email: 'trainee1@imd.gov.in',
    name: 'Junior Forecaster',
    username: 'trainee1',
    role: 'trainee',
    department: 'General',
    status: 'active'
  },
  {
    email: 'trainee2@imd.gov.in',
    name: 'Intern Meteorologist',
    username: 'trainee2',
    role: 'trainee',
    department: 'General',
    status: 'active'
  },
  {
    email: 'trainee3@imd.gov.in',
    name: 'Field Officer',
    username: 'trainee3',
    role: 'trainee',
    department: 'General',
    status: 'active'
  }
];

async function seedUsers() {
  console.log("Seeding demo users...");

  for (const user of demoUsers) {
    console.log(`Processing ${user.email}...`);
    
    let userId = null;

    // Create user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: {
        name: user.name,
        username: user.username,
        role: user.role,
        department: user.department,
        status: user.status
      }
    });

    if (createError) {
      console.error(`Failed to create ${user.email}: ${createError.message}`);
      // Maybe user exists, but since we can't list them, we'll just ignore for now.
    } else {
      userId = newUser.user.id;
      console.log(`Created ${user.email} (ID: ${userId})`);
    }

    if (userId) {
      const { error: dbUpdateError } = await supabase
        .from('users')
        .update({
          status: user.status,
          role: user.role,
          name: user.name,
          username: user.username,
          department: user.department
        })
        .eq('id', userId);
        
      if (dbUpdateError) {
        console.error(`Failed to sync public.users for ${user.email}: ${dbUpdateError.message}`);
      } else {
        console.log(`Synced public.users for ${user.email}`);
      }
    }
  }

  console.log("Demo users seeded successfully.");
  console.log(`All demo accounts use password: ${DEMO_PASSWORD}`);
}

seedUsers();
