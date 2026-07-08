const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const buildDir = path.join(rootDir, "build");
const pagesDir = path.join(rootDir, "docs");

if (!fs.existsSync(buildDir)) {
  throw new Error("Diretorio build nao encontrado. Execute npm run build antes de preparar o GitHub Pages.");
}

fs.mkdirSync(pagesDir, { recursive: true });

[
  "asset-manifest.json",
  "favicon.ico",
  "index.html",
  "logo192.png",
  "logo512.png",
  "manifest.json",
  "robots.txt",
  "static",
].forEach((entry) => {
  fs.rmSync(path.join(pagesDir, entry), { recursive: true, force: true });
});

fs.cpSync(buildDir, pagesDir, { recursive: true });

console.log(`Demo copiada de ${path.relative(rootDir, buildDir)} para ${path.relative(rootDir, pagesDir)}.`);
