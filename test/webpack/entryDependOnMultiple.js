// npx webpack --config ./test/webpack/entrySplitDependOnMultiple.js

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    a: {
      import: path.resolve(__dirname, "../src/a.js"),
      dependOn: ["dayjs", "lodash"],
    },
    b: {
      import: path.resolve(__dirname, "../src/b.js"),
      dependOn: ["dayjs", "lodash"],
    },
    lodash: "lodash",
    dayjs: "dayjs",
  },
  output: {
    clean: true,
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  plugins: [new HtmlWebpackPlugin()],
};
