const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
  auth: { autoRefreshToken: false, persistSession: false }
});

const bucketsToDelete = ['avatars', 'course-covers', 'certificates', 'library'];

async function deleteBuckets() {
  console.log("Starting bucket deletion...");
  for (const bucket of bucketsToDelete) {
    console.log(`Emptying and deleting bucket: ${bucket}`);
    try {
      const { data: files, error: listError } = await supabase.storage.from(bucket).list();
      if (files && files.length > 0) {
        const fileNames = files.map(x => x.name);
        await supabase.storage.from(bucket).remove(fileNames);
        console.log(` - Removed ${fileNames.length} files from ${bucket}`);
      }
      const { error: deleteError } = await supabase.storage.deleteBucket(bucket);
      if (deleteError) {
        console.log(` - Note: Could not delete bucket ${bucket} (it might not exist or need deeper recursive emptying). Error: ${deleteError.message}`);
      } else {
        console.log(` - Successfully deleted bucket ${bucket}`);
      }
    } catch (e) {
      console.log(` - Error processing ${bucket}: ${e.message}`);
    }
  }
  console.log("Storage reset complete.");
}

deleteBuckets();
