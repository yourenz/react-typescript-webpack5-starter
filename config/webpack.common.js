const chalk = require("chalk");
const webpack = require('webpack')
// 生成html，自动引入所有bundle
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 进度条
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

// 多进程运行
// 可以通过预热 worker 池(worker pool)来防止启动 worker 时的高延时。
// 开启后 build 完成需要手动终止进程

// 这会启动池(pool)内最大数量的 worker 并把指定的模块载入 node.js 的模块缓存中。

// const threadLoader = require("thread-loader");
// threadLoader.warmup(
//   {
//     // 池选项，例如传递给 loader 选项
//     // 必须匹配 loader 选项才能启动正确的池
//   },
//   ["sass-loader"]
// );

// CSS 提取到单独的文件中
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const paths = require("./paths");

const env = {
  isEnvDevelopment: process.env.NODE_ENV === "development",
  isEnvProduction: process.env.NODE_ENV === "production",
};

const { isEnvProduction } = env;

module.exports = {
  // 入口
  entry: {
    index: `${paths.appSrc}/index.tsx`,
  },
  // 输出
  output: {
    // 仅在生产环境添加 hash
    filename: isEnvProduction
      ? "js/bundle.[name].[contenthash].bundle.js"
      : "js/bundle.[name].bundle.js",
    path: paths.appDist,
    // 编译前清除目录
    clean: true,
    // 配置CDN
    // publicPath: isEnvProduction ? 'https://xxx.com' : '',
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": paths.appSrc, // @ 代表 src 路径
    },
    modules: ["node_modules", paths.appSrc],
  },
  module: {
    rules: [
      // ts js
      {
        test: /\.(js|ts|jsx|tsx)$/,
        include: paths.appSrc,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
              target: "es2015",
            },
          },
        ],
      },
      // 加载图片
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: paths.appSrc,
        type: "asset/resource",
      },
      // 加载字体
      {
        test: /.(woff|woff2|eot|ttf|otf)$/i,
        include: paths.appSrc,
        type: "asset/resource",
      },
      // scss
      {
        test: /\.(scss|sass)$/,
        include: paths.appSrc,
        use: [
          // 将 JS 字符串生成为 style 节点
          "style-loader",
          isEnvProduction && MiniCssExtractPlugin.loader, // 仅生产环境
          // 将 CSS 转化成 CommonJS 模块
          {
            loader: "css-loader",
            options: {
              // Enable CSS Modules features
              modules: true,
              importLoaders: 2,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
            },
          },
          // 将 PostCSS 编译成 CSS
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // postcss-preset-env 包含 autoprefixer
                    "postcss-preset-env",
                  ],
                ],
              },
            },
          },
          // 独立的 worker 池运行 sass-loader, 小项目无需开启, 会多出600ms开启进程时间
          //   {
          //     loader: "thread-loader",
          //     options: {
          //       workerParallelJobs: 2,
          //     },
          //   },
          // 将 Sass 编译成 CSS
          "sass-loader",
        ].filter(Boolean),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "react-typescript-webpack5-starter",
      template: `${paths.appPublic}/index.ejs`,
    }),
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
    }),
    new webpack.ProvidePlugin({
      React: "react",
    }),
  ],
  // 从输出的 bundle 中排除依赖
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  // 使用文件缓存
  cache: {
    type: "filesystem",
  },
};
