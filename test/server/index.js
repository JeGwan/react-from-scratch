const express = require("express");
const chalk = require("chalk");
const app = express();
const path = require("path");
const PORT = 4000;

app.use("/", express.static(path.resolve(__dirname, "../dist")));

app.listen(PORT, () =>
  console.log(
    `🤚 ${chalk.cyan("Server is running at")} ${chalk.blueBright(
      `http://localhost:${PORT}`
    )}`
  )
);
