const express = require('express');
const router = express.Router();
const Room = require('../models/room'); // Assuming the room model is defined in a separate file
const User = require('../models/user_model')
const mongoose = require('mongoose');

// temporary rooms
rooms = ["room1", "room2", "room3"]

// Get all the rooms
router.get('/api/rooms/all', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all the rooms for a user
router.get('/api/rooms/userRooms', async (req, res) => {
    const { username } = req.query;

    try {
        const user = await User.findOne({ username }); // Find the user by username
        if (!user) {
            // If the user is not found, send an appropriate response to the frontend
            return res.status(404).json({ error: 'User not found' });
        }

        const userRooms = await Room.find({ _id: { $in: user.rooms } }); // Find the rooms based on the user's rooms array
        res.json(userRooms);
    } catch (error) {
        console.error('Error fetching user rooms:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/api/rooms/create', (req, res) => {
    const { name, username } = req.body;

    Room.findOne({ name })
        .then(existingRoom => {
            if (existingRoom) {
                return res.status(400).json({ error: 'Room Already Exists' });
            }

            const newRoom = new Room({ name });

            newRoom.save()
                .then(savedRoom => {
                    User.findOne({ username })
                        .then(user => {
                            if (!user) {
                                throw new Error('User not found');
                            }

                            user.rooms.push(savedRoom._id);

                            return user.save();
                        })
                        .then(() => {
                            res.status(201).json(savedRoom);
                        })
                        .catch(error => {
                            console.error('Error creating room:', error);
                            res.status(500).json({ error: 'Failed to create room' });
                        });
                })
                .catch(error => {
                    console.error('Error creating room:', error);
                    res.status(500).json({ error: 'Failed to create room' });
                });
        })
        .catch(error => {
            console.error('Error finding existing room:', error);
            res.status(500).json({ error: 'Failed to create room' });
        });
});



router.post('/api/rooms/join', (req, res) => {
    const { roomName, username } = req.body;

    // Find the room by its name
    Room.findOne({ name: roomName })
        .then(room => {
            if (!room) {
                // If the room is not found, return an error response to the frontend
                return res.status(404).json({ error: 'Room not found' });
            }

            // Find the user by their username
            User.findOne({ username })
                .then(user => {
                    if (!user) {
                        // If the user is not found, return an error response to the frontend
                        return res.status(404).json({ error: 'User not found' });
                    }

                    // Check if the user is already in the room
                    if (user.rooms.includes(room._id)) {
                        return res.status(409).json({ error: 'User already in room' });
                    }

                    // Add the room's ID to the user's rooms array
                    user.rooms.push(room._id);

                    // Save the updated user
                    return user.save();
                })
                .then(() => {
                    res.status(200).json({ message: 'Room joined successfully' });
                })
                .catch(error => {
                    console.error('Error joining room:', error);
                    res.status(500).json({ error: 'Failed to join room' });
                });
        })
        .catch(error => {
            console.error('Error joining room:', error);
            res.status(500).json({ error: 'Failed to join room' });
        });
});


router.delete('/api/rooms/leave', (req, res) => {
    const { roomName, username } = req.body;

    User.findOne({ username })
        .then(user => {
            if (!user) {
                throw new Error('User not found');
            }

            const roomId = new mongoose.Types.ObjectId(roomName); // Convert roomName to ObjectId

            user.rooms = user.rooms.filter(room => !room.equals(roomId)); // Use .equals() to compare ObjectId values

            return user.save();
        })
        .then(() => {
            res.status(200).json({ message: 'Room left successfully' });
        })
        .catch(error => {
            console.error('Error leaving room:', error);
            res.status(500).json({ error: 'Failed to leave room' });
        });
});


module.exports = router;