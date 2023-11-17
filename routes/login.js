const express = require("express");
const UserModel = require("../schema/user");
const { jsonResponse } = require("../lib/jsonResponse");
const getUserInfo = require("../lib/getUserInfo");

const router = express.Router();

router.post("/", async function (req, res) {
  const { correo: email, clave: password } = req.body;
  try {
    let user = new UserModel();
    //Existe usuario
    const userExists = await user.usernameExists(email);
    if (userExists) {
      user = await UserModel.findOne({ email: email });
      //Verficar contraseña
      const passwordCorrect = await user.isCorrectPassword(
        password,
        user.password
      );

      if (passwordCorrect) {
        return res.json(
          jsonResponse(200, {
            accessToken: "dsd96585dfd54",
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
    console.error(err);
  }
});

module.exports = router;
