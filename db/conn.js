const mongoose = require("mongoose");
mongoose
  .connect("mongodb://0.0.0.0:27017/user", {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("coonect successful");
  })
  .catch((e) => {
    console.log(e);
  });
