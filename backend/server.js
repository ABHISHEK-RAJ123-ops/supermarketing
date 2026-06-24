const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Debug
console.log("TEST NODE_ENV:", process.env.NODE_ENV);
console.log("TEST MONGO_URI:", process.env.MONGO_URI);

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());