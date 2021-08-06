// npx webpack --config ./test/webpack/entrySplit.js

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    a: path.resolve(__dirname, "../src/a.js"),
    b: path.resolve(__dirname, "../src/b.js"),
  },
  output: {
    clean: true,
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  plugins: [new HtmlWebpackPlugin()],
};
