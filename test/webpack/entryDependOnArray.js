// npx webpack --config ./test/webpack/entrySplitDependOnArray.js

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    a: {
      import: path.resolve(__dirname, "../src/a.js"),
      dependOn: "my-common-module",
    },
    b: {
      import: path.resolve(__dirname, "../src/b.js"),
      dependOn: "my-common-module",
    },
    "my-common-module": ["lodash", "dayjs"],
  },
  output: {
    clean: true,
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  plugins: [new HtmlWebpackPlugin()],
};
