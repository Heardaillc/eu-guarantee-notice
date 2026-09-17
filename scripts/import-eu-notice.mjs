#!/usr/bin/env node
/**
 * Imports the European Commission's official notice artwork into the theme app
 * extension.
 *
 * Why this exists: Regulation (EU) 2025/1960 states that no element of the
 * harmonised notice may be edited — not the wording, colours, layout or QR
 * code. A recreation is not compliant. So the app ships the Commission's own
 * files, unmodified, and this script only renames them into the asset naming
 * the Liquid block expects (eu-notice-<iso>.svg).
 *
 * Download the ZIP first, from:
 *   https://commission.europa.eu/publications/practical-guidelines-and-high-resolution-vector-files-eu-notice-and-label-product-guarantees_en
 *
 * Both packs work:
 *   - the SVG pack, used as-is;
 *   - the PDF pack, converted to SVG with pdftocairo (poppler-utils), which
 *     keeps the Commission's vectors intact rather than redrawing anything.
 *     In the PDF pack, page 1 is the colour version and page 2 is black and
 *     white. Online sales require colour, so page 1 is the one imported.
 *
 * Usage:
 *   npm run import:eu-notice -- ~/Downloads/eu-notice.zip
 *   npm run import:eu-notice -- ~/Downloads/unzipped-folder
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, statSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, extname, basename, resolve } from 'node:path';

const EU_LANGS = [
  'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'ga', 'hr',
  'hu', 'it', 'lt', 'lv', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'sl', 'sv',
];

// Commission files are commonly named with 3-letter or full language names.
const ALIASES = {
  bul: 'bg', ces: 'cs', cze: 'cs', dan: 'da', deu: 'de', ger: 'de', ell: 'el',
  gre: 'el', eng: 'en', spa: 'es', est: 'et', fin: 'fi', fra: 'fr', fre: 'fr',
  gle: 'ga', gai: 'ga', hrv: 'hr', hun: 'hu', ita: 'it', lit: 'lt', lav: 'lv',
  mlt: 'mt', nld: 'nl', dut: 'nl', pol: 'pl', por: 'pt', ron: 'ro', rum: 'ro',
  slk: 'sk', slo: 'sk', slv: 'sl', swe: 'sv',
  bulgarian: 'bg', czech: 'cs', danish: 'da', german: 'de', greek: 'el',
  english: 'en', spanish: 'es', estonian: 'et', finnish: 'fi', french: 'fr',
  irish: 'ga', croatian: 'hr', hungarian: 'hu', italian: 'it',
  lithuanian: 'lt', latvian: 'lv', maltese: 'mt', dutch: 'nl', polish: 'pl',
  portuguese: 'pt', romanian: 'ro', slovak: 'sk', slovenian: 'sl',
  slovene: 'sl', swedish: 'sv',
};

const ASSETS_DIR = resolve(
  new URL('..', import.meta.url).pathname,
  'extensions/eu-guarantee/assets',
);

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** Pull a language code out of a filename like "EU_notice_colour_DE.svg". */
function detectLanguage(filePath) {
  const name = basename(filePath, extname(filePath)).toLowerCase();
  const tokens = name.split(/[^a-z]+/).filter(Boolean);

  for (const token of tokens) {
    if (EU_LANGS.includes(token)) return token;
    if (ALIASES[token]) return ALIASES[token];
  }

  // Commission PDFs use codes like "ENN", "DEN", "SKN" — language code + N.
  for (const token of tokens) {
    if (token.length === 3 && token.endsWith('n')) {
      const prefix = token.slice(0, 2);
      if (EU_LANGS.includes(prefix)) return prefix;
    }
  }
  return null;
}

/** Page 1 of each Commission PDF is the colour notice; page 2 is black and white. */
const COLOUR_PAGE = 1;

function convertPdf(pdfPath, destination) {
  execFileSync('pdftocairo', [
    '-svg',
    '-f', String(COLOUR_PAGE),
    '-l', String(COLOUR_PAGE),
    pdfPath,
    destination,
  ]);
}

/** Black-and-white variants are not valid for online sales — skip them. */
function isBlackAndWhite(filePath) {
  const name = basename(filePath).toLowerCase();
  return /(^|[^a-z])(bw|b-w|blackandwhite|black_white|mono|grayscale|greyscale)([^a-z]|$)/.test(name);
}

function main() {
  const input = process.argv[2];
  if (!input) {
    fail(
      'Pass the downloaded ZIP or folder:\n' +
      '  npm run import:eu-notice -- ~/Downloads/eu-notice-svg.zip',
    );
  }

  const source = resolve(input);
  if (!existsSync(source)) fail(`Not found: ${source}`);

  let searchDir = source;
  let tempDir = null;

  if (statSync(source).isFile()) {
    if (extname(source).toLowerCase() !== '.zip') {
      fail('Expected a .zip file or a folder of SVGs.');
    }
    tempDir = mkdtempSync(join(tmpdir(), 'eu-notice-'));
    try {
      execFileSync('unzip', ['-q', '-o', source, '-d', tempDir]);
    } catch {
      fail('Could not unzip that file. Unzip it yourself and pass the folder instead.');
    }
    searchDir = tempDir;
  }

  const files = walk(searchDir).filter((f) => {
    const ext = extname(f).toLowerCase();
    return ext === '.svg' || ext === '.pdf';
  });

  if (files.length === 0) {
    fail('No .svg or .pdf files found in there. Check you unpacked the right download.');
  }

  const hasPdfs = files.some((f) => extname(f).toLowerCase() === '.pdf');
  if (hasPdfs) {
    try {
      execFileSync('pdftocairo', ['-v'], { stdio: 'ignore' });
    } catch {
      fail(
        'This is the PDF pack, and converting it needs pdftocairo (poppler-utils).\n' +
        '  Install poppler, or download the SVG pack instead.',
      );
    }
  }

  const chosen = new Map();
  const skipped = [];

  // Prefer SVG sources when a language appears in both packs.
  const ordered = [...files].sort((a, b) => extname(a).localeCompare(extname(b)));

  for (const file of ordered) {
    const lang = detectLanguage(file);
    if (!lang) {
      skipped.push(file);
      continue;
    }
    if (isBlackAndWhite(file)) continue; // online sales require colour
    if (!chosen.has(lang)) chosen.set(lang, file);
  }

  if (chosen.size === 0) {
    fail(
      'Could not work out the languages from the filenames.\n' +
      '  Rename them as eu-notice-de.svg, eu-notice-fr.svg … and drop them in\n' +
      `  ${ASSETS_DIR}`,
    );
  }

  for (const [lang, file] of chosen) {
    const destination = join(ASSETS_DIR, `eu-notice-${lang}.svg`);
    if (extname(file).toLowerCase() === '.pdf') {
      convertPdf(file, destination);
    } else {
      copyFileSync(file, destination);
    }
  }

  if (tempDir) rmSync(tempDir, { recursive: true, force: true });

  const imported = [...chosen.keys()].sort();
  const missing = EU_LANGS.filter((l) => !chosen.has(l));

  console.log(`\n  Imported ${imported.length} language${imported.length === 1 ? '' : 's'}: ${imported.join(', ')}`);
  if (missing.length) {
    console.log(`  Still missing: ${missing.join(', ')}`);
    console.log('  Shoppers browsing in those languages will see the English notice.');
  }
  if (skipped.length) {
    console.log(`  Ignored ${skipped.length} file(s) with no recognisable language code.`);
  }
  console.log('\n  Next: npm run dev, then open a product page on the dev store.\n');
}

main();
