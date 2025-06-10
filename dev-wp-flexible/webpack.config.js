import fs from 'fs';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import {globSync} from 'glob';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Project config
const projectConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'project-config.json')).toString());

export default (env, argv) => {
  let entry        = {};
  let minifiedLibs = [];

  globSync('./src/js/*.js').forEach((file) => {
    const filePath                                      = path.relative('src', file);
    entry[path.join(projectConfig.themePath, filePath)] = './' + file;
  });

  globSync('./src/blocks/**/*.js').forEach((file) => {
    if (!file.includes('__example')) {
      const filePath                                      = path.relative('src', file);
      entry[path.join(projectConfig.themePath, filePath)] = './' + file;
    }
  });

  globSync('./src/lib/**/*.js').forEach((file) => {
    if (!file.endsWith('.min.js')) {
      const filePath                                      = path.relative('src', file);
      entry[path.join(projectConfig.themePath, filePath)] = './' + file;
    } else {
      const absolutePath = path.resolve(__dirname, file);
      const relativePath = path.relative(path.resolve(__dirname, 'src'), absolutePath);

      minifiedLibs.push({
        from: absolutePath,
        to:   path.join(projectConfig.themePath, relativePath),
      });
    }
  });

  let config = {
    mode:   argv.mode,
    entry:  entry,
    output: {
      filename: '[name]',
      path:     path.resolve(__dirname, '.'),
    },
    module: {
      rules: [
        {
          test:    /\.js$/,
          exclude: /node_modules/,
          use:     {
            loader:  'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  };

  config.plugins = [];
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: minifiedLibs,
    }),
  );

  if (argv.mode === 'production') {
    config.optimization = {
      minimize:  true,
      minimizer: [
        new TerserPlugin({
          terserOptions:   {
            ecma:   5,
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    };
    config.plugins.push(new CleanWebpackPlugin());
    config.performance = {
      hints: false,
    };
  } else {
    config.watch = true;
    config.cache = {
      type: 'filesystem',
    };
  }

  return config;
}
