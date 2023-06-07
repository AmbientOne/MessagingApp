const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "*",
    credentials:true,
    optionsSuccessStatus:200,
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// routes
require('./app/routes/auth_routes')(app);
require('./app/routes/user_routes')(app);

const roomsRoutes = require('./app/routes/room_routes')


app.use('/', roomsRoutes);

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



/* SERVER FOR SOCKET */
const http = require('http');
const server = http.createServer(app);


/* Socket Stuff */
const socket = require('./app/socket/socket_setup');

const SocketManager = new socket(server);



