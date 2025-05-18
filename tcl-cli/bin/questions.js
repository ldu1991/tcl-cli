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
    message:  'Enter project name (required):',
    validate: input => input.trim() ? true : 'Project name is required.',
  },
  {
    type:    'confirm',
    name:    'installDefaultConfig',
    message: 'Install default WordPress configuration?',
    default: true,
  },
  {
    type:     'input',
    name:     'dbName',
    message:  'Enter database name:',
    when:     answers => !answers.installDefaultConfig,
    validate: input => input.trim() ? true : 'Database name is required.',
  },
  {
    type:     'input',
    name:     'dbUser',
    message:  'Enter database user:',
    when:     answers => !answers.installDefaultConfig,
    validate: input => input.trim() ? true : 'Database user is required.',
  },
  {
    type:    'password',
    name:    'dbPassword',
    message: 'Enter database password:',
    when:    answers => !answers.installDefaultConfig,
    default: '',
    mask:    '*',
  },
  {
    type:    'input',
    name:    'dbHost',
    message: 'Enter database host:',
    when:    answers => !answers.installDefaultConfig,
    default: 'localhost',
  },
];

