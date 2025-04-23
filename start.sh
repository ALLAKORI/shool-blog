#!/bin/bash
echo "Starting School Blog MERN Stack Application..."

# Check for MongoDB Atlas URI in .env file
if [ ! -f ./server/.env ]; then
  echo "Error: server/.env file not found. Please create it with your MongoDB connection details."
  exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d ./node_modules ]; then
  echo "Installing root dependencies..."
  npm install
fi

if [ ! -d ./server/node_modules ]; then
  echo "Installing server dependencies..."
  cd server && npm install && cd ..
fi

if [ ! -d ./client/node_modules ]; then
  echo "Installing client dependencies..."
  cd client && npm install && cd ..
fi

# Run the application
echo "Starting the application..."
echo "The server will run on http://localhost:5000"
echo "The client will run on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the application"

npm run dev 