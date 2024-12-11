const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("./config/database");
const articleRoutes = require("./routes/articleRoutes");
const userRoutes = require("./routes/userRoutes");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');
/*app.use(bodyParser.urlencoded({ 
    extended: true 
}));
*/
//app.use(bodyParser.json());
//app.use(express.static("public"));
app.use(express.json());

app.use("/articles", articleRoutes);
app.use("/users", userRoutes);

module.exports = app;
