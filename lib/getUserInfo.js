function getUserInfo(user) {
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
  };
}

module.exports = getUserInfo;
