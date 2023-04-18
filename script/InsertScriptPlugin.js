/**
 * htmlWebpackPlugin 的附属插件。
 * 在 index.html 中插入自定义代码
 */
const gitInfo = require('./gitInfo');

class InsetScriptPlugin {
  apply (compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin(
        'html-webpack-plugin-before-html-processing',
        (data, cb) => {
          const config = JSON.stringify(gitInfo);
          const code = `
              <script>window.buildVersion = ${config}</script></html>
          `;
          const html = data.html.replace(
            '</html>', code
          );
          // 返回修改后的结果
          data.html = html;
        //   cb(null, data)
        }
      );
    });
  }
}
module.exports = InsetScriptPlugin;
