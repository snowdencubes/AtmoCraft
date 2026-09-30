const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CATALOG_FILE = path.join(process.cwd(), 'data', 'resources', 'catalog.json');
const REPORT_FILE = path.join(process.cwd(), 'data', 'resources', 'link-report.json');
const MD_REPORT_FILE = path.join(process.cwd(), 'docs', 'RESOURCE_VERIFICATION.md');

if (!fs.existsSync(path.dirname(MD_REPORT_FILE))) {
  fs.mkdirSync(path.dirname(MD_REPORT_FILE), { recursive: true });
}

function checkUrl(urlStr) {
  return new Promise((resolve) => {
    if (!urlStr) return resolve({ status: 'broken', code: null, redirect: null });
    
    const client = urlStr.startsWith('https') ? https : http;
    const req = client.request(urlStr, { method: 'HEAD', timeout: 5000 }, (res) => {
      let status = 'working';
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        status = 'redirected';
      } else if (res.statusCode >= 400) {
        if (res.statusCode === 401 || res.statusCode === 403) status = 'login_required';
        else status = 'broken';
      }
      resolve({
        status,
        code: res.statusCode,
        redirect: res.headers.location || null,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
      });
    });
    
    req.on('error', () => resolve({ status: 'broken', code: null, redirect: null }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 'broken', code: 'timeout', redirect: null }); });
    req.end();
  });
}

async function verifyLinks() {
  if (!fs.existsSync(CATALOG_FILE)) {
    console.error("catalog.json not found!");
    return;
  }
  
  const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf-8'));
  const results = {
    working: 0,
    redirected: 0,
    broken: 0,
    login_required: 0,
    downgraded: 0,
    details: {}
  };

  console.log(`Verifying links for ${catalog.length} items. This may take a minute...`);
  
  for (const item of catalog) {
    const urlRes = await checkUrl(item.url);
    const fileRes = item.direct_file_url ? await checkUrl(item.direct_file_url) : null;
    
    let finalStatus = urlRes.status;
    if (finalStatus === 'broken') results.broken++;
    else if (finalStatus === 'redirected') results.redirected++;
    else if (finalStatus === 'login_required') results.login_required++;
    else results.working++;
    
    let licenseDowngraded = false;
    if (item.redistribution_allowed === 'yes') {
      // Very naive license check for the script: if license url is broken, downgrade
      if (item.license_url) {
        const licRes = await checkUrl(item.license_url);
        if (licRes.status === 'broken' || licRes.status === 'login_required') {
          item.redistribution_allowed = 'unknown';
          licenseDowngraded = true;
          results.downgraded++;
        }
      }
    }
    
    item.link_status = finalStatus;
    
    results.details[item.id] = {
      url_status: urlRes.status,
      url_code: urlRes.code,
      file_status: fileRes ? fileRes.status : null,
      licenseDowngraded
    };
  }
  
  fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2));
  fs.writeFileSync(REPORT_FILE, JSON.stringify(results, null, 2));
  
  const mdReport = `# Resource Link & License Verification
  
## Summary
- **Total Checked:** ${catalog.length}
- **Working:** ${results.working}
- **Redirected:** ${results.redirected}
- **Broken:** ${results.broken}
- **Login Required:** ${results.login_required}
- **Licenses Downgraded to 'unknown':** ${results.downgraded}

*Broken items have been flagged in the catalog with \`link_status: "broken"\`.*
`;
  
  fs.writeFileSync(MD_REPORT_FILE, mdReport);
  console.log("Verification complete. Details written to docs/RESOURCE_VERIFICATION.md");
}

verifyLinks();
