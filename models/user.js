const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


//användarschema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 10
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // created_at: {
    //     type: Date,
    //     default: Date.now
    // }
});

//krypterar (hasha) lösenord
userSchema.pre("save", async function(next) {
    try {
        //om lösenordet är nytt eller ändrat
        if(this.isNew || this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(this.password, 10);

            this.password = hashedPassword;
        };

        next();
    } catch (error) {
        next(error);
    } 
});

//lägger till en användare
userSchema.statics.register = async function (username, password) {
    try {
        const user = new this({ username, password });

        //spara användaren
        await user.save();

        return user;
    } catch (error) {
        throw error;
    };
};


//jämför det skrivna lösenordet med det hashade lösenordet
userSchema.methods.comparePassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};


//loggar in användaren
userSchema.statics.login = async function(username, password) {
    try {
        //kollar användarnamnet
        const user = await this.findOne({ username });

        //om användarnamnet är fel
        if(!user) {
            throw new Error("Felaktigt användarnamn eller lösenord");
        }

        const passwordMatch = await user.comparePassword(password);

        //om lösenordet är fel
        if(!passwordMatch) {
            throw new Error("Felaktigt användarnamn eller lösenord");
        }

        return user;
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model("User", userSchema);
module.exports = User;