const express = require("express");
const UserModel = require("../schema/user");
const { jsonResponse } = require("../lib/jsonResponse");
const getUserInfo = require("../lib/getUserInfo");

const router = express.Router();

router.post("/", async function (req, res) {
  const { email: email, password: password } = req.body;
  //console.log(email);
  try {
    let user = new UserModel();
    //Existe usuario
    const userExists = await user.usernameExists(email);
    if (userExists) {
      user = await UserModel.findOne({ email: email });
      //console.log('user')
      //Verficar contraseña
      const passwordCorrect = await user.isCorrectPassword(
        password,
        user.password
      );
      //console.log('password')
      if (passwordCorrect) {
        const accessToken = user.createAccessToken();
        const refreshToken = await user.createRefreshToken();

        //console.log('todo ok')
        return res.json(
          jsonResponse(200, {
            accessToken,
            refreshToken,
            user: getUserInfo(user),
          })
        );
      } else {
        return res.status(401).json(
          jsonResponse(401, {
            error: "Email y/o clave incorrecta",
          })
        );
      }
    } else {
      return res.status(401).json(
        jsonResponse(401, {
          error: "Email no existe",
        })
      );
    }
  } catch (err) {
    //console.error('no');
    console.error(err);
  }
});

module.exports = router;
