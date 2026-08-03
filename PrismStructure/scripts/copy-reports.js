const fs = require('fs');
const path = require('path');

const prismRoot = path.join(__dirname, '..');
const repoRoot = path.join(prismRoot, '..');
const srcReports = path.join(prismRoot, 'Reports');
const destReports = path.join(repoRoot, 'reports');

const COPY_PATHS = [
  { from: 'playwright-report', to: 'playwright-report', recursive: true },
  { from: 'test-results.json', to: 'test-results.json', recursive: false },
  { from: 'junit-results.xml', to: 'junit-results.xml', recursive: false },
  { from: 'failure-logs', to: 'failure-logs', recursive: true },
];

function copyRecursive(source, destination) {
  if (fs.statSync(source).isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(destination, entry));
    }
    return;
  }
  fs.copyFileSync(source, destination);
}

function copyReports() {
  fs.mkdirSync(destReports, { recursive: true });

  for (const item of COPY_PATHS) {
    const source = path.join(srcReports, item.from);
    const destination = path.join(destReports, item.to);

    if (!fs.existsSync(source)) {
      console.warn(`Skip (missing): ${source}`);
      continue;
    }

    if (item.recursive) {
      fs.rmSync(destination, { recursive: true, force: true });
      copyRecursive(source, destination);
    } else {
      fs.copyFileSync(source, destination);
    }

    console.log(`Copied: ${item.from} -> reports/${item.to}`);
  }

  console.log(`Submission reports ready in ${destReports}`);
}

copyReports();
