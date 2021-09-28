const { merge } = require("webpack-merge");
const { resolveApp } = require("./paths");
const common = require("./webpack.common");

module.exports = merge(common, {
  // 开发模式
  mode: "development",
  // 输出
  output: {
    // bundle 文件名称
    filename: "[name].bundle.js",

    // bundle 文件路径
    path: resolveApp("dist"),

    // 编译前清除目录
    clean: true,
  },
  // 开发工具，开启 source map，编译调试
  devtool: "eval-cheap-module-source-map",
  devServer: {
    static: {
      directory: resolveApp('dist'),
    },
    compress: true,
    port: 9000,
  },
});
