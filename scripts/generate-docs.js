const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const args = process.argv.slice(2);

function argValue(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const sourceDir = path.resolve(rootDir, argValue("--source", "docs-src"));
const outputDir = path.resolve(rootDir, argValue("--output", "docs/documentation"));
const readmePath = path.resolve(rootDir, "README.md");

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

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      closeParagraph();
      closeList();
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

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      const level = heading[1].length;
      const text = heading[2].trim();
      html.push(`<h${level} id="${slugify(text)}">${renderInline(text)}</h${level}>`);
      return;
    }

    const item = line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/);
    if (item) {
      closeParagraph();
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
      return;
    }

    paragraph.push(line.trim());
  });

  closeParagraph();
  closeList();

  if (inCode) {
    html.push("</code></pre>");
  }

  return html.join("\n");
}

function titleFromMarkdown(markdown, fallback) {
  const heading = markdown.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : fallback;
}

function getMarkdownFiles() {
  const files = [];

  if (fs.existsSync(readmePath)) {
    files.push({
      source: readmePath,
      name: "visao-geral.md",
      order: 0,
    });
  }

  if (fs.existsSync(sourceDir)) {
    fs.readdirSync(sourceDir)
      .filter((file) => file.endsWith(".md"))
      .sort()
      .forEach((file, index) => {
        files.push({
          source: path.join(sourceDir, file),
          name: file,
          order: index + 1,
        });
      });
  }

  return files;
}

function pageTemplate({ title, body, nav, generatedAt }) {
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
      max-width: 1120px;
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
    .demo-link {
      color: var(--accent);
      font-weight: 700;
      text-decoration: none;
    }
    .layout {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      gap: 32px;
      max-width: 1120px;
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
      margin-bottom: 10px;
      font-size: 0.9rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: .04em;
    }
    nav a {
      display: block;
      padding: 8px 0;
      color: var(--text);
      text-decoration: none;
      border-top: 1px solid #edf0f3;
    }
    nav a:first-of-type { border-top: 0; }
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
    footer {
      color: var(--muted);
      font-size: .92rem;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #edf0f3;
    }
    @media (max-width: 820px) {
      .topbar { align-items: flex-start; flex-direction: column; }
      .layout { grid-template-columns: 1fr; padding: 20px 16px; }
      nav { position: static; }
      main { padding: 24px 18px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="topbar">
      <div class="brand">
        <span>Financas Pessoais</span>
        <small>Documentacao gerada por doc-as-code</small>
      </div>
      <a class="demo-link" href="../index.html">Abrir demo</a>
    </div>
  </header>
  <div class="layout">
    <nav>
      <strong>Documentos</strong>
      ${nav}
    </nav>
    <main>
      ${body}
      <footer>Gerado automaticamente em ${generatedAt}.</footer>
    </main>
  </div>
</body>
</html>`;
}

function buildDocs() {
  const files = getMarkdownFiles();
  if (!files.length) {
    throw new Error("Nenhum arquivo Markdown encontrado para gerar a documentacao.");
  }

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const pages = files.map((file) => {
    const markdown = fs.readFileSync(file.source, "utf8");
    const title = titleFromMarkdown(markdown, path.basename(file.name, ".md"));
    const slug = slugify(path.basename(file.name, ".md")) || `pagina-${file.order}`;
    return {
      ...file,
      markdown,
      title,
      slug,
      output: `${slug}.html`,
    };
  });

  const generatedAt = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  const nav = pages
    .map((page) => `<a href="${page.output}">${escapeHtml(page.title)}</a>`)
    .join("\n");

  pages.forEach((page) => {
    const body = renderMarkdown(page.markdown);
    fs.writeFileSync(
      path.join(outputDir, page.output),
      pageTemplate({ title: page.title, body, nav, generatedAt }),
      "utf8"
    );
  });

  fs.copyFileSync(path.join(outputDir, pages[0].output), path.join(outputDir, "index.html"));
  fs.writeFileSync(
    path.join(outputDir, "manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: "doc-as-code",
        pages: pages.map(({ title, output, source }) => ({
          title,
          output,
          source: path.relative(rootDir, source).replace(/\\/g, "/"),
        })),
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`Documentacao gerada em ${path.relative(rootDir, outputDir)} com ${pages.length} pagina(s).`);
}

buildDocs();
