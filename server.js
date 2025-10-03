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

//skyddad route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ message: "Skyddad route" });
});

//validera jwt-token
function authenticateToken(req, res, next) {
    const header = req.headers["authorization"];
    const jwtToken = header && header.split(" ")[1];

    if (jwtToken == null) res.status(401).json({ message: "Du har inte tillgång till den här routen - token saknas" });

    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) return res.status(403).json({ mesage: "Fel JWT"});

        req.username = username;
        next();
    });
}

//startar app
app.listen(port, () => {
    console.log(`Servern är igång på http://localhost:${port}`);
});