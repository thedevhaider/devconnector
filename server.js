const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");
const passport = require("passport");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();

//Adding middlerware to express app
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//Config Keys
const db = require("./config/keys").mongoURI;

//Connect to MongoDB using Mongoose
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err, "Error"));

//Adding passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

// Routes APIs
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Server static assets if in Production
if (process.env.NODE_ENV === 'production') {
  console.log("Helloo");
  app.use(express.static('client/build'));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Running server on Port ${PORT}`));