import fs from 'fs';
import path from 'path';
import chalk from "chalk";

export const createProjectInfo = (login, password, email, projectName) => {
  console.log(chalk.green(`Create project info`));

  const name                  = projectName.toLowerCase().replace(/[^a-z0-9]/gi, '_');
  const folderProjectInfoPath = path.resolve('project-info');
  const projectInfoPath       = path.join(folderProjectInfoPath, 'project.nfo');
  const indexPath             = path.join(folderProjectInfoPath, 'index.php');

  if (!fs.existsSync(folderProjectInfoPath)) {
    fs.mkdirSync(folderProjectInfoPath, {recursive: true});
  }

  // Adding project.nfo
  const info = `# login:
${login}
# password:
${password}
# email:
${email}

# password protected:
${name}#${new Date().getFullYear()}`;
  fs.writeFileSync(projectInfoPath, info, { encoding: 'utf8' });

  // Adding index.php
  const index = `<?php

// Do not allow directly accessing this file.
if (!defined('ABSPATH')) {
  exit('Direct script access denied.');
}`;
  fs.writeFileSync(indexPath, index);
}
