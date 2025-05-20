import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import {randomBytes} from 'crypto';

const generateSecretKey = () => randomBytes(48).toString('base64');

export const createWpConfig = ({dbName, dbUser, dbPassword, dbHost, projectName, targetDir = '.'}) => {
  const extractPath = path.resolve(targetDir);
  const configPath  = path.join(extractPath, 'wp-config.php');
  const tablePrefix = projectName.toLowerCase().replace(/[^a-z0-9]/gi, '_') + '_';

  const configContent = `<?php
define( 'DB_NAME',      '${dbName}' );
define( 'DB_USER',      '${dbUser}' );
define( 'DB_PASSWORD',  '${dbPassword}' );
define( 'DB_HOST',      '${dbHost}' );
define( 'DB_CHARSET',   'utf8' );
define( 'DB_COLLATE',   '' );

define( 'AUTH_KEY',         '${generateSecretKey()}' );
define( 'SECURE_AUTH_KEY',  '${generateSecretKey()}' );
define( 'LOGGED_IN_KEY',    '${generateSecretKey()}' );
define( 'NONCE_KEY',        '${generateSecretKey()}' );
define( 'AUTH_SALT',        '${generateSecretKey()}' );
define( 'SECURE_AUTH_SALT', '${generateSecretKey()}' );
define( 'LOGGED_IN_SALT',   '${generateSecretKey()}' );
define( 'NONCE_SALT',       '${generateSecretKey()}' );

$table_prefix = '${tablePrefix}';

if (isset($_GET['debug'])) {
    define('WP_DEBUG', true);
} else {
    define('WP_DEBUG', false);
}

if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}
require_once ABSPATH . 'wp-settings.php';
`;

  fs.writeFileSync(configPath, configContent);
  console.log(chalk.green(`wp-config.php generated successfully!`));
};
