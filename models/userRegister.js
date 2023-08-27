const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  birthday: {
    type: Date,
    require: true,
    trim: true,
  },
  phone: {
    type: Number,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: [true, "email is already present"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid email");
      }
    },
  },
  password: {
    type: String,
    require: true,
  },
  confirmPassword: {
    type: String,
    require: true,
  },
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
});
//generate token start
userSchema.methods.generateAutoToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.HUDAI_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (e) {
    res.send("the error part" + e);
  }
};
//generate token end

//hshing start here
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
  }
  next();
});
//hashing end here
const Register = new mongoose.model("Register", userSchema);
module.exports = Register;
