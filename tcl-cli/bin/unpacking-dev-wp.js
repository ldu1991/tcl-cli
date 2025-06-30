import unZipper from 'unzipper';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import {fileURLToPath} from 'url';
import {createProjectConfig} from "./create-project-config.js";
import {promisify} from "util";
import {exec} from "child_process";
import {createGitignore} from "./create-gitignore.js";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export const unpackingDevWp = async (theme, siteUrl, projectName) => {
  const archivesDir = path.resolve(__dirname, '../archives');
  let archiveName   = '';
  if (theme === 'gutenberg') {
    archiveName = 'dev-wp-gutenberg.zip';
  } else if (theme === 'flexible') {
    archiveName = 'dev-wp-flexible.zip';
  }
  const archivePath = path.join(archivesDir, archiveName);

  if (!fs.existsSync(archivePath)) {
    throw new Error(`Archive not found at: ${archivePath}`);
  }

  const themePath = path.resolve('dev-wp');

  fs.mkdirSync(themePath, {recursive: true});

  await fs.createReadStream(archivePath)
    .pipe(unZipper.Extract({path: themePath}))
    .promise();

  console.log(chalk.green(`dev-wp installed successfully from local archive!`));

  await createProjectConfig(siteUrl, projectName);

  await createGitignore();

  console.log(chalk.cyan('Running:'), `npm install in ${themePath}...`);
  try {
    const {stdout, stderr} = await execAsync('npm install', {cwd: themePath});
    console.log(chalk.green('npm install completed successfully.'));
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(chalk.red('npm install failed:'), error);
  }
}
