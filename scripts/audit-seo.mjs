#!/usr/bin/env node
/**
 * Auditoría SEO/GEO + estructura de accesibilidad de HOLENTIA (automatiza la skill seo-geo-audit).
 *
 * Uso (desde la raíz del repo, con build reciente):
 *   pnpm build && pnpm audit:seo                        # arranca `next start` en el puerto de auditoría
 *   AUDIT_BASE=http://127.0.0.1:3000 pnpm audit:seo     # contra un server ya en marcha
 *   AUDIT_PORT=4400 pnpm audit:seo                      # puerto de arranque alternativo
 *
 * Qué valida por cada ruta del sitemap:
 *   - <title> con template "| HOLENTIA" y metaTitle ≤60 en herramientas
 *   - meta description presente (y 120–155 ch en herramientas)
 *   - canonical autorreferencial ×1 · 0 noindex · og:image propia · twitter card + image
 *   - JSON-LD por tipo de página (WebApplication + BreadcrumbList + FAQPage en herramientas)
 *   - FAQ ≥5 preguntas (herramientas) · línea en llms.txt (herramientas) · H1 ×1
 *   - estructura a11y: lang es-DO, skip link #contenido, <main> único
 *   - runtime: /{ruta}/opengraph-image responde 200 image/png
 *
 * Exit 1 si hay FAIL. Solo habla con el server local y lee public/llms.txt (cero red externa).
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import process from "node:process";

const SITE = "https://holentia.com";
const PORT = process.env.AUDIT_PORT ?? "4399";
const BASE = (process.env.AUDIT_BASE ?? `http://127.0.0.1:${PORT}`).replace(/\/$/, "");
const USE_SERVER = !process.env.AUDIT_BASE;

const HUBS = new Set(["/mente", "/relaciones", "/cuerpo", "/finanzas"]);
const COLLECTIONS = new Set([...HUBS, "/herramientas", "/guias"]);
const NON_TOOL = new Set([
  "/",
  ...COLLECTIONS,
  "/que-es-holentia",
  "/mis-datos",
  "/metodologia",
  "/accesibilidad",
  "/ayuda",
  "/apoyar",
  "/aviso-legal",
  "/politica-cookies",
]);

const llms = readFileSync("public/llms.txt", "utf8");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let child = null;
let stopping = false;

function startServer() {
  if (!existsSync(".next/BUILD_ID")) {
    console.error("✗ No hay build (.next/BUILD_ID). Ejecuta `pnpm build` primero.");
    process.exit(1);
  }
  child = spawn("node_modules/.bin/next", ["start", "-p", PORT], {
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", () => {});
  child.stderr.on("data", () => {});
}

function stopServer() {
  if (!child || stopping) return;
  stopping = true;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    try { child.kill("SIGTERM"); } catch {}
  }
}

async function waitForServer(timeoutMs = 90_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const r = await fetch(`${BASE}/robots.txt`);
      if (r.ok) return;
    } catch {}
    await sleep(500);
  }
  throw new Error(`timeout esperando ${BASE}`);
}

function decode(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function auditPage(path, html) {
  const fails = [];
  const warns = [];
  const isGuide = path.startsWith("/guias/");
  const isTool = !NON_TOOL.has(path) && !isGuide;
  const isContent = isTool || isGuide;
  const expectUrl = path === "/" ? `${SITE}/` : `${SITE}${path}`;
  const ogPrefix = (path === "/" ? SITE : `${SITE}${path}`) + "/opengraph-image";
  const norm = (u) => u.replace(/\/$/, "");

  const title = decode((html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "");
  if (!title) fails.push("sin <title>");
  else {
    if (path !== "/" && !title.endsWith("| HOLENTIA")) warns.push("title sin template «| HOLENTIA»");
    const base = title.replace(/\s*\|\s*HOLENTIA\s*$/, "");
    if (isTool && base.length > 60) warns.push(`metaTitle ${base.length} ch (>60)`);
  }

  const desc = decode((html.match(/name="description" content="([^"]*)"/) ?? [])[1] ?? "");
  if (!desc) fails.push("sin meta description");
  else if (isContent && (desc.length < 120 || desc.length > 155)) warns.push(`metaDescription ${desc.length} ch (120–155)`);

  const canon = html.match(/rel="canonical" href="([^"]*)"/g) ?? [];
  if (canon.length !== 1) fails.push(`canonical ×${canon.length} (esperado 1)`);
  else if (norm(canon[0].match(/href="([^"]*)"/)[1]) !== norm(expectUrl)) fails.push(`canonical ≠ ${expectUrl}`);

  if (/name="robots"[^>]*noindex/.test(html)) fails.push("noindex presente");

  const og = (html.match(/property="og:image" content="([^"]*)"/) ?? [])[1] ?? "";
  if (!og) fails.push("sin og:image");
  else if (!og.startsWith(ogPrefix)) fails.push("og:image ≠ ruta propia");

  if (!/name="twitter:card" content="summary_large_image"/.test(html)) fails.push("twitter:card ausente");
  if (!/name="twitter:image"/.test(html)) fails.push("twitter:image ausente");

  const ldCount = (html.match(/application\/ld\+json/g) ?? []).length;
  if (ldCount < 1) fails.push("sin JSON-LD");
  const has = (t) => html.includes(`"@type":"${t}"`);

  if (path === "/") {
    if (!has("WebSite")) fails.push("JSON-LD sin WebSite");
    if (!has("Organization")) fails.push("JSON-LD sin Organization");
  } else if (COLLECTIONS.has(path)) {
    if (!has("CollectionPage")) fails.push("JSON-LD sin CollectionPage");
    if (!has("BreadcrumbList")) fails.push("JSON-LD sin BreadcrumbList");
    if (path === "/guias" && !llms.includes(`](${SITE}/guias)`)) fails.push("sin línea en llms.txt");
  } else if (path === "/ayuda") {
    if (!has("FAQPage")) fails.push("JSON-LD sin FAQPage");
  } else if (isGuide) {
    for (const t of ["Article", "BreadcrumbList", "FAQPage"]) {
      if (!has(t)) fails.push(`JSON-LD sin ${t}`);
    }
    const qs = (html.match(/"@type":"Question"/g) ?? []).length;
    if (qs < 3) fails.push(`FAQ ${qs} preguntas (<3)`);
    if (!llms.includes(`](${SITE}${path})`)) fails.push("sin línea en llms.txt");
  } else if (isTool) {
    for (const t of ["WebApplication", "BreadcrumbList", "FAQPage"]) {
      if (!has(t)) fails.push(`JSON-LD sin ${t}`);
    }
    const qs = (html.match(/"@type":"Question"/g) ?? []).length;
    if (qs < 5) fails.push(`FAQ ${qs} preguntas (<5)`);
    if (!llms.includes(`](${SITE}${path})`)) fails.push("sin línea en llms.txt");
  }

  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fails.push(`H1 ×${h1}`);

  if (!html.includes('lang="es-DO"')) fails.push("html lang ≠ es-DO");
  if (!/href="#contenido"/.test(html)) fails.push("sin skip link #contenido");
  if (!/id="contenido"/.test(html)) fails.push("sin id=contenido");
  const mains = (html.match(/<main[\s>]/g) ?? []).length;
  if (mains !== 1) fails.push(`<main> ×${mains}`);

  return { fails, warns };
}

async function checkOg(path) {
  const url = `${BASE}${path === "/" ? "" : path}/opengraph-image`;
  try {
    const r = await fetch(url);
    const ct = r.headers.get("content-type") ?? "";
    if (r.status !== 200 || !ct.startsWith("image/png")) return `og ${r.status} ${ct || "sin content-type"}`;
    return null;
  } catch (e) {
    return `og error ${e.message}`;
  }
}

async function main() {
  if (USE_SERVER) {
    startServer();
    await waitForServer();
  }

  const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
  if (!sitemapRes.ok) throw new Error(`sitemap: ${sitemapRes.status}`);
  const sitemapXml = await sitemapRes.text();
  const paths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/")
    .sort();

  console.log(`\nAuditoría HOLENTIA — ${paths.length} rutas (base ${BASE})\n`);

  let failed = 0;
  let warned = 0;
  const routeFails = [];

  for (const path of paths) {
    const res = await fetch(`${BASE}${path === "/" ? "" : path}`);
    const html = await res.text();
    const { fails, warns } = auditPage(path, html);
    const ogFail = await checkOg(path);
    if (ogFail) fails.push(ogFail);

    const isGuide = path.startsWith("/guias/");
    const isTool = !NON_TOOL.has(path) && !isGuide;
    const dots = path === "/" ? "/" : path.slice(1);
    if (fails.length) {
      failed += 1;
      routeFails.push([dots, fails]);
      console.log(`✗ ${dots}${isTool || isGuide ? "" : " (no-tool)"}`);
      for (const f of fails) console.log(`    FAIL: ${f}`);
    } else {
      console.log(`✓ ${dots}${isTool || isGuide ? "" : " (no-tool)"}`);
    }
    if (warns.length) {
      warned += 1;
      for (const w of warns) console.log(`    WARN: ${w}`);
    }
  }

  // Cobertura cruzada: toda ruta de llms.txt debe estar en el sitemap
  const llmsPaths = [...llms.matchAll(/\]\((https:\/\/holentia\.com\/[^)\s]+)\)/g)]
    .map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/");
  const missing = [...new Set(llmsPaths)].filter((p) => !paths.includes(p));
  if (missing.length) {
    failed += 1;
    console.log(`\n✗ Rutas de llms.txt ausentes del sitemap: ${missing.join(", ")}`);
  }

  console.log(`\nResumen: ${paths.length - routeFails.length}/${paths.length} rutas PASS · ${failed} FAIL · ${warned} WARN`);
  if (failed) process.exitCode = 1;
  else console.log("Auditoría en verde ✅ (runtime OG 200 image/png en todas las rutas)\n");
}

try {
  await main();
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exitCode = 1;
} finally {
  if (USE_SERVER) {
    stopServer();
    await sleep(300);
  }
  process.exit(process.exitCode ?? 0);
}
