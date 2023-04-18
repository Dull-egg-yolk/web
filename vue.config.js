const path = require('path');
const fs = require('fs');
const util = require('util');
const InsetScriptPlugin = require('./script/InsertScriptPlugin.js');

const event = process.env.npm_lifecycle_event;

function resolvePath (...filePath) {
  return path.join(__dirname, ...filePath);
}

/**
 * 根据当前执行的命令获取环境变量
 * @param {String} event 当前执行的命令，如 build-tumile:uat
 * @returns Object
 */
const getConfig = (event) => {
  const command = event.split(':');
  const modes = command[0].split('-');
  const mode = modes[0];
  const app = modes[1] || '';
  let env = command[1] || '';
  const modeMap = {
    serve: 'uat',
    build: 'prod'
  };

  if (env === '') {
    env = modeMap[mode] || 'uat';
  }

  return { mode, app, env };
};

const { app, env } = getConfig(event);

const baseConfigPath = resolvePath('env', app, 'base.config.js');
const appConfigPath = resolvePath('env', app, env + '.config.js');

const baseConfig = require(baseConfigPath);
const appConfig = require(appConfigPath);

const currConfig = Object.assign({}, baseConfig, appConfig);

/**
 * 将 firebase 配置更新到 firebase-messaging-sw.js 中
 * @param {object} currConfig 当前 firebase 的配置
 */
function setFireBaseConfig (currConfig) {
  const swPathTpl = resolvePath('public', 'firebase-messaging-sw-tpl.js');
  const swPath = resolvePath('public', 'firebase-messaging-sw.js');
  const content = fs.readFileSync(swPathTpl, { encoding: 'utf8' });
  const config = util.inspect(currConfig.firebaseConfig, { compact: false, depth: 2, breakLength: 80 });
  const code = content.replace(/\{config\}/, config);
  fs.writeFileSync(swPath, code);
}
setFireBaseConfig(currConfig);

module.exports = {
  publicPath: '/', // 公共路径
  configureWebpack: {
    plugins: [new InsetScriptPlugin()],
  },
  chainWebpack: config => {
    config.plugin('html').tap((options) => {
      options[0].config = currConfig;
      // more options: https://github.com/jantimon/html-webpack-plugin#minification
      return options;
    });
    if (currConfig.env === 'prod') {
    // if (currConfig.env === 'abc') {
      config.optimization
        .minimizer('terser')
        .tap(args => {
          Object.assign(args[0].terserOptions.compress, { // 生产模式 console.log 去除
            // warnings: false , // 默认 false
            // drop_console:  ,
            // drop_debugger: true, // 默认也是true
            pure_funcs: ['console.log']
          });
          return args;
        });
    }

  //   config
  //     .plugin('webpack-bundle-analyzer')
  //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
  productionSourceMap: false,
  devServer: {
    https: false,
  }
};
