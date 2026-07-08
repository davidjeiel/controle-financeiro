const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const buildDir = path.join(rootDir, "build");
const siteDir = path.join(rootDir, "site");

if (!fs.existsSync(buildDir)) {
  throw new Error("Diretorio build nao encontrado. Execute npm run build antes de preparar o GitHub Pages.");
}

fs.rmSync(siteDir, { recursive: true, force: true });
fs.mkdirSync(siteDir, { recursive: true });
fs.cpSync(buildDir, siteDir, { recursive: true });

console.log(`Demo copiada de ${path.relative(rootDir, buildDir)} para ${path.relative(rootDir, siteDir)}.`);
