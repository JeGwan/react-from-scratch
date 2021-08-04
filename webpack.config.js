const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const isProd = process.env.NODE_ENV === "production";
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
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    corejs: "3.16.0",
                    targets: "> 0.5%, last 2 versions, Firefox ESR, not dead",
                  },
                ],
                "@babel/preset-react",
              ],
              plugins: [
                !isProd && require.resolve("react-refresh/babel"),
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  output: {
    clean: true,
    filename: (pathData) => {
      return pathData.chunk.name === "main"
        ? "bundles/index.js"
        : "bundles/chunks/[contenthash].js";
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
    !isProd && new webpack.HotModuleReplacementPlugin(),
    !isProd && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
