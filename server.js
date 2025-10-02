//initierar
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 1500;

app.use(bodyParser.json());


//router
app.use("/api", authRoutes);



//startar app
app.listen(port, () => {
    console.log(`Servern är igång på http://localhost:${port}`);
});