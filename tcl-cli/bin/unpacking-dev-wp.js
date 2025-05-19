import unZipper from 'unzipper';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export const unpackingDevWp = async (theme) => {
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

  console.log(chalk.cyan('Extracting dev-wp from local archive...'));
  await fs.createReadStream(archivePath)
    .pipe(unZipper.Extract({path: themePath}))
    .promise();
  console.log(chalk.green('dev-wp installed successfully from local archive!'));
}
