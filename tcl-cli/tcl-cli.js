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

const packageJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')).toString());


import {getQuestions} from './bin/questions.js';
import {unpackingDevWp} from "./bin/unpacking-dev-wp.js";
import {installWordPress} from "./bin/wp-cli.js";
import {createProjectInfo} from "./bin/create-project-info.js";


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

  const {
          template,
          projectName,
          targetDirectory,
          dbName,
          dbUser,
          dbPass,
          dbHost,
          dbPrefix,
          siteUrl,
          siteTitle,
          adminUser,
          adminPass,
          adminEmail
        } = await inquirer.prompt(getQuestions());

  const targetDir = path.resolve(targetDirectory);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, {recursive: true});
    console.log(chalk.green(`\nDirectory "${targetDir}" created.`));
  } else {
    console.log(chalk.yellow(`\nDirectory "${targetDir}" already exists. Continuing...`));
  }

  process.chdir(targetDir);


  try {
    await createProjectInfo(adminUser, adminPass, adminEmail, projectName)

    await installWordPress({
      installPath: template === 'Vue.js + WordPress' ? './backend' : '.',
      projectName: projectName,
      dbName:      dbName,
      dbUser:      dbUser,
      dbPass:      dbPass,
      dbHost:      dbHost,
      dbPrefix:    dbPrefix,
      siteUrl:     siteUrl,
      siteTitle:   siteTitle,
      adminUser:   adminUser,
      adminPass:   adminPass,
      adminEmail:  adminEmail
    })

    switch (template) {
      case 'Vue.js + WordPress':
        //////////

        break;
      case 'Flexible Content':
        await unpackingDevWp('flexible', siteUrl, projectName);
        break;
      case 'Gutenberg blocks':
        await unpackingDevWp('gutenberg', siteUrl, projectName);
        break;
    }

    console.log(boxen(chalk.green('Setup complete!'), {
      padding:     1,
      margin:      1,
      borderStyle: 'double',
      borderColor: 'green',
      align:       'center',
    }));
  } catch (error) {
    console.error('Installation failed:', error.message);
  }
};

runCLI();
