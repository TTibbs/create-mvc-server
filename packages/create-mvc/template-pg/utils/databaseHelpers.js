const sanitizeUser = (user) => {
  if (!user) return user;

  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

// Helper function to sanitize an array of users
const sanitizeUsers = (users) => {
  return users.map((user) => sanitizeUser(user));
};

module.exports = {
  sanitizeUser,
  sanitizeUsers,
};
