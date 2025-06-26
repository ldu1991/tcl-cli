import unZipper from 'unzipper';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export const unpackingPlugins = async () => {
  const archivesDir = path.resolve(__dirname, '../archives');
  const archivePath = path.join(archivesDir, 'dev-wp-plugins.zip');

  if (!fs.existsSync(archivePath)) {
    throw new Error(`Archive not found at: ${archivePath}`);
  }

  const themePath = path.resolve('wp-content', 'plugins');

  fs.mkdirSync(themePath, {recursive: true});

  await fs.createReadStream(archivePath)
    .pipe(unZipper.Extract({path: themePath}))
    .promise();

  console.log(chalk.green(`Plugins successfully installed from local archive!`));
}
