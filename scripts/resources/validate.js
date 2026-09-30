const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(process.cwd(), 'data', 'raw', 'resources');
const OUT_DIR = path.join(process.cwd(), 'data', 'resources');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function validateAndMerge() {
  if (!fs.existsSync(RAW_DIR)) {
    console.error(`Directory not found: ${RAW_DIR}`);
    return;
  }

  const files = fs.readdirSync(RAW_DIR).filter(f => f.startsWith('resources_') && f.endsWith('.json'));
  
  const allValidResources = [];
  const errors = [];
  const seenIds = new Set();
  const seenUrls = new Set();

  for (const file of files) {
    const filePath = path.join(RAW_DIR, file);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (!Array.isArray(content)) {
        errors.push(`File ${file} does not contain a JSON array.`);
        continue;
      }

      content.forEach((item, index) => {
        // Safe fixes
        if (typeof item.id === 'string') {
          item.id = item.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        }
        if (typeof item.url === 'string') {
          item.url = item.url.trim();
        }
        if (typeof item.direct_file_url === 'string') {
          item.direct_file_url = item.direct_file_url.trim();
        }
        if (!item.confidence) item.confidence = 'unknown';

        // Basic validation instead of Zod for speed in this JS version
        if (!item.id || !item.type || !item.title || !item.url) {
           errors.push(`File ${file}, Item [${index}]: Missing required fields (id, type, title, or url)`);
           return;
        }

        // Check duplicates
        if (seenIds.has(item.id)) {
          errors.push(`File ${file}, Item [${index}]: Duplicate ID '${item.id}'`);
        } else if (seenUrls.has(item.url)) {
          errors.push(`File ${file}, Item [${index}]: Duplicate URL '${item.url}'`);
        } else {
          seenIds.add(item.id);
          seenUrls.add(item.url);
          allValidResources.push(item);
        }
      });
    } catch (e) {
      errors.push(`File ${file} contains invalid JSON: ${e.message}`);
    }
  }

  // Deduplicate and sort
  allValidResources.sort((a, b) => a.id.localeCompare(b.id));

  // Write catalog
  fs.writeFileSync(path.join(OUT_DIR, 'catalog.json'), JSON.stringify(allValidResources, null, 2));

  // Write report
  const report = `# Resource Validation Report\n\nTotal valid resources: ${allValidResources.length}\nTotal errors: ${errors.length}\n\n## Errors\n` + errors.map(e => `- ${e}`).join('\n');
  fs.writeFileSync(path.join(OUT_DIR, 'validation-report.md'), report);

  console.log(`Validation complete. Valid: ${allValidResources.length}. Errors: ${errors.length}.`);
  
  // Show counts
  const typeCounts = allValidResources.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {});
  const subjectCounts = allValidResources.reduce((acc, r) => { acc[r.subject] = (acc[r.subject] || 0) + 1; return acc; }, {});
  console.log("Counts by Type:", JSON.stringify(typeCounts));
  console.log("Counts by Subject:", JSON.stringify(subjectCounts));
}

validateAndMerge();
