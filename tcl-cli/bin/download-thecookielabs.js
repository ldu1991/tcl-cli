import fetch from 'node-fetch';
import unzipper from 'unzipper';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const downloadTheCookieLabs = async () => {
  const themeBaseUrl = 'https://tcl-theme.cookiefy.com/wp-content/themes';
  const styleUrl     = `${themeBaseUrl}/thecookielabs/style.css`;

  const response = await fetch(styleUrl);
  if (!response.ok) throw new Error('Failed to fetch style.css');

  const cssText = await response.text();

  const match = cssText.match(/[\n\r].*Version:\s*([^\n\r]*)/);
  if (!match || !match[1]) throw new Error('Version not found in style.css');

  const version = match[1].trim();
  const zipUrl  = `${themeBaseUrl}/thecookielabs-${version}.zip`;

  console.log(chalk.cyan('Downloading TheCookieLabs theme zip...'));

  const zipResponse = await fetch(zipUrl);
  if (!zipResponse.ok) throw new Error('Failed to download theme zip');

  const zipPath = path.resolve('theme.zip');
  const zipFile = fs.createWriteStream(zipPath);

  await new Promise((resolve, reject) => {
    zipResponse.body.pipe(zipFile);
    zipResponse.body.on('error', reject);
    zipFile.on('finish', resolve);
  });

  const themePath = path.resolve('wp-content/themes/thecookielabs');

  // Создаём папку, если не существует
  fs.mkdirSync(themePath, {recursive: true});

  console.log(chalk.cyan('Extracting theme...'));
  await fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({path: themePath}))
    .promise();

  fs.unlinkSync(zipPath);

  console.log(chalk.green('TheCookieLabs Theme installed successfully!'));
};
