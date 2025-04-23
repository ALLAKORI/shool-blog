const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from different possible locations
const envPaths = [
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '../.env'),
  '.env'
];

// Try loading .env from different locations
let envLoaded = false;
for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log(`Loaded environment variables from ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.error('Could not load .env file from any location');
}

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Check if MongoDB URI is defined
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables');
  console.log('Available environment variables:', Object.keys(process.env));
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority'
    });
    console.log('MongoDB connected successfully');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Define routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('School Blog API is running');
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('../client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Server
const PORT = process.env.PORT || 5000;
let server;

// Function to start server
const startServer = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(startServer, 5000);
      return;
    }

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api/`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log('Port is busy, retrying in 5 seconds...');
        setTimeout(() => {
          server.close();
          startServer();
        }, 5000);
      } else {
        console.error('Server error:', error);
      }
    });
  } catch (error) {
    console.error('Server startup error:', error);
    setTimeout(startServer, 5000);
  }
};

// Start the server
startServer(); 
