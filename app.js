require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const port = process.env.PORT || 3000;
const Register = require("./models/userRegister");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieparse = require("cookie-parser");
const auth = require("./middleware/auth");
require("./db/conn");

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

app.use(express.static(staticPath));
app.use(express.json());
app.use(cookieparse());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);

app.get("/", (req, res) => {
  res.render("index");
});

//contact page start
app.get("/contact", auth, (req, res) => {
  res.render("contact");
});
//contact page end

//logout page start
app.get("/logout", auth, async (req, res) => {
  try {
    // req.user.tokens = req.user.tokens.filter((cuurentElem) => {
    //   return cuurentElem.token !== req.token;
    // });
    req.user.tokens = [];
    res.clearCookie("jwt");
    await req.user.save();
    res.render("index");
  } catch (e) {
    res.status(500).send(e);
  }
});
//logout page end

//Register  page start
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password === confirmPassword) {
      const userRegister = new Register({
        name: req.body.name,
        gender: req.body.gender,
        birthday: req.body.birthday,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      });
      const token = await userRegister.generateAutoToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 60000),
        httpOnly: true,
      });
      const registered = await userRegister.save();
      res.render("index");
    } else {
      res.send("password are not matching");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});
//register page end

//Login page start
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, userEmail.password);
    const token = await userEmail.generateAutoToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60000),
      httpOnly: true,
    });
    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.status(400).send("invalid password");
    }
  } catch (e) {
    res.status(400).send("invalid email");
  }
});
//login page end

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
