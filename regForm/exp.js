const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static(__dirname));

mongoose.connect("mongodb://localhost:27017/registrationdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    firstName: req.body.fname,
    lastName: req.body.lname,
    email: req.body.email,
    password: req.body.password,
  });

  newUser
    .save()
    .then(() => res.redirect("/"))
    .catch((err) =>
      res.status(400).send("Unable to save user to the database.")
    );
});

app.listen(3000, () => console.log("Server started on port 3000"));
