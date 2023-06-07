const socketIO = require('socket.io');

class SocketManager {
    constructor(server) {
        this.io = socketIO(server);
        this.roomSockets = {};

        this.io.on('connection', (socket) => {
            this.handleConnection(socket);
        });
    }

    handleConnection(socket) {
        console.log(`⚡: ${socket.id} user just connected!`);

        socket.on('joinRoom', (roomId) => {
            this.handleJoinRoom(socket, roomId);
        });

        socket.on('leaveRoom', () => {
            this.handleLeaveRoom(socket);
        });

        socket.on('message', (data) => {
            this.handleMessage(socket, data);
        });

        socket.on('disconnect', () => {
            this.handleDisconnect(socket);
        });
    }

    handleJoinRoom(socket, roomId) {
        const currentRoom = socket.room;
        if (currentRoom) {
            socket.leave(currentRoom);
            if (this.roomSockets[currentRoom]) {
                this.roomSockets[currentRoom].delete(socket);
            }
        }

        socket.join(roomId);
        socket.room = roomId;

        if (!this.roomSockets[roomId]) {
            this.roomSockets[roomId] = new Set();
        }

        this.roomSockets[roomId].add(socket);
    }

    handleLeaveRoom(socket) {
        const currentRoom = socket.room;
        if (currentRoom) {
            socket.leave(currentRoom);
            if (this.roomSockets[currentRoom]) {
                this.roomSockets[currentRoom].delete(socket);
            }
            socket.room = null;
        }
    }

    handleMessage(socket, data) {
        const currentRoom = socket.room;
        if (currentRoom && this.roomSockets[currentRoom]) {
            this.roomSockets[currentRoom].forEach((roomSocket) => {
                roomSocket.emit('messageResponse', data);
            });
        }
    }

    handleDisconnect(socket) {
        console.log('🔥: A user disconnected');

        const currentRoom = socket.room;
        if (currentRoom && this.roomSockets[currentRoom]) {
            this.roomSockets[currentRoom].delete(socket);
        }
    }
}

module.exports = SocketManager;
