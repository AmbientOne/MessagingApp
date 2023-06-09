const Message = require('../models/messaging');

const saveMessage = async (sender, text, room) => {
    try {
        const newMessage = new Message({
            message: { text },
            username: sender,
            room,
        });
        return await newMessage.save();
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};

module.exports = {
    saveMessage,
};
