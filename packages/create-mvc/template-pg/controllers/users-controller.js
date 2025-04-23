const {
  selectUsers,
  selectUserById,
  selectUserByUsername,
  selectUserByEmail,
} = require("../models/users-models.js");
const { sanitizeUsers, sanitizeUser } = require("../utils/databaseHelpers.js");

exports.getUsers = async (req, res, next) => {
  try {
    const { users, total_users } = await selectUsers();
    if (users.length === 0) {
      return res.status(404).send({ msg: "No users found" });
    }
    const sanitizedUsers = sanitizeUsers(users);
    res.status(200).send({ users: sanitizedUsers, total_users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  selectUserById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ msg: "User not found" });
      }
      const sanitizedUser = sanitizeUser(user);
      res.status(200).send({ user: sanitizedUser });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ msg: "User not found" });
      }
      const sanitizedUser = sanitizeUser(user);
      res.status(200).send({ user: sanitizedUser });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByEmail = (req, res, next) => {
  const { email } = req.params;
  selectUserByEmail(email)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ msg: "User not found" });
      }
      const sanitizedUser = sanitizeUser(user);
      res.status(200).send({ user: sanitizedUser });
    })
    .catch((err) => {
      next(err);
    });
};
