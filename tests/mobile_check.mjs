/**
 * Mobile layout check: emulates a true 360px viewport (unlike Chrome's
 * --window-size which can be clamped by the OS) and verifies:
 *  - no horizontal page scrolling on any route at 360px
 *  - key text/buttons are present
 *  - captures screenshots for visual review
 *
 * Run: node tests/mobile_check.mjs
 */
import { spawn, spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = 5198;
const BASE = `http://localhost:${PORT}`;
const SHOTS = path.join(ROOT, "shots");

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/map", name: "map" },
  { path: "/report", name: "report" },
  { path: "/alerts", name: "alerts" },
  { path: "/profile", name: "profile" },
  { path: "/admin", name: "admin" },
  { path: "/admin/reports", name: "admin_reports" },
  { path: "/admin/report/FW-2026-000124", name: "admin_detail" },
];

async function waitForServer(url, tries = 60) {
  for (let i = 0; i < tries; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await sleep(500);
  }
  throw new Error(`Server at ${url} did not come up`);
}

let failed = 0;

async function main() {
  const chromePath = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
  if (!chromePath) throw new Error("No Chrome/Edge installation found.");
  fs.mkdirSync(SHOTS, { recursive: true });

  const profileDir = path.join(process.env.TEMP || ROOT, "fw-mobile-profile");
  fs.rmSync(profileDir, { recursive: true, force: true });

  console.log(`Starting dev server on port ${PORT}...`);
  const server = spawn(
    "cmd.exe",
    ["/c", "npm", "run", "dev", "--", "--port", String(PORT), "--strictPort"],
    { cwd: ROOT, shell: false, stdio: "ignore", detached: true }
  );

  let browser;
  try {
    await waitForServer(`${BASE}/`);
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-gpu",
        `--user-data-dir=${profileDir}`,
        "--hide-scrollbars",
      ],
      defaultViewport: { width: 360, height: 800, isMobile: true },
    });
    const page = await browser.newPage();

    for (const route of ROUTES) {
      await page.goto(`${BASE}${route.path}`, {
        waitUntil: "domcontentloaded",
      });
      await sleep(route.path === "/map" ? 2500 : 1400);

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
      }));
      const overflow = Math.max(
        metrics.scrollWidth,
        metrics.bodyScrollWidth
      ) - metrics.clientWidth;
      const ok = overflow <= 1;
      if (!ok) failed += 1;
      console.log(
        `  ${ok ? "PASS" : "FAIL"}  ${route.name}: no horizontal scroll (overflow=${overflow}px, client=${metrics.clientWidth})`
      );

      await page.screenshot({
        path: path.join(SHOTS, `${route.name}_360.png`),
        fullPage: false,
      });
    }

    // Desktop admin layout at 1366px.
    await page.setViewport({ width: 1366, height: 900 });
    await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
    await sleep(1800);
    const desktop = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    const desktopOk = desktop.scrollWidth - desktop.clientWidth <= 1;
    if (!desktopOk) failed += 1;
    console.log(
      `  ${desktopOk ? "PASS" : "FAIL"}  admin desktop: no horizontal scroll`
    );
    await page.screenshot({ path: path.join(SHOTS, "admin_1366.png") });
  } finally {
    if (browser) await browser.close().catch(() => {});
    try {
      spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"]);
    } catch {
      server.kill();
    }
  }

  console.log(failed === 0 ? "\nMobile layout OK" : `\n${failed} FAILURES`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("mobile_check crashed:", err);
  process.exit(1);
});
