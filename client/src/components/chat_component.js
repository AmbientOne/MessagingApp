import React, { useState, useEffect } from 'react';
import ChatBar from './chat_components/chat_bar';
import ChatBody from './chat_components/chat_body';
import ChatFooter from './chat_components/chat_footer';

import {Navigate, useParams} from 'react-router-dom';
import AuthService from '../services/auth_service';

import './chat_components/static/chat_styles.css'; // Import the CSS file


const withAuth = (Component) => {
    return (props) => {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            // User is not logged in, redirect to login page
            return <Navigate to="/login" />;
        }

        // User is logged in, render the protected component
        return <Component {...props} />;
    };
};

const ChatPage = ({ socket }) => {
    const [messages, setMessages] = useState([]);
    const roomName = localStorage.getItem("roomName");
    useEffect(() => {
        socket.on('messageResponse', (data) => setMessages([...messages, data]));
    }, [socket, messages]);

    return (
        <div className="chat">
            <ChatBar socket={socket} />
            <div className="chat__main">
                <ChatBody messages={messages} />
                <ChatFooter socket={socket} roomName={roomName} />
            </div>
        </div>
    );
};

export default withAuth(ChatPage);