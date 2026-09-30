import fs from 'fs';
import path from 'path';
import { resourceSchema } from '../../src/lib/resources/schema';

const RAW_DIR = path.join(process.cwd(), 'data', 'raw', 'resources');
const OUT_DIR = path.join(process.cwd(), 'data', 'resources');

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

        const result = resourceSchema.safeParse(item);
        if (!result.success) {
          errors.push(`File ${file}, Item [${index}] (ID: ${item.id}): Validation failed -> ${result.error.issues.map(i => i.path.join('.') + ' ' + i.message).join(', ')}`);
        } else {
          // Check duplicates
          if (seenIds.has(result.data.id)) {
            errors.push(`File ${file}, Item [${index}]: Duplicate ID '${result.data.id}'`);
          } else if (seenUrls.has(result.data.url)) {
            errors.push(`File ${file}, Item [${index}]: Duplicate URL '${result.data.url}'`);
          } else {
            seenIds.add(result.data.id);
            seenUrls.add(result.data.url);
            allValidResources.push(result.data);
          }
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

  console.log(`Validation complete. Valid: ${allValidResources.length}. Errors: ${errors.length}. See data/resources/validation-report.md`);
  
  // Show counts
  const typeCounts = allValidResources.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {});
  const subjectCounts = allValidResources.reduce((acc, r) => { acc[r.subject] = (acc[r.subject] || 0) + 1; return acc; }, {});
  console.log("\nCounts by Type:", typeCounts);
  console.log("Counts by Subject:", subjectCounts);
}

validateAndMerge();
