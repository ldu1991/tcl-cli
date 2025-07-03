import fs from 'fs';
import path from 'path';
import chalk from "chalk";

export const createDbBackupFolder = () => {
  console.log(chalk.green(`Create db-backup folder`));

  const folderDbBackup = path.resolve('db-backup');
  const indexPath      = path.join(folderDbBackup, 'index.php');

  if (!fs.existsSync(folderDbBackup)) {
    fs.mkdirSync(folderDbBackup, {recursive: true});
  }

  const index = `<?php

// Do not allow directly accessing this file.
if (!defined('ABSPATH')) {
  exit('Direct script access denied.');
}`;

  fs.writeFileSync(indexPath, index);
};
