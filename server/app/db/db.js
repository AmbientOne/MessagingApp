const mongoose = require('mongoose')
const Role = require("../models/role_model");

const uri = "mongodb+srv://messenger:messenger@cluster0.asy1ppf.mongodb.net/?retryWrites=true&w=majority";

function connectToDatabase() {

    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

async function initial() {
    try {
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
            await Promise.all([
                new Role({ name: "user" }).save(),
                new Role({ name: "admin" }).save()
            ]);
            console.log("Added 'user' and 'admin' to roles collection");
        }
    } catch (err) {
        console.error("Error during initialization", err);
    }
}

module.exports = {
    connectToDatabase,
    initial
};