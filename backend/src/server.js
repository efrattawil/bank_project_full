require('dotenv').config(); 
console.log('MONGODB_URI =', process.env.MONGODB_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const authController = require('./controllers/auth.controller');
const authRoutes = require('./routes/auth.routes');
const transactionsRoutes = require('./routes/transactions.routes');
const transactionController = require('./controllers/transactions.controller');
const { protect } = require('./middleware/auth.middleware');

const BASE_PATH = '/bank_app/api/v1';

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI; 

const allowedOrigins = [
  'http://localhost:3001',
  'http://bank_frontend:5173',
  'https://bank-project-front.onrender.com',
  'https://bank-project-full-2.onrender.com'
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post(`${BASE_PATH}/cleardb`, authController.clearDatabase);
app.post(`${BASE_PATH}/signup`, authController.signup);
app.post(`${BASE_PATH}/login`, authController.login);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/transactions`, transactionsRoutes);
app.get(`${BASE_PATH}/dashboard`, protect, transactionController.getDashboardData);

app.get('/', (req, res) => {
  res.status(200).send('Bank System Backend is Running!');
});

const connectWithRetry = () => {
  console.log('Attempting to connect to MongoDB...');
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('Connected successfully to MongoDB!');

      // start the server AFTER MongoDB connection succeeds
      const server = http.createServer(app);
      const io = new Server(server, {
        cors: {
          origin: allowedOrigins,
          credentials: true
        }
      });

      const onlineUsers = new Map(); 
      io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        socket.on("registerUser", (userId) => {
          if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
          onlineUsers.get(userId).add(socket.id);
          console.log(`Registered socket ${socket.id} for user ${userId}`);
        });
        socket.on("disconnect", () => {
          console.log(`Socket disconnected: ${socket.id}`);
          for (const [userId, sockets] of onlineUsers.entries()) {
            sockets.delete(socket.id);
            if (sockets.size === 0) onlineUsers.delete(userId);
          }
        });
      });

      app.set('io', io);
      app.set('onlineUsers', onlineUsers);

      server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });

    })
    .catch(err => {
      console.error('MongoDB connection error. Retrying in 5 seconds...', err.message);
      setTimeout(connectWithRetry, 5000); 
    });
};
connectWithRetry();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

const onlineUsers = new Map(); 

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("registerUser", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    console.log(`Registered socket ${socket.id} for user ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);

    for (const [userId, sockets] of onlineUsers.entries()) {
      sockets.delete(socket.id); 
      if (sockets.size === 0) {
        onlineUsers.delete(userId); 
        console.log(`All sockets closed for user ${userId}`);
      }
    }
  });
});

app.set('io', io);
app.set('onlineUsers', onlineUsers);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
