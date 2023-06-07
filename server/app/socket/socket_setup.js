const socketIO = require('socket.io')



class SocketManager {
    constructor(server) {
        this.io = socketIO(server);

        this.io.on('connection', this.handleConnection);

    }

    handleConnection(socket) {
        console.log('New socket connection: ', socket.id);

        socket.on('usercmd1', (data) => {
            this.handleUserCmd1(socket, data);
        });
        socket.on('usercmd2', (data) => {
            this.handleUserCmd2(socket, data);
        });
        socket.on('disconnect', () => {
            this.handleDisconnect(socket,);
        });
    }

    handleUserCmd1(socket, data) {
        // Handle user command 1
        // Emit response to the socket
        socket.emit('cmd', { result: 'xxx' });
    }

    handleUserCmd2(socket, data) {
        // Handle user command 2
        // ...
    }

    handleDisconnect(socket) {
        // Handle socket disconnection
        // ...
    }

}

module.exports = SocketManager;