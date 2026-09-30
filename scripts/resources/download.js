const fs = require('fs');
const path = require('path');

const CATALOG_FILE = path.join(process.cwd(), 'data', 'resources', 'catalog.json');
const POLICY_DOC = path.join(process.cwd(), 'docs', 'RESOURCE_POLICY.md');

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

if (!fs.existsSync(path.dirname(POLICY_DOC))) {
  fs.mkdirSync(path.dirname(POLICY_DOC), { recursive: true });
}

fs.writeFileSync(POLICY_DOC, `# Resource Download Policy\n\nDOWNLOAD ONLY IF ALL are true:\n- redistribution_allowed = "yes"\n- direct_file_url exists and is a PDF, EPUB, CSV, ZIP, or Image\n- passes size limits (15 MB per file, 300 MB total)\n- passes magic-bytes check\n\nDO NOT DOWNLOAD:\n- videos, websites, content behind logins\n- items with redistribution_allowed = "no" or "unknown"\n`);

async function runPolicy() {
  if (!fs.existsSync(CATALOG_FILE)) {
    console.error("catalog.json not found!");
    return;
  }
  const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf-8'));
  
  const toDownload = [];
  const linkOnly = [];
  let totalProjectedBytes = 0;
  const MAX_TOTAL_BYTES = 300 * 1024 * 1024;
  const MAX_FILE_BYTES = 15 * 1024 * 1024;

  for (const item of catalog) {
    let reason = [];
    let canDownload = true;
    
    if (item.redistribution_allowed !== 'yes') {
      canDownload = false;
      reason.push(`redistribution_allowed is ${item.redistribution_allowed}`);
    }
    
    if (item.access === 'login_required') {
      canDownload = false;
      reason.push('login required');
    }
    
    if (item.format === 'video') {
      canDownload = false;
      reason.push('video format not allowed');
    }
    
    if (!item.direct_file_url) {
      canDownload = false;
      reason.push('no direct_file_url');
    } else {
      const ext = item.direct_file_url.split('.').pop().toLowerCase();
      const allowedExts = ['pdf', 'epub', 'csv', 'zip', 'png', 'jpg', 'jpeg', 'webp'];
      if (!allowedExts.includes(ext)) {
        canDownload = false;
        reason.push(`extension .${ext} not in allowed list`);
      }
    }
    
    if (canDownload) {
      toDownload.push({ id: item.id, url: item.direct_file_url });
    } else {
      linkOnly.push({ id: item.id, reasons: reason.join(', ') });
    }
  }

  console.log(`\n--- DOWNLOAD POLICY DRY RUN ---`);
  console.log(`\nTotal items analyzed: ${catalog.length}`);
  console.log(`Items approved for download: ${toDownload.length}`);
  toDownload.forEach(item => console.log(` [✓] ${item.id} -> ${item.url}`));
  
  console.log(`\nItems restricted to link-only: ${linkOnly.length}`);
  linkOnly.forEach(item => console.log(` [X] ${item.id} -> ${item.reasons}`));
  console.log(`\n-------------------------------`);
  
  if (isDryRun) {
    console.log("Dry run complete. Run without --dry-run to perform actual downloads.");
  } else {
    console.log("Proceeding to download phase... (to be implemented in Stage 4)");
  }
}

runPolicy();
