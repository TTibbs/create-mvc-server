const {
  selectUsers,
  selectUserById,
  selectUserByUsername,
  selectUserByEmail,
} = require("../models/users-models.js");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users, total_users: users.length });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserById = (req, res, next) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send({ msg: "Invalid user ID" });
    return;
  }

  selectUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ msg: "User not found" });
      } else {
        res.status(200).send({ user });
      }
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
        res.status(404).send({ msg: "User not found" });
      } else {
        res.status(200).send({ user });
      }
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
        res.status(404).send({ msg: "User not found" });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch((err) => {
      next(err);
    });
};
