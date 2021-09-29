const { merge } = require("webpack-merge");
// 构建速度分析
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
// react hmr
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { resolveApp } = require("./paths");
const common = require("./webpack.common");

// 开启 react hmr 失效
// 可在分析构建速度时开启
const isNeedSpeed = false;

const config = merge(common, {
  // 开发模式
  mode: "development",
  // 开发工具，开启 source map，编译调试
  devtool: "eval-cheap-module-source-map",
  devServer: {
    static: {
      directory: resolveApp("dist"),
    },
    compress: true, // gzip
    port: 5000, // 端口
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ],
});

module.exports = isNeedSpeed ? smp.wrap(config) : config;
