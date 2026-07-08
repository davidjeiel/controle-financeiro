const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const args = process.argv.slice(2);

function argValue(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const sourceDir = path.resolve(rootDir, argValue("--source", "docs"));
const outputDir = path.resolve(rootDir, argValue("--output", "site/documentation"));

const categories = [
  {
    key: "tutorials",
    label: "Tutorials",
    description: "Aprendizado guiado para quem esta comecando ou precisa completar uma jornada do inicio ao fim.",
  },
  {
    key: "how-to",
    label: "How-to",
    description: "Guias objetivos para resolver tarefas especificas em contexto real.",
  },
  {
    key: "reference",
    label: "Reference",
    description: "Informacao tecnica estruturada para consulta rapida e precisa.",
  },
  {
    key: "explanation",
    label: "Explanation",
    description: "Contexto, decisoes, arquitetura e racional tecnico do projeto.",
  },
];

const inlineRules = [
  [/\*\*(.+?)\*\*/g, "<strong>$1</strong>"],
  [/`([^`]+?)`/g, "<code>$1</code>"],
  [/\[([^\]]+?)\]\((.+?)\)/g, '<a href="$2">$1</a>'],
];

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderInline(value) {
  let output = escapeHtml(value);
  inlineRules.forEach(([rule, replacement]) => {
    output = output.replace(rule, replacement);
  });
  return output;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let inCode = false;
  let listOpen = false;
  let tableOpen = false;
  let paragraph = [];

  function closeParagraph() {
    if (paragraph.length) {
      html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }

  function closeList() {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  }

  function closeTable() {
    if (tableOpen) {
      html.push("</tbody></table>");
      tableOpen = false;
    }
  }

  lines.forEach((line, index) => {
    if (line.trim().startsWith("```")) {
      closeParagraph();
      closeList();
      closeTable();
      if (inCode) {
        html.push("</code></pre>");
      } else {
        html.push("<pre><code>");
      }
      inCode = !inCode;
      return;
    }

    if (inCode) {
      html.push(escapeHtml(line));
      return;
    }

    const cells = line.trim().startsWith("|")
      ? line.trim().split("|").slice(1, -1).map((cell) => cell.trim())
      : null;
    const nextLine = lines[index + 1] || "";
    const nextIsSeparator = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(nextLine);
    const isSeparator = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);

    if (cells && !isSeparator) {
      closeParagraph();
      closeList();
      if (!tableOpen) {
        html.push("<table>");
        if (nextIsSeparator) {
          html.push("<thead>");
          html.push(`<tr>${cells.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr>`);
          html.push("</thead><tbody>");
          tableOpen = true;
          return;
        }
        html.push("<tbody>");
        tableOpen = true;
      }
      html.push(`<tr>${cells.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`);
      return;
    }

    if (isSeparator) {
      return;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      closeTable();
      const level = heading[1].length;
      const text = heading[2].trim();
      html.push(`<h${level} id="${slugify(text)}">${renderInline(text)}</h${level}>`);
      return;
    }

    const item = line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/);
    if (item) {
      closeParagraph();
      closeTable();
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${renderInline(item[1].trim())}</li>`);
      return;
    }

    if (!line.trim()) {
      closeParagraph();
      closeList();
      closeTable();
      return;
    }

    paragraph.push(line.trim());
  });

  closeParagraph();
  closeList();
  closeTable();

  if (inCode) {
    html.push("</code></pre>");
  }

  return html.join("\n");
}

function titleFromMarkdown(markdown, fallback) {
  const heading = markdown.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : fallback;
}

function walkMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkMarkdownFiles(fullPath);
    }
    return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
  });
}

function pageOutputPath(source) {
  const relative = path.relative(sourceDir, source);
  const parsed = path.parse(relative);
  return path.join(parsed.dir, `${slugify(parsed.name)}.html`);
}

function relativeUrl(fromOutput, toOutput) {
  const fromDir = path.dirname(fromOutput);
  const url = path.relative(fromDir, toOutput).replace(/\\/g, "/");
  return url || path.basename(toOutput);
}

function getMarkdownFiles() {
  const knownCategories = new Set(categories.map((category) => category.key));

  return walkMarkdownFiles(sourceDir)
    .map((source) => {
      const relative = path.relative(sourceDir, source).replace(/\\/g, "/");
      const [categoryKey] = relative.split("/");
      const category = categories.find((item) => item.key === categoryKey) || {
        key: "other",
        label: "Outros",
        description: "Documentos fora da estrutura Diataxis principal.",
      };

      if (!knownCategories.has(categoryKey)) {
        console.warn(`Aviso: ${relative} esta fora das categorias Diataxis conhecidas.`);
      }

      const markdown = fs.readFileSync(source, "utf8");
      const output = pageOutputPath(source);

      return {
        source,
        relative,
        markdown,
        title: titleFromMarkdown(markdown, path.basename(source, ".md")),
        category,
        output,
      };
    })
    .sort((a, b) => {
      const categoryA = categories.findIndex((category) => category.key === a.category.key);
      const categoryB = categories.findIndex((category) => category.key === b.category.key);
      return categoryA - categoryB || a.relative.localeCompare(b.relative);
    });
}

function navForPage(pages, currentOutput) {
  return categories
    .map((category) => {
      const links = pages
        .filter((page) => page.category.key === category.key)
        .map((page) => {
          const active = page.output === currentOutput ? ' aria-current="page"' : "";
          return `<a${active} href="${relativeUrl(currentOutput, page.output)}">${escapeHtml(page.title)}</a>`;
        })
        .join("\n");

      if (!links) {
        return "";
      }

      return `<strong>${category.label}</strong>\n${links}`;
    })
    .filter(Boolean)
    .join("\n");
}

function pageTemplate({ title, body, nav, generatedAt, currentOutput }) {
  const demoHref = relativeUrl(currentOutput, "../index.html");
  const homeHref = relativeUrl(currentOutput, "index.html");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} - Documentacao</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f8fa;
      --panel: #ffffff;
      --text: #1f2937;
      --muted: #667085;
      --border: #d7dde5;
      --accent: #0f766e;
      --accent-soft: #e7f6f3;
      --code: #111827;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.65;
    }
    header {
      border-bottom: 1px solid var(--border);
      background: var(--panel);
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      max-width: 1180px;
      margin: 0 auto;
      padding: 18px 24px;
    }
    .brand {
      display: grid;
      gap: 2px;
      font-weight: 700;
    }
    .brand small {
      color: var(--muted);
      font-weight: 500;
    }
    .toplinks {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }
    .toplinks a {
      color: var(--accent);
      font-weight: 700;
      text-decoration: none;
    }
    .layout {
      display: grid;
      grid-template-columns: 280px minmax(0, 1fr);
      gap: 32px;
      max-width: 1180px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    nav {
      align-self: start;
      position: sticky;
      top: 24px;
      border: 1px solid var(--border);
      background: var(--panel);
      border-radius: 8px;
      padding: 16px;
    }
    nav strong {
      display: block;
      margin: 18px 0 8px;
      font-size: 0.82rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: .04em;
    }
    nav strong:first-child { margin-top: 0; }
    nav a {
      display: block;
      padding: 7px 0;
      color: var(--text);
      text-decoration: none;
      border-top: 1px solid #edf0f3;
    }
    nav a[aria-current="page"] {
      color: var(--accent);
      font-weight: 700;
    }
    main {
      min-width: 0;
      border: 1px solid var(--border);
      background: var(--panel);
      border-radius: 8px;
      padding: 36px;
    }
    h1, h2, h3, h4 {
      line-height: 1.22;
      margin: 1.35em 0 .55em;
    }
    h1 { margin-top: 0; font-size: clamp(2rem, 4vw, 3rem); }
    h2 { border-top: 1px solid #edf0f3; padding-top: 1em; }
    a { color: var(--accent); }
    code {
      background: #eef2f6;
      border-radius: 5px;
      padding: 0.1rem 0.35rem;
      font-size: 0.92em;
    }
    pre {
      overflow-x: auto;
      background: var(--code);
      color: #f9fafb;
      border-radius: 8px;
      padding: 16px;
    }
    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: .96rem;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
    }
    th { background: #f1f5f9; }
    .diataxis-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    .diataxis-card {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 18px;
      background: #fbfcfd;
    }
    .diataxis-card h2 {
      border: 0;
      padding: 0;
      margin: 0 0 8px;
      font-size: 1.2rem;
    }
    .diataxis-card ul {
      margin: 12px 0 0;
      padding-left: 20px;
    }
    footer {
      color: var(--muted);
      font-size: .92rem;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #edf0f3;
    }
    @media (max-width: 860px) {
      .topbar { align-items: flex-start; flex-direction: column; }
      .layout { grid-template-columns: 1fr; padding: 20px 16px; }
      nav { position: static; }
      main { padding: 24px 18px; }
      .diataxis-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>
    <div class="topbar">
      <div class="brand">
        <span>Financas Pessoais</span>
        <small>Documentacao Diataxis gerada por doc-as-code</small>
      </div>
      <div class="toplinks">
        <a href="${homeHref}">Inicio docs</a>
        <a href="${demoHref}">Abrir demo</a>
      </div>
    </div>
  </header>
  <div class="layout">
    <nav>${nav}</nav>
    <main>
      ${body}
      <footer>Gerado automaticamente em ${generatedAt}.</footer>
    </main>
  </div>
</body>
</html>`;
}

