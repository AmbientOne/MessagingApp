const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Messaging application." });
});

// routes
require('./app/routes/auth_routes')(app);
require('./app/routes/user_routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080; // Default port is 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// DB connections
const { connectToDatabase, initial } = require('./app/db/db');

connectToDatabase()
    .then(() => {
        console.log("Successfully connected to MongoDB.")
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });
