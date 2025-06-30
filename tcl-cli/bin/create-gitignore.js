import fs from 'fs';
import path from 'path';
import chalk from "chalk";

export const createGitignore = () => {
  const configPath  = path.resolve('.gitignore');

  const gitignoreContent = `# Ignore in git and always delete on server because of security:
# IDE files
.idea/
.vscode/
*.iws

# OS files
.DS_Store

# Swap and temporary files
*.swp
*~

# Logs
*.log

# WordPress core and plugin files
license.txt
readme.html
theme-release.php

# Backups
db-backup/tcl-backup?

# Node.js
node_modules/
package-lock.json

# WordPress content cache
wp-content/cache/
wp-content/advanced-cache.php
wp-content/uploads/wc-logs/
wp-content/wp-rocket-config/`;

  fs.writeFileSync(configPath, gitignoreContent);
  console.log(chalk.green(`.gitignore generated successfully!`));
};
