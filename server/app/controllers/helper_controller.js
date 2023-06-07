const User = require('../models/user_model');
const Room = require('../models/room');

// Controller function to get the sender details
// Controller function to get the sender details
const getSender = async (username) => {
    try {
        return await User.findOne({ username });
    } catch (error) {
        console.error('Error retrieving sender:', error);
        throw error;
    }
};


// Controller function to get the room details
const getRoom = async (roomName) => {
    try {
        return await Room.findOne( {roomName} );
    } catch (error) {
        console.error('Error retrieving room:', error);
        throw error;
    }
};

module.exports = {
    getSender,
    getRoom,
};
