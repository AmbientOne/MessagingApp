import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ChatBody = ({ newMessages }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUrl = location.pathname;
    const [roomId, setRoomId] = useState('');
    const [messages, setMessages] = useState([]);
    const [hasMounted, setHasMounted] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const roomIdFromUrl = currentUrl.split('/').pop();
        setRoomId(roomIdFromUrl);

        const fetchPreviousMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/messages/${roomIdFromUrl}`);
                const previousMessages = response.data.map((message) => ({
                    id: message._id,
                    text: message.text || message.message.text,
                    username: message.username,
                }));
                setMessages(previousMessages);
                setHasMounted(true); // Set hasMounted to true after loading previous messages
            } catch (error) {
                console.error('Error fetching previous messages:', error);
            }
        };

        fetchPreviousMessages();
    }, [currentUrl]);

    useEffect(() => {
        if (newMessages.length > 0) {
            const latestMessage = newMessages[newMessages.length - 1];
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: latestMessage.id,
                    text: latestMessage.text,
                    username: latestMessage.sender,
                },
            ]);

            // Scroll to the bottom of the chat container
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [newMessages]);

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
            <div className="message__container" ref={chatContainerRef}>
                {messages.map((message, index) => (
                    <div className="message__chats" key={`${message.id}-${index}`}>
                        <p className="sender__name">
                            {message.username === localStorage.getItem('user') ? 'You' : message.username}
                        </p>
                        <div
                            className={
                                message.username === JSON.parse(localStorage.getItem('user'))?.username
                                    ? 'message__sender'
                                    : 'message__recipient'
                            }
                        >
                            <p
                                style={
                                    message.username === JSON.parse(localStorage.getItem('user'))?.username
                                        ? { color: 'blue' }
                                        : {}
                                }
                            >
                                {message.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="message__status"></div>
        </>
    );
};

export default ChatBody;
