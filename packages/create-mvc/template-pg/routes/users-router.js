const usersRouter = require("express").Router();
const {
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
} = require("../controllers/users-controller.js");

usersRouter.get("/", getUsers);
usersRouter.get("/:id", getUserById);
usersRouter.get("/username/:username", getUserByUsername);
usersRouter.get("/email/:email", getUserByEmail);

module.exports = usersRouter;
