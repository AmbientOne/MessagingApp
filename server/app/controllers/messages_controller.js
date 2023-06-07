const Message = require('../models/messaging');

const saveMessage = async (sender, text, room) => {
    try {
        const newMessage = new Message({
            message: { text },
            username: sender,
            room,
        });
        const savedMessage = await newMessage.save();
        console.log(`Message saved: ${savedMessage}`);
        return savedMessage;
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};

module.exports = {
    saveMessage,
};
