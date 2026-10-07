/**
 * FloodWatch Guwahati - end-to-end smoke test for the demo.
 *
 * Drives the real app in headless Chrome (system install) and verifies the
 * key acceptance criteria: report submission, localStorage persistence,
 * admin status changes, admin filters, and a clean console.
 *
 * Run: npm run test:smoke   (starts its own dev server on port 5199)
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = 5199;
const BASE = `http://localhost:${PORT}`;

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, detail = "") {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${name}`);
  } else {
    failed += 1;
    failures.push(name);
    console.log(`  FAIL  ${name}${detail ? ` -- ${detail}` : ""}`);
  }
}

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

async function main() {
  const fs = await import("node:fs");
  const chromePath = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
  if (!chromePath) throw new Error("No Chrome/Edge installation found.");

  // Fresh browser profile (kept outside the project so Vite never watches it)
  // so the test always starts from seeded demo data.
  const profileDir = path.join(process.env.TEMP || ROOT, "fw-smoke-profile");
  fs.rmSync(profileDir, { recursive: true, force: true });

  console.log(`Using browser: ${chromePath}`);
  console.log(`Starting dev server on port ${PORT}...`);
  const server = spawn(
    "cmd.exe",
    ["/c", "npm", "run", "dev", "--", "--port", String(PORT), "--strictPort"],
    { cwd: ROOT, shell: false, stdio: "ignore", detached: true }
  );

  const consoleErrors = [];
  let browser;
  let page;
  try {
    await waitForServer(`${BASE}/`);
    console.log("Server is up. Running checks...\n");

    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-gpu",
        `--user-data-dir=${profileDir}`,
        "--window-size=390,844",
      ],
      defaultViewport: { width: 390, height: 844 },
    });
    page = await browser.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const loc = msg.location()?.url ?? "";
        consoleErrors.push(`${msg.text()} @ ${loc}`);
      }
    });
    page.on("pageerror", (err) => consoleErrors.push(String(err)));

    // --- 1. Home ---
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => document.body.innerText.includes("MONSOON WATCH"),
      { timeout: 15000 }
    );
    const homeHtml = await page.content();
    check("Home renders monsoon card", homeHtml.includes("MONSOON WATCH"));
    check("Home shows primary CTA", homeHtml.includes("REPORT FLOODING"));
    check(
      "Home shows nearby sample reports",
      homeHtml.includes("Bamunimaidam") && homeHtml.includes("Nearby Flood Reports")
    );
    check(
      "Home stats section present",
      homeHtml.includes("Current Situation") && homeHtml.includes("Active Reports")
    );
    // --- 2. Report form validation (missing location + severity) ---
    await page.goto(`${BASE}/report`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("form", { timeout: 10000 });
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("SUBMIT FLOOD REPORT")
      );
      btn?.click();
    });
    await sleep(400);
    let formHtml = await page.content();
    check(
      "Validation blocks missing location",
      formHtml.includes("Please select a flood location")
    );
    check(
      "Validation blocks missing severity",
      formHtml.includes("Please select a flood severity")
    );

    // --- 3. Fill and submit a report ---
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("Select Location on Map")
      );
      btn?.click();
    });
    await sleep(800);
    const mapEl = await page.$(".leaflet-container");
    check("Report form map picker opens", Boolean(mapEl));
    if (mapEl) {
      const box = await mapEl.boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await sleep(500);
    }
    formHtml = await page.content();
    check("Location selection is reflected", formHtml.includes("Location:"));

    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find(
        (b) =>
          b.getAttribute("role") === "radio" && b.textContent.includes("SEVERE")
      );
      btn?.click();
    });
    await sleep(300);

    await page.evaluate(() => {
      const depth = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("2-3 feet")
      );
      depth?.click();
      const section = [...document.querySelectorAll("section")].find((s) =>
        s.textContent.includes("Can vehicles pass?")
      );
      const road = section
        ? [...section.querySelectorAll("button")].find((b) =>
            b.textContent.trim().endsWith("No")
          )
        : undefined;
      road?.click();
    });
    await sleep(300);

    await page.evaluate(() => {
      const ta = document.querySelector("textarea");
      if (ta) {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        ).set;
        setter.call(ta, "Test lane flooded near the charali, small cars stuck.");
        ta.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    await sleep(200);

    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("SUBMIT FLOOD REPORT")
      );
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    check("Submit button clicked", clicked);
    await page
      .waitForFunction(() => window.location.pathname === "/report/success", {
        timeout: 8000,
      })
      .catch(() => {});
    check(
      "Submission navigates to success page",
      page.url().includes("/report/success")
    );
    await page.waitForFunction(
      () => document.body.innerText.includes("Flood Report Submitted"),
      { timeout: 15000 }
    );
    await sleep(300);
    const successHtml = await page.content();
    check("Success page shows report ID", /FW-2026-\d{6}/.test(successHtml));
    check(
      "Success page shows pending status",
      successHtml.includes("Pending Verification")
    );
    const submittedId = (successHtml.match(/FW-2026-\d{6}/) || [null])[0];
    console.log(`  info  submitted report: ${submittedId}`);

    // --- 4. Persistence across reload ---
    await page.reload({ waitUntil: "domcontentloaded" });
    await sleep(500);
    const persistedHtml = await page.content();
    check(
      "Success state survives reload (session/localStorage)",
      persistedHtml.includes(submittedId || "FW-2026-")
    );

    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => document.body.innerText.includes("Nearby Flood Reports"),
      { timeout: 15000 }
    );
    await sleep(300);
    const homeAfter = await page.content();
    check(
      "New report appears on Home immediately",
      homeAfter.includes(submittedId)
    );
    // --- 5. Map shows reports + filters ---
    await page.goto(`${BASE}/map`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => document.body.innerText.includes("DEMO DATA"),
      { timeout: 15000 }
    );
    await sleep(800);
    const mapHtml = await page.content();
    check("Map shows DEMO DATA label", mapHtml.includes("DEMO DATA"));
    check(
      "Map labels sample-data disclaimer",
      mapHtml.includes("Flood locations shown are sample reports for demonstration")
    );
    check("Map has markers", (mapHtml.match(/fw-marker/g) || []).length > 0);
    check(
      "Severity filters present",
      mapHtml.includes("Severe") && mapHtml.includes("Critical")
    );
    const beforeList = (mapHtml.match(/FW-2026-\d{6}/g) || []).length;
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find(
        (b) =>
          b.textContent.trim() === "Resolved" &&
          b.getAttribute("aria-pressed") !== null
      );
      btn?.click();
    });
    await sleep(500);
    const resolvedHtml = await page.content();
    const afterList = (resolvedHtml.match(/FW-2026-\d{6}/g) || []).length;
    check(
      "Map status filter works",
      afterList > 0 && afterList < beforeList,
      `before=${beforeList} after=${afterList}`
    );

    // --- 6. Admin dashboard ---
    await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () =>
        document.body.innerText.toLowerCase().includes("total reports"),
      { timeout: 15000 }
    );
    await sleep(300);
    const adminHtml = await page.content();
    check("Admin dashboard renders stats", adminHtml.includes("Total Reports"));
    check("Admin shows active floods stat", adminHtml.includes("Active Floods"));
    check("Admin dashboard has report table", adminHtml.includes("FW-2026-"));

    // --- 7. Admin filters ---
    await page.goto(`${BASE}/admin/reports`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => document.body.innerText.includes("All Reports"),
      { timeout: 15000 }
    );
    await sleep(400);
    const allHtml = await page.content();
    const totalIds = new Set(allHtml.match(/FW-2026-\d{6}/g) || []).size;
    await page.type("#admin-search", "Pandu");
    await sleep(500);
    const searched = await page.content();
    const searchIds = new Set(searched.match(/FW-2026-\d{6}/g) || []).size;
    check(
      "Admin search filters by location",
      searchIds > 0 && searchIds < totalIds,
      `total=${totalIds} search=${searchIds}`
    );
    check("Admin search shows Pandu", searched.includes("Pandu"));
    await page.evaluate(() => {
      const clear = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("Clear filters")
      );
      clear?.click();
    });
    await sleep(400);
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find(
        (b) =>
          b.textContent.trim() === "Critical" &&
          b.getAttribute("aria-pressed") !== null
      );
      btn?.click();
    });
    await sleep(400);
    const criticalHtml = await page.content();
    check(
      "Admin severity filter hides non-critical locations",
      criticalHtml.includes("FW-2026-") && !criticalHtml.includes("Bamunimaidam"),
      "expected only Critical reports"
    );
    // --- 8. Admin detail + status machine ---
    await page.goto(`${BASE}/admin/report/FW-2026-000124`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(
      () => document.body.innerText.includes("VERIFY REPORT"),
      { timeout: 15000 }
    );
    await sleep(300);
    let detailHtml = await page.content();
    check("Detail page renders report", detailHtml.includes("FW-2026-000124"));
    check(
      "Pending report offers VERIFY action",
      detailHtml.includes("VERIFY REPORT")
    );
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("VERIFY REPORT")
      );
      btn?.click();
    });
    await sleep(500);
    detailHtml = await page.content();
    check(
      "Status changes to Verified immediately",
      detailHtml.includes("Verified") && detailHtml.includes("MARK IN PROGRESS")
    );
    await page.reload({ waitUntil: "domcontentloaded" });
    await sleep(500);
    const detailReloaded = await page.content();
    check(
      "Status change persists after reload",
      detailReloaded.includes("MARK IN PROGRESS")
    );
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("MARK IN PROGRESS")
      );
      btn?.click();
    });
    await sleep(400);
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        b.textContent.includes("MARK RESOLVED")
      );
      btn?.click();
    });
    await sleep(400);
    detailHtml = await page.content();
    check(
      "Report reaches Resolved state",
      detailHtml.includes("Resolved") &&
        detailHtml.includes("No further actions available")
    );

    // --- 9. Profile shows reports + admin entry ---
    await page.goto(`${BASE}/profile`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => document.body.innerText.includes("Demo Citizen"),
      { timeout: 15000 }
    );
    await sleep(300);
    const profileHtml = await page.content();
    check("Profile shows demo user", profileHtml.includes("Demo Citizen"));
    check(
      "Profile has admin access button",
      profileHtml.includes("Open Admin Dashboard")
    );
    check("Profile lists my reports", profileHtml.includes("FW-2026-"));

    // --- 10. Console cleanliness ---
    const realErrors = consoleErrors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("ERR_NAME_NOT_RESOLVED") &&
        !e.includes("ERR_INTERNET_DISCONNECTED") &&
        !e.includes("tile.openstreetmap.org")
    );
    check(
      "No console errors during the whole run",
      realErrors.length === 0,
      realErrors.slice(0, 3).join(" | ")
    );



  } catch (err) {
    console.log("\n--- failure diagnostics ---");
    console.log(`url: ${page?.url?.() ?? "n/a"}`);
    if (page) {
      try {
        const body = await page.evaluate(
          () => document.body?.innerText?.slice(0, 600) ?? "(no body)"
        );
        console.log(`body text:\n${body}`);
      } catch {
        console.log("(could not read body)");
      }
    }
    console.log(`console errors (${consoleErrors.length}):`);
    for (const e of consoleErrors.slice(0, 8)) console.log(`  ${e}`);
    throw err;

  } finally {
    if (browser) await browser.close().catch(() => {});
    try {
      const { spawnSync } = await import("node:child_process");
      spawnSync("taskkill", [
        "/pid",
        String(server.pid),
        "/T",
        "/F",
      ]);
    } catch {
      server.kill();
    }
  }

  console.log(`\nResult: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.log("Failures:");
    for (const f of failures) console.log(`  - ${f}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
