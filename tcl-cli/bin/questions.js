import {generatePassword} from "./generate-password.js";

export const getQuestions = () => [
  {
    type:    'list',
    name:    'template',
    message: 'Which template would you like to use?',
    choices: [
      'Vue.js + WordPress',
      'Flexible Content',
      'Gutenberg blocks',
    ],
  },
  {
    type:     'input',
    name:     'projectName',
    message:  'Enter project name:',
    validate: input => input.trim() ? true : 'Project name is required.'
  },
  {
    type:    'input',
    name:    'targetDirectory',
    message: 'Enter target directory:',
    default: answers => answers.projectName.toLowerCase().replace(/[^a-z0-9]/gi, '-'),
    //validate: input => input.trim() ? true : 'Target directory is required.'
  },
  {
    type:    'input',
    name:    'dbName',
    message: 'Enter database name:',
    default: answers => answers.projectName.toLowerCase().replace(/[^a-z0-9]/gi, '-')
    //validate: input => input.trim() ? true : 'Database name is required.',
  },
  {
    type:    'input',
    name:    'dbUser',
    message: 'Enter database user:',
    default: 'local'
  },
  {
    type:    'input',
    name:    'dbPass',
    message: 'Enter database password:',
    default: ''
  },
  {
    type:    'input',
    name:    'dbHost',
    message: 'Enter database host:',
    default: 'localhost',
  },
  {
    type:    'input',
    name:    'dbPrefix',
    message: 'Enter database prefix:',
    default: 'wp_',
  },
  {
    type:    'input',
    name:    'siteUrl',
    message: `Enter site URL:`,
    default: answers => `http://${answers.targetDirectory}`,
  },
  {
    type:    'input',
    name:    'siteTitle',
    message: 'Enter site title:',
    default: answers => answers.projectName,
    //validate: input => input.trim() ? true : 'Site title is required.',
  },
  {
    type:    'input',
    name:    'adminUser',
    message: 'Enter admin user:',
    default: answers => `tcl_${answers.projectName.toLowerCase().replace(/[^a-z0-9]/gi, '_')}_admin`,
    //validate: input => input.trim() ? true : 'Admin user is required.',
  },
  {
    type:    'input',
    name:    'adminPass',
    message: 'Enter admin password:',
    default: generatePassword()
    //validate: input => input.trim() ? true : 'Admin password is required.',
  },
  {
    type:     'input',
    name:     'adminEmail',
    message:  'Enter admin email:',
    default:  'wpadmin@thecookielabs.com',
    validate: input => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (input.trim() === '') {
        return 'Admin email is required.';
      }
      if (!emailRegex.test(input)) {
        return 'Please enter a valid email address.';
      }
      return true;
    }
  }
];

