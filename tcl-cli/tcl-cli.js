#!/usr/bin/env node

// Открой командную строку (PowerShell или cmd) и перейди в папку с проектом, затем выполни: npm link
// Запусти CLI: npx tcl
// Если нужно удалить привязку: npm unlink -g

import chalk from 'chalk';
import boxen from 'boxen';

import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Project config
const packageJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')).toString());


import {getQuestions} from './bin/questions.js';
import {downloadAndExtractWordPress} from './bin/download-wordpress.js';
import {downloadTheCookieLabs} from './bin/download-thecookielabs.js';
import {createWpConfig} from './bin/create-wp-config.js';
import {unpackingDevWp} from "./bin/unpacking-dev-wp.js";
import {createProjectConfig} from "./bin/create-project-config.js";
import {createStyleCss} from "./bin/create-style-css.js";


const runCLI = async () => {
  const welcomeMessage = chalk.green('Welcome to TCL project generator!');
  console.log(boxen(welcomeMessage, {
    padding:        1,
    margin:         1,
    borderStyle:    'double',
    borderColor:    'cyan',
    align:          'center',
    title:          `TCL CLI v.${packageJSON.version}`,
    titleAlignment: 'center',
  }));

  //const currentDir = path.resolve('./');

  const {
          template,
          projectName,
          installDefaultConfig,
          dbName,
          dbUser,
          dbPassword,
          dbHost,
        } = await inquirer.prompt(getQuestions());

  let get_dbName     = installDefaultConfig ? projectName.toLowerCase().replace(/[^a-z0-9]/gi, '-') : dbName,
      get_dbUser     = installDefaultConfig ? 'local' : dbUser,
      get_dbPassword = installDefaultConfig ? '' : dbPassword,
      get_dbHost     = installDefaultConfig ? 'localhost' : dbHost;

  console.log(chalk.white.cyanBright('DB config:'));
  console.log(chalk.cyanBright(`DB_NAME:      ${get_dbName}`));
  console.log(chalk.cyanBright(`DB_USER:      ${get_dbUser}`));
  console.log(chalk.cyanBright(`DB_PASSWORD:  ${get_dbPassword ? '*'.repeat(get_dbPassword.length) : '\'\''}`));
  console.log(chalk.cyanBright(`DB_HOST:      ${get_dbHost}`));


  const targetDir = path.resolve(projectName.toLowerCase().replace(/[^a-z0-9]/gi, '-'));

  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`\n Directory "${projectName}" already exists.`));
    process.exit(1);
  }

  fs.mkdirSync(targetDir);
  process.chdir(targetDir);


  try {
    switch (template) {
      case 'Flexible Content':
        await unpackingDevWp('flexible');
        break;
      case 'Gutenberg blocks':
        await unpackingDevWp('gutenberg');
        break;
    }

    switch (template) {
      case 'Vue.js + WordPress':
        await downloadAndExtractWordPress('./backend');
        await createWpConfig({
          dbName:     get_dbName,
          dbUser:     get_dbUser,
          dbPassword: get_dbPassword,
          dbHost:     get_dbHost,
          projectName,
          targetDir: './backend'
        });

        break;
      case 'Flexible Content':
      case 'Gutenberg blocks':
        await createProjectConfig(projectName);
        await createStyleCss(projectName);

        await downloadAndExtractWordPress();
        await createWpConfig({
          dbName:     get_dbName,
          dbUser:     get_dbUser,
          dbPassword: get_dbPassword,
          dbHost:     get_dbHost,
          projectName,
        });
        await downloadTheCookieLabs();
        break;
    }


    console.log(boxen(chalk.white('Setup complete!'), {
      padding: 1,
      margin:  1,
      align:   'center',
    }));
  } catch (error) {
    console.error('Installation failed:', error.message);
  }
};

runCLI();
