const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
res.send('A-Z Supermarket API is running...');
});

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
cors: {
origin: '*',
methods: ['GET', 'POST']
}
});

io.on('connection', (socket) => {
console.log(`User connected: ${socket.id}`);

socket.on('disconnect', () => {
console.log(`User disconnected: ${socket.id}`);
});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
console.log(`Server running on port ${PORT}`);
});
