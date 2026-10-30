#!/usr/bin/env node
// Checks that every `Claude: ⚙ <SN>` line in a lane names its own item and has a playbook entry
// under that lane, that every playbook lane entry still has an item, and that no SN repeats. Run from anywhere: `node check.mjs`.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));
const playbook = readFileSync(join(root, 'playbook.md'), 'utf8');

// `## Lane S` → { S: Set('6.2c') }
const entries = {};
let lane = null;
for (const line of playbook.split('\n')) {
  const heading = /^## Lane (\S+)/.exec(line);
  if (heading) {
    lane = heading[1];
    entries[lane] = new Set();
  } else if (/^## /.test(line)) {
    lane = null;
  } else if (lane) {
    const entry = /^### (\S+)/.exec(line);
    if (entry) entries[lane].add(entry[1]);
  }
}

const problems = [];
for (const { slug, path } of manifest.lanes) {
  const key = slug.replace(/^size-/, '').toUpperCase();
  const markdown = readFileSync(join(root, path), 'utf8');
  const wanted = new Set();
  const items = new Set();
  let heading = null;
  markdown.split('\n').forEach((line, i) => {
    const item = /^#{3,4} (\S+)/.exec(line);
    if (item) {
      if (items.has(item[1])) problems.push(`${path}:${i + 1}: SN ${item[1]} is used twice`);
      items.add(item[1]);
      heading = item[1];
      return;
    }
    const claude = /^Claude: ⚙ (\S+)/.exec(line);
    if (!claude) return;
    if (claude[1] !== heading) problems.push(`${path}:${i + 1}: Claude line names ${claude[1]} under item ${heading}`);
    wanted.add(claude[1]);
  });
  const have = entries[key] ?? new Set();
  for (const sn of wanted) if (!have.has(sn)) problems.push(`${path}: ${sn} has a Claude line but no playbook entry`);
  for (const sn of have) {
    if (!items.has(sn)) problems.push(`playbook.md Lane ${key}: ${sn} has no item in ${path}`);
    else if (!wanted.has(sn)) problems.push(`${path}: ${sn} has a playbook entry but no Claude line`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('Lanes and playbook match.');
