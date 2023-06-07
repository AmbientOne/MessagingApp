import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthService from "../services/auth_service";
import { Navigate } from "react-router-dom";


const API_URL = "http://localhost:8080/api/rooms";

const RoomList = ({ currentUser }) => {
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [newRoomName, setNewRoomName] = useState("");

    useEffect(() => {
        // Fetch room data from the backend API
        axios
            .get(API_URL + "/userRooms", {
                params: { username: currentUser.username },
            })
            .then((response) => {
                setRooms(response.data);
            })
            .catch((error) => {
                console.error("Error fetching rooms:", error);
            });
    }, [currentUser]);

    const handleCreateRoom = () => {
        // Make API request to create a room
        axios
            .post(API_URL + "/create", {
                name: newRoomName,
                username: currentUser.username,
            })
            .then((response) => {
                // Add the newly created room to the list
                setRooms((prevRooms) => [...prevRooms, response.data]);
                setNewRoomName("");
            })
            .catch((error) => {
                console.error("Error creating room:", error);
            });
    };

    const handleJoinRoom = (roomId) => {
        // Make API request to join a room
        axios
            .post(
                API_URL + "/join",
                { roomId, username: currentUser.username },
                { transformRequest: [(data) => JSON.stringify(data)] }
            )
            .then((response) => {
                // Handle successful join
                console.log("Room joined successfully");
            })
            .catch((error) => {
                console.error("Error joining room:", error);
            });
    };


    const handleLeaveRoom = (roomId) => {
        // Make API request to leave a room
        axios
            .delete(API_URL + "/leave", {
                data: {
                    roomId,
                    username: currentUser.username,
                }
            })
            .then((response) => {
                // Handle successful leave
                console.log("Room left successfully");
                setRooms((prevRooms) =>
                    prevRooms.filter((room) => room._id !== roomId)
                );
            })
            .catch((error) => {
                console.error("Error leaving room:", error);
            });
    };

    return (
        <div className="room-list">
            <h2>Rooms:</h2>
                        <div>
                <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Enter new Room Name"
                />
            </div>
            <button onClick={handleCreateRoom}>Create Room</button>
            <div>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter Room ID"
                />
                <button onClick={handleJoinRoom}>Join Room</button>
            </div>
            <div className="room-container">
                {rooms.map((room) => (
                    <div key={room._id} className="room-item">
                        <h3>{room.name}</h3>
                        <button onClick={() => handleLeaveRoom(room._id)}>
                            Leave Room
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Rooms = () => {
    const [redirect, setRedirect] = useState(null);
    const [userReady, setUserReady] = useState(false);
    const [currentUser, setCurrentUser] = useState({ username: "" });

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            setRedirect("/home");
        } else {
            setCurrentUser(currentUser);
            setUserReady(true);
        }
    }, []);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
            {userReady && <RoomList currentUser={currentUser} />}
            {/* Render other components or content here */}
        </div>
    );
};

export default Rooms;