function indexBody(pages) {
  const cards = categories
    .map((category) => {
      const links = pages
        .filter((page) => page.category.key === category.key)
        .map((page) => `<li><a href="${page.output.replace(/\\/g, "/")}">${escapeHtml(page.title)}</a></li>`)
        .join("\n");

      return `<section class="diataxis-card">
  <h2>${category.label}</h2>
  <p>${category.description}</p>
  <ul>${links}</ul>
</section>`;
    })
    .join("\n");

  return `<h1>Documentacao Diataxis</h1>
<p>Esta documentacao e organizada em quatro modos: tutorials, how-to, reference e explanation. Essa separacao ajuda leitores a encontrar aprendizado guiado, guias praticos, consulta tecnica e contexto arquitetural sem misturar objetivos diferentes.</p>
<div class="diataxis-grid">${cards}</div>`;
}

function buildDocs() {
  const pages = getMarkdownFiles();
  if (!pages.length) {
    throw new Error("Nenhum arquivo Markdown encontrado para gerar a documentacao.");
  }

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const generatedAt = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  const indexOutput = "index.html";
  const indexNav = navForPage(pages, indexOutput);
  fs.writeFileSync(
    path.join(outputDir, indexOutput),
    pageTemplate({
      title: "Documentacao Diataxis",
      body: indexBody(pages),
      nav: indexNav,
      generatedAt,
      currentOutput: indexOutput,
    }),
    "utf8"
  );

  pages.forEach((page) => {
    const body = renderMarkdown(page.markdown);
    const target = path.join(outputDir, page.output);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(
      target,
      pageTemplate({
        title: page.title,
        body,
        nav: navForPage(pages, page.output),
        generatedAt,
        currentOutput: page.output,
      }),
      "utf8"
    );
  });

  fs.writeFileSync(
    path.join(outputDir, "manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: "doc-as-code-diataxis",
        categories: categories.map(({ key, label }) => ({ key, label })),
        pages: pages.map(({ title, output, source, category }) => ({
          title,
          output: output.replace(/\\/g, "/"),
          category: category.key,
          source: path.relative(rootDir, source).replace(/\\/g, "/"),
        })),
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`Documentacao Diataxis gerada em ${path.relative(rootDir, outputDir)} com ${pages.length} pagina(s).`);
}

buildDocs();
