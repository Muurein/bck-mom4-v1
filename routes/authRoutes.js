//initierar
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//kopplar till databasen
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Kopplad till databasen på MongoDB");
}).catch((error) => {
    console.log(("Det uppstod ett fel vid uppkoppling till databasen"));
});