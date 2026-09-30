const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

const CATALOG_FILE = path.join(process.cwd(), 'data', 'resources', 'catalog.json');

async function importResources() {
  if (!fs.existsSync(CATALOG_FILE)) {
    console.error("catalog.json not found!");
    return;
  }
  
  const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf-8'));
  console.log(`Starting import of ${catalog.length} resources to Supabase...`);
  
  // 1. Upsert Providers First
  const providers = new Map();
  catalog.forEach(item => {
    if (!providers.has(item.provider)) {
      providers.set(item.provider, {
        name: item.provider,
        domain: item.provider_domain,
        domain_type: item.domain_type
      });
    }
  });
  
  const providerArray = Array.from(providers.values());
  console.log(`Upserting ${providerArray.length} providers...`);
  // Note: For a real upsert, we need a unique constraint on 'name' or 'domain', 
  // but since we just created the table with UUID, we will first fetch them.
  const { data: existingProviders } = await supabase.from('resource_providers').select('id, name');
  const providerMap = new Map((existingProviders || []).map(p => [p.name, p.id]));
  
  for (const p of providerArray) {
    if (!providerMap.has(p.name)) {
      const { data, error } = await supabase.from('resource_providers').insert([p]).select('id').single();
      if (error) console.error("Error inserting provider:", error.message);
      else providerMap.set(p.name, data.id);
    }
  }

  // 2. Upsert Resources
  console.log(`Upserting resources...`);
  const resourcesToUpsert = catalog.map(item => ({
    id: item.id,
    slug: item.id,
    type: item.type,
    title: item.title,
    provider_id: providerMap.get(item.provider),
    subject: item.subject,
    sub_topics: item.sub_topics,
    level: item.level,
    languages: item.language,
    duration: item.duration,
    format: item.format,
    cost: item.cost,
    access: item.access,
    url: item.url,
    direct_file_url: item.direct_file_url,
    summary: item.summary,
    modules: item.modules,
    prerequisites: item.prerequisites,
    certificate_offered: item.certificate_offered,
    license_name: item.license_name,
    license_url: item.license_url,
    redistribution_allowed: item.redistribution_allowed,
    attribution_text: item.attribution_text,
    embeddable: item.embeddable,
    date_published: item.date_published_or_updated,
    verified_date: item.verified_date,
    link_status: item.link_status || 'working',
    is_published: item.link_status !== 'broken'
  }));
  
  const { error: resError } = await supabase.from('resources').upsert(resourcesToUpsert, { onConflict: 'id' });
  
  if (resError) {
    console.error("Error upserting resources:", resError.message);
  } else {
    console.log("Import completed successfully.");
  }
}

importResources();
