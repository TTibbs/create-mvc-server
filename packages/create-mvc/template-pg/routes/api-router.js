const apiRouter = require("express").Router();
const usersRouter = require("./users-router.js");
const endpoints = require("../endpoints.json");

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
