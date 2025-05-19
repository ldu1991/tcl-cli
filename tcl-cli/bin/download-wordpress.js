import fetch from 'node-fetch';
import unZipper from 'unzipper';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const downloadAndExtractWordPress = async () => {
  const zipUrl  = 'https://wordpress.org/latest.zip';
  const zipPath = path.resolve('wordpress.zip');

  console.log(chalk.cyan('Downloading WordPress...'));

  const response = await fetch(zipUrl);
  if (!response.ok) {
    throw new Error(`Failed to download ZIP archive: ${response.statusText}`);
  }

  const fileStream = fs.createWriteStream(zipPath);
  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', reject);
    fileStream.on('finish', resolve);
  });

  console.log(chalk.cyan('Download complete. Extracting...'));

  await fs.createReadStream(zipPath)
    .pipe(unZipper.Extract({path: '.'}))
    .promise();

  const wordpressDir = path.join('.', 'wordpress');
  if (fs.existsSync(wordpressDir)) {
    const files = fs.readdirSync(wordpressDir);
    for (const file of files) {
      fs.renameSync(
        path.join(wordpressDir, file),
        path.join('.', file),
      );
    }
    fs.rmSync(wordpressDir, {recursive: true, force: true});
  }

  fs.unlinkSync(zipPath);

  // Удаление отдельных файлов и папок
  const toDelete = [
    'wp-config-sample.php',
    'wp-content/plugins/hello.php',
    'wp-content/plugins/akismet',
    'wp-content/themes/twentytwentythree',
    'wp-content/themes/twentytwentyfour',
  ];

  for (const target of toDelete) {
    const fullPath = path.resolve(target);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        fs.rmSync(fullPath, {recursive: true, force: true});
      } else {
        fs.unlinkSync(fullPath);
      }
    }
  }

  console.log(chalk.green('WordPress extracted successfully!'));
};
