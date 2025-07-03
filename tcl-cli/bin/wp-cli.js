import {exec} from 'child_process';
import {promisify} from 'util';
import fs from 'fs';
import https from 'https';
import path from 'path';
import chalk from "chalk";
import {downloadTheCookieLabs} from "./download-thecookielabs.js";
import {createStartTheme} from "./create-start-theme.js";
import {unpackingPlugins} from "./unpacking-plugins.js";
import {createDbBackupFolder} from "./create-db-backup-folder.js";

const execAsync = promisify(exec);

export const installWordPress = async (options) => {
  const {
          installPath = '.',
          projectName,
          dbName,
          dbUser,
          dbPass,
          dbHost,
          dbPrefix,
          siteUrl,
          siteTitle,
          adminUser,
          adminPass,
          adminEmail,
          pluginsToActivate = [
            'acf-image-aspect-ratio-crop',
            'advanced-custom-fields-pro',
            'safe-svg',
            'uipress'
          ]
        } = options;

  if (!fs.existsSync(installPath)) {
    fs.mkdirSync(installPath, {recursive: true});
    console.log(`Directory created: ${installPath}`);
  }

  const extractPath = path.resolve(installPath);

  const wpCliPath = path.join(extractPath, 'wp-cli.phar');

  // Download wp-cli.phar if it doesn't exist
  if (!fs.existsSync(wpCliPath)) {
    console.log(chalk.green(`Downloading wp-cli.phar`));
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(wpCliPath);
      https.get(
        'https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar',
        (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }
      ).on('error', (err) => {
        if (fs.existsSync(wpCliPath)) {
          fs.unlinkSync(wpCliPath);
        }
        reject(err);
      });
    });
    try {
      fs.chmodSync(wpCliPath, 0o755);
    } catch (chmodErr) {
      console.log(chalk.red(`Failed to set permissions on wp-cli.phar: ${chmodErr}`));
    }
  } else {
    console.log(chalk.red(`wp-cli.phar already exists in the directory: ${wpCliPath}`));
  }

  // Helper to run WP CLI commands
  const runWpCli = async (args, cwd) => {
    const php        = 'php';
    const quotedArgs = args
      .split(' ')
      .map((arg) => (arg.includes(' ') ? `"${arg}"` : arg))
      .join(' ');
    const cmd        = `${php} "${wpCliPath}" ${quotedArgs}`;
    console.log(chalk.cyan('Running:'), cmd);

    const {stdout, stderr} = await execAsync(cmd, {
      cwd,
      shell: true,
      env:   {...process.env}
    });

    if (stderr) console.error(stderr);
    console.log(stdout);
  };

  await runWpCli('core download', extractPath);

  let configCommand = `config create --dbname=${dbName} --dbuser=${dbUser} --dbhost=${dbHost} --dbprefix=${dbPrefix}`;
  if (dbPass) {
    configCommand += ` --dbpass=${dbPass}`;
  }
  await runWpCli(configCommand, extractPath);

  await runWpCli(
    `core install --url=${siteUrl} --title="${siteTitle}" --admin_user=${adminUser} --admin_password=${adminPass} --admin_email=${adminEmail}`,
    extractPath
  );

  await runWpCli('plugin deactivate akismet hello', extractPath);
  await runWpCli('plugin delete akismet hello', extractPath);
  await unpackingPlugins()
  await runWpCli(`plugin activate ${pluginsToActivate.join(' ')}`, extractPath);


  await createStartTheme(projectName);
  await downloadTheCookieLabs();
  await createDbBackupFolder()

  const themeName = projectName.toLowerCase().replace(/[^a-z0-9]/gi, '-');
  await runWpCli(`theme activate ${themeName}`);

  await runWpCli('theme delete twentytwentyfour twentyseventeen twentynineteen twentytwenty twentytwentyone twentytwentytwo twentytwentythree', extractPath);

  console.log(chalk.green("WordPress installation complete."));

  try {
    if (fs.existsSync(wpCliPath)) {
      fs.unlinkSync(wpCliPath);
      console.log('Deleted wp-cli.phar from', wpCliPath);
    }
  } catch (unlinkErr) {
    console.warn('Failed to remove wp-cli.phar:', unlinkErr);
  }
};

