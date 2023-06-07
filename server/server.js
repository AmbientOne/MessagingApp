const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/* SERVER FOR SOCKET */
const http = require('http');
const server = http.createServer(app);

/* Socket Stuff */
let users = [];
const socketIO = require('socket.io');
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const helperController = require('./app/controllers/helper_controller');

require('./app/routes/messages_routes')(app);
io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    // Event listener for signIn event
    socket.on('signIn', (userData) => {
        // Store the signed-in user in the users array
        users.push(userData);

        // You can perform any additional logic here, such as broadcasting the updated user list to all connected clients

        console.log(`👤 User signed in: ${userData.username}`);
    });

    // Sends the message to all connected users
    socket.on('message', async (data) => {
        try {
            const { name, id, socketID, text, roomId } = data;
            const nameJson = JSON.parse(name);
            const senderName = nameJson.username;
            console.log(`name=${JSON.stringify(name)}, id=${id}, socketID=${socketID}, text=${text}, roomName=${roomId}`);
            const sender = await helperController.getSender(senderName); // Fetch the sender details
            const room = await helperController.getRoom(roomId); // Fetch the room details

            const savedMessage = await messageController.saveMessage(senderName, text, roomId); // Pass sender ID and room ID
            console.log(`Message saved: ${savedMessage}`);

            io.emit('messageResponse', {
                sender: senderName, // Use the sender's username
                id,
                socketID,
                text,
                roomId,
            });
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });


    socket.on('disconnect', () => {
        // Remove the user from the users array upon disconnection
        const disconnectedUser = users.find(user => user.socketId === socket.id);
        if (disconnectedUser) {
            users = users.filter(user => user.socketId !== socket.id);
            console.log(`🔥 User disconnected: ${disconnectedUser.username}`);
        }
    });
});

const SOCKET_PORT = 4000; // Choose the port for your socket server
server.listen(SOCKET_PORT, () => {
    console.log(`Socket server is running on port ${SOCKET_PORT}.`);
});

// routes
require('./app/routes/auth_routes')(app);
require('./app/routes/user_routes')(app);

const roomsRoutes = require('./app/routes/room_routes');
app.use('/', roomsRoutes);

// set port, listen for requests
const PORT = process.env.PORT || 8080; // Default port is 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// DB connections
const { connectToDatabase, initial } = require('./app/db/db');
const messageController = require("./app/controllers/messages_controller");

connectToDatabase()
    .then(() => {
        console.log("Successfully connected to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });
