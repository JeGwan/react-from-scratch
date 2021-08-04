const isProd = process.env.NODE_ENV === "production";
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: "3.16.0",
        targets: isProd
          ? "> 0.5%, last 2 versions, Firefox ESR, not dead"
          : "defaults",
      },
    ],
    ["@babel/preset-react", { development: !isProd, runtime: "automatic" }],
  ],
  ...(!isProd && { plugins: ["react-refresh/babel"] }),
};
