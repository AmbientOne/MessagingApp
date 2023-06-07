const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        message: {
            text: { type: String, required: true },
        },
        username: { type: String, required: true },
        room: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", messageSchema);
