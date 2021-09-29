const { merge } = require("webpack-merge");
const glob = require("glob");

// 打包体积分析
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// CSS 提取到单独的文件中
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// CSS tree Shaking
const PurgeCSSPlugin = require("purgecss-webpack-plugin");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

const common = require("./webpack.common");
const paths = require("./paths");

module.exports = merge(common, {
  // 生产模式
  mode: "production",
  plugins: [
    // 打包体积分析
    // new BundleAnalyzerPlugin({
    // }),
    // 提取 CSS
    new MiniCssExtractPlugin({
      filename: "css/bundle.[hash].[name].css",
    }),
    // CSS Tree Shaking
    new PurgeCSSPlugin({
      paths: glob.sync(`${paths.appSrc}/**/*`, { nodir: true }),
    }),
  ],
  optimization: {
    // 为运行时代码创建一个额外的 chunk，减少 entry chunk 体积，提高性能。
    runtimeChunk: true,
    // 公共包 splitChunks 的 hash 不因为新的依赖而改变，减少非必要的 hash 变动
    moduleIds: "deterministic",
    minimizer: [
      new ESBuildMinifyPlugin({
        target: "es2015", // Syntax to compile to (see options below for possible values)
        css: true,
      }),
    ],
    splitChunks: {
      // include all types of chunks
      chunks: "all",
      // 重复打包问题
      cacheGroups: {
        vendors: {
          // node_modules里的代码
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          // name: 'vendors', 一定不要定义固定的name
          priority: 10, // 优先级
          enforce: true,
        },
      },
    },
  },
});
