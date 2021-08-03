const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isProd = process.env.NODE_ENV === "production";

const htmlOption = Object.assign(
  {},
  {
    inject: true,
    template: path.join(__dirname, "public/index.html"),
  },
  isProd
    ? {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }
    : undefined
);

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: { extensions: [".js", ".jsx"] },
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    filename: "[name].bundle.js",
  },
  devServer: {
    port: 3000,
    hot: true,
    contentBase: path.resolve(__dirname, "dist"),
    contentBasePublicPath: "/",
    watchContentBase: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // HMR시 트루?
    new HtmlWebpackPlugin(htmlOption), // 빌드시 html template에 번들 넣어줌
    new webpack.ProgressPlugin(), //  진행율 알려줌
  ],
};
