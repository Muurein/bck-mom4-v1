//initierar
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
router.use(express.json());

//kopplar till databasen
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Kopplad till databasen på MongoDB");
}).catch((error) => {
    console.log("Det uppstod ett fel vid uppkoppling till databasen: " + error);
});


//user-modell
const User = require("../models/User");


//lägg till en ny användare
router.post("/register", async (req, res) => {
    console.log("Mottagen data: ", req.body)
    try {
        //information om användaren som ska lagras
        const { username, password, firstName, lastName, email } = req.body;

        //validera input - om något fält är tomt
        if (!username || !password || !firstName || !lastName || !email) {
            return res.status(400).json({ error: "Se till att alla fält är ifyllda" });
        }

        //validera input - om lösenordet är för kort
        if (password.length < 10) {
            return res.status(400).json({ error: "Lösenordet behöver vara minst 10 tecken långt" });
        }

        //validera input - finns användarnamnet redan?
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Användarnamnet är upptaget" });
        }

        //om allt stämmer - spara användaren
        const user = new User({ username, password, firstName, lastName, email });

        await user.save();
        res.status(201).json({ message: "Användare skapad" });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


//logga in användare
router.post("/signin", async (req, res) => {

    try {
        //information om användaren som ska användas vid inloggning
        const { username, password } = req.body;

        //validera input - om något fält är tomt 
        if (!username || !password) {
            return res.status(400).json({ error: "Fyll i alla fält" });
        }

        
        //validerar användaren
        const user = await User.findOne({ username });

        if (!user) {
            //specificerar inte vad som är fel pga säkerhet
            return res.status(401).json({ error: "Fel användarenamn eller lösenord" });
        }

        
        //validerar lösenord
        const passwordMatch = await user.comparePassword(password);

        if (!passwordMatch) {
            //specificerar inte vad som är fel pga säkerhet
            return res.status(401).json({ error: "Fel användarnamn eller lösenord"});
        } else {
            //skapa JWT - Json Web Token
            const payload = { 
                username: user.username, 
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }; //const payload = { username, password };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "2h" });
            console.log("token:", token);

            const response = {
                message: `${username} är inloggad`,
                token: token
            };
            
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;