import fs from 'fs';
import path from 'path';

export const removeTrashFiles = async (targetDir = '.') => {
  const extractPath = path.resolve(targetDir);

  const toDelete = [
    'wp-config-sample.php'
  ];

  for (const target of toDelete) {
    const fullPath = path.join(extractPath, target);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        fs.rmSync(fullPath, {recursive: true, force: true});
      } else {
        fs.unlinkSync(fullPath);
      }
    }
  }
};
