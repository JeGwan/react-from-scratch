// npx webpack --config ./test/webpack/splitChunksPlugin.js

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    a: path.resolve(__dirname, "../src/a.js"),
    b: path.resolve(__dirname, "../src/b.js"),
    c: path.resolve(__dirname, "../src/c.js"),
  },
  output: {
    clean: true,
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: "single",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
    }),
  ],
};
