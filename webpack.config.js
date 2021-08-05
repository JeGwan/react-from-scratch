const isProd = process.env.NODE_ENV === "production";
const useStyleLoader = process.env.USE_STYLE_LOADER === "true";
const chalk = require("chalk");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleInjectionLoader = useStyleLoader
  ? { loader: "style-loader", options: { injectType: "linkTag" } }
  : {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: "/static/css/",
      },
    };
const cssPlugin = useStyleLoader
  ? false
  : new MiniCssExtractPlugin({
      filename: !isProd ? "[name].css" : "[name].[contenthash].css",
      chunkFilename: !isProd ? "[id].css" : "[id].[contenthash].css",
    });
const customProgressPlugin = new webpack.ProgressPlugin({
  handler: (percentage, message, ...args) => {
    return;
    const msg = `🧑‍🎨 ${chalk.green("JEGWAN's")} ${chalk.yellow(
      "Webpack build progress in"
    )} ${chalk.greenBright((percentage * 100).toFixed(1) + "%")} : ${message}`;
    console.clear();
    console.info(msg, ...args);
  },
  entries: true,
  modules: true,
  profile: true,
});
const path = require("path");
module.exports = {
  mode: isProd ? "production" : "development",
  devtool: isProd ? undefined : "eval-cheap-module-source-map",
  entry: "./src/index.js",
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [StyleInjectionLoader, "css-loader", "sass-loader"],
      },
    ],
  },
  output: {
    clean: true,
    filename: (pathData) => {
      console.log(pathData);
      return pathData.chunk.name === "main"
        ? "static/js/index.js"
        : "static/js/[contenthash].js";
    },
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  devServer: {
    port: 3000,
    contentBase: [
      path.resolve(__dirname, "public/images"),
      path.resolve(__dirname, "public/assets"),
    ],
    contentBasePublicPath: ["/images", "/assets"],
    hot: true,
  },
  plugins: [
    cssPlugin,
    !isProd && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    customProgressPlugin,
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
