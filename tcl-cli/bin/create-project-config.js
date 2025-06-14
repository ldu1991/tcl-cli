import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const createProjectConfig = (siteUrl, projectName) => {
  const configPath  = path.resolve('dev-wp/project-config.json');
  const name = projectName.toLowerCase().replace(/[^a-z0-9]/gi, '-');

  const configContent = `{
  "themeName": "${projectName}",
  "proxy": "${siteUrl.replace(/^https?:\/\/(www\.)?/, '')}",
  "themePath": "../wp-content/themes/${name}"
}`;

  fs.writeFileSync(configPath, configContent);
  console.log(chalk.green(`project-config.json generated successfully!`));
};
