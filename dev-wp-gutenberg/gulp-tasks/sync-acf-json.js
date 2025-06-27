import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import chalk from "chalk";

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const projectConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../project-config.json')).toString());

const folderA = './src/acf-json';
const folderB = `${projectConfig.themePath}/acf-json`;

function getJsonFiles(folder) {
  return fs.existsSync(folder)
    ? fs.readdirSync(folder).filter(f => f.endsWith('.json'))
    : [];
}

function readJson(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error reading or parsing JSON: ${filePath}`, e);
    return null;
  }
}

function copyFile(src, dest) {
  const dir = path.dirname(dest);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.copyFileSync(src, dest);
  console.log(chalk.blue('Sync ACF json:'), chalk.greenBright.bold(src), ' → ', chalk.yellowBright.bold(dest));
}

function syncFolders(from, to) {
  const files = getJsonFiles(from);

  files.forEach(file => {
    const fromPath = path.join(from, file);
    const toPath   = path.join(to, file);

    const fromJson = readJson(fromPath);
    if (!fromJson || typeof fromJson.modified !== 'number') return;

    if (!fs.existsSync(toPath)) {
      copyFile(fromPath, toPath);
      return;
    }

    const toJson = readJson(toPath);
    if (!toJson || typeof toJson.modified !== 'number') return;

    if (fromJson.modified > toJson.modified) {
      copyFile(fromPath, toPath);
    } else if (fromJson.modified < toJson.modified) {
      copyFile(toPath, fromPath);
    }
  });
}

export async function syncAcfJson() {
  syncFolders(folderA, folderB);
  syncFolders(folderB, folderA);
}
