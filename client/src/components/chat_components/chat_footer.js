import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ChatFooter = ({ socket }) => {
    const [message, setMessage] = useState('');
    const location = useLocation();

    const currentUrl = location.pathname;
    const roomId = currentUrl.split('/').pop();
    // Print the current URL
    console.log('Current URL:', roomId);

    const handleSendMessage = (e) => {
        e.preventDefault();
        console.log(localStorage.getItem('user'));
        if (message.trim() && localStorage.getItem('user')) {
            socket.emit('message', {
                text: message,
                name: localStorage.getItem('user'),
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id,
                roomId: roomId
            });
        }
        setMessage('');
    };
    return (
        <div className="chat__footer">
            <form className="form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Write message"
                    className="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="sendBtn">SEND</button>
            </form>
        </div>
    );
};

export default ChatFooter;