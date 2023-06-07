import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ChatBody = ( { newMessages }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUrl = location.pathname;
    const [roomId, setRoomId] = useState('');
    const [messages, setMessages] = useState([]);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        const roomIdFromUrl = currentUrl.split('/').pop();
        setRoomId(roomIdFromUrl);

        const fetchPreviousMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/messages/${roomIdFromUrl}`);
                const previousMessages = response.data;
                setMessages(previousMessages);
                setHasMounted(true); // Set hasMounted to true after loading previous messages
            } catch (error) {
                console.error('Error fetching previous messages:', error);
            }
        };

        if (!hasMounted) {
            fetchPreviousMessages(); // Fetch previous messages only if the component has not mounted
        }
    }, [currentUrl, hasMounted]);

    const handleLeaveChat = () => {
        navigate('/');
        window.location.reload();
    };

    return (
        <>
            <header className="chat__mainHeader">
                <button className="leaveChat__btn" onClick={handleLeaveChat}>
                    LEAVE CHAT
                </button>
            </header>
                <div className="message__container">
                    {messages.map((message) => (
                        <div className="message__chats" key={message._id}>
                            <p className="sender__name">
                                {message.username === localStorage.getItem('userName') ? 'You' : message.username}
                            </p>
                            <div className={message.username === localStorage.getItem('userName') ? 'message__sender' : 'message__recipient'}>
                                <p style={message.username === localStorage.getItem('userName') ? { color: 'blue' } : {}}>
                                    {message.message.text}
                                </p>
                            </div>
                        </div>
                    ))}


                <div className="message__status"></div>
            </div>
        </>
    );
};

export default ChatBody;
