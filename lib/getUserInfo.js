function getUserInfo(user) {
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    rol: user.rol,
  };
}

module.exports = getUserInfo;
