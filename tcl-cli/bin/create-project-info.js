import fs from 'fs';
import path from 'path';

export const createProjectInfo = (login, password, email, projectName) => {
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
// Silence is golden.`;
  fs.writeFileSync(indexPath, index);
}
