import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const createProjectConfig = (proxy, projectName) => {
  const configPath  = path.resolve('dev-wp/project-config.json');
  const name = projectName.toLowerCase().replace(/[^a-z0-9]/gi, '-');

  const configContent = `{
  "themeName": "${projectName}"
  "proxy": "${name}",
  "themePath": "../wp-content/themes/${name}"
}`;

  fs.writeFileSync(configPath, configContent);
  console.log(chalk.green(`project-config.json generated successfully!`));
};
