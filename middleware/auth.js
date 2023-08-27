const jwt = require("jsonwebtoken");
const Register = require("../models/userRegister");
require("dotenv").config();
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.HUDAI_KEY);
    const user = await Register.findOne({ _id: verifyUser._id });

    req.token = token;
    req.user = user;
    module.exports = user;
    next();
  } catch (e) {
    res.status(401).send(e);
  }
};
module.exports = auth;
