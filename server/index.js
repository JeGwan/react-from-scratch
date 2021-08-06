const express = require("express");
const chalk = require("chalk");
const app = express();
const PORT = 4000;
app.all("*", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () =>
  console.log(
    `🤚 ${chalk.green("Server is running at")} ${chalk.yellow(
      `http://localhost:${PORT}`
    )}`
  )
);
