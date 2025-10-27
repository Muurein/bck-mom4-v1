//initierar
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 1500;

app.use(bodyParser.json());

app.use(cors({
    origin: "http://localhost:1234",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

//router
app.use("/api", authRoutes);


//skyddad route
app.get("/api/profile", authenticateToken, (req, res) => {

    res.json(req.user);
});

//validera jwt-token
function authenticateToken(req, res, next) {
    const header = req.headers["authorization"];
    const jwtToken = header && header.split(" ")[1];
    console.log("JWT-token:", jwtToken);

    if (!jwtToken) {
        return res.status(401).json({ message: "Du har inte tillgång till den här routen - token saknas" });
    }

    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, user) => { //inte err, username?
        if (err) {
            console.log("JWT-verifieringsfel:", err);
            return res.status(403).json({ message: "Fel JWT"});
        }

        req.user = user; //inte useranme??
        next();
    });
}

//startar app
app.listen(port, () => {
    console.log(`Servern är igång på http://localhost:${port}`);
});