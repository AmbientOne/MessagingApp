import React, { useState, useEffect } from 'react';
import ChatBar from './chat_components/chat_bar';
import ChatBody from './chat_components/chat_body';
import ChatFooter from './chat_components/chat_footer';

import { Navigate, useLocation } from 'react-router-dom';
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
    const location = useLocation();
    const currentUrl = location.pathname;
    const roomName = currentUrl.split('/').pop();

    useEffect(() => {
        socket.on('messageResponse', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
    }, [socket]);

    return (
        <div className="chat">
            <ChatBar socket={socket} />
            <div className="chat__main">
                <ChatBody newMessages={messages} />
                <ChatFooter socket={socket} roomName={roomName} />
            </div>
        </div>
    );
};

export default withAuth(ChatPage);
