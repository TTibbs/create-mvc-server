const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api-router.js");
const app = express();
const {
  inputErrorHandler,
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors/index.js");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to the API!" });
});

app.use("/api", apiRouter);
app.use("/api/*", inputErrorHandler);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
