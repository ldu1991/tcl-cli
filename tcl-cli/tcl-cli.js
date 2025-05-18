#!/usr/bin/env node

// Открой командную строку (PowerShell или cmd) и перейди в папку с проектом, затем выполни: npm link
// Запусти CLI: npx tcl
// Если нужно удалить привязку: npm unlink -g

import chalk from 'chalk';
import boxen from 'boxen';

import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';

import {getQuestions} from './questions.js';
import {downloadAndExtractWordPress} from './download-wordpress.js';
import {downloadTheCookieLabs} from './download-thecookielabs.js';
import {createWpConfig} from './create-wp-config.js';


const runCLI = async () => {
  const welcomeMessage = chalk.green('Welcome to TCL project generator!');
  console.log(boxen(welcomeMessage, {
    padding:        1,
    margin:         1,
    borderStyle:    'double',
    borderColor:    'cyan',
    align:          'center',
    title:          'TCL CLI',
    titleAlignment: 'center',
  }));

  const currentDir = path.resolve('./');

  const {
          template,
          projectName,
          installDefaultConfig,
          dbName,
          dbUser,
          dbPassword,
          dbHost,
        } = await inquirer.prompt(getQuestions());

  let get_dbName     = installDefaultConfig ? projectName : dbName,
      get_dbUser     = installDefaultConfig ? 'local' : dbUser,
      get_dbPassword = installDefaultConfig ? '' : dbPassword,
      get_dbHost     = installDefaultConfig ? 'localhost' : dbHost;

  console.log(chalk.white.cyanBright('DB config:'));
  console.log(chalk.cyanBright(`DB_NAME:      ${get_dbName}`));
  console.log(chalk.cyanBright(`DB_USER:      ${get_dbUser}`));
  console.log(chalk.cyanBright(`DB_PASSWORD:  ${get_dbPassword ? '*'.repeat(get_dbPassword.length) : '\'\''}`));
  console.log(chalk.cyanBright(`DB_HOST:      ${get_dbHost}`));


  const targetDir = path.resolve(projectName);

  // Создание директории проекта
  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`\n Directory "${projectName}" already exists.`));
    process.exit(1);
  }

  fs.mkdirSync(targetDir);
  process.chdir(targetDir); // переходим в папку проекта


  try {
    await downloadAndExtractWordPress();
    await createWpConfig({
      dbName:     get_dbName,
      dbUser:     get_dbUser,
      dbPassword: get_dbPassword,
      dbHost:     get_dbHost,
      projectName,
    });
    await downloadTheCookieLabs();


    // Можно добавить установку шаблона сюда по выбору
    switch (template) {
      case 'Vue.js + WordPress':
        console.log('Setting up Vue.js + WordPress template...');
        break;
      case 'Flexible Content':
        console.log('Setting up Flexible Content template...');
        break;
      case 'Gutenberg blocks':
        console.log('Setting up Gutenberg blocks template...');
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
