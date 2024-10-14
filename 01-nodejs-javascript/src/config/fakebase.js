const express = require('express');
const app = express();
const port = 3000;

// Define the fake database
let fakeDatabase = {
  users: [
    { id: 1, name: 'admin', email: 'admin@example.com', password: 'password', dateOfBirth: '1990-01-01', gender: 'Man', role: 'Administrator' },
    { id: 2, name: 'user', email: 'user@example.com', password: 'password', dateOfBirth: '1995-01-01', gender: 'Woman', role: 'User ' }
  ],
  userotpverification: [
    { id: 1, email: 'admin@example.com', otp: '123456', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, email: 'user@example.com', otp: '789012', createdAt: new Date(), updatedAt: new Date() }
  ]
};

// Define a function to reset the fake database
function resetFakeDatabase() {
  fakeDatabase = {
    users: [
      { id: 1, name: 'admin', email: 'admin@example.com', password: '123456', dateOfBirth: '1990-01-01', gender: 'Man', role: 'Administrator' },
      { id: 2, name: 'user', email: 'user@example.com', password: '654321', dateOfBirth: '1995-01-01', gender: 'Woman', role: 'User ' }
    ],
    userotpverification: []
  };
}

// Define a function to check if the database is connected
function isDatabaseConnected() {
  // Replace this with your actual database connection check
  return false; // Assume the database is not connected
}

// Define a function to get the database
function getDatabase() {
  if (isDatabaseConnected()) {
    // Return the actual database
    // Replace this with your actual database connection
    return null;
  } else {
    // Return the fake database
    return fakeDatabase;
  }
}

// Define the API routes
app.get('/api/users', (req, res) => {
  const database = getDatabase();
  res.json(database.users);
});

app.get('/api/userotpverification', (req, res) => {
  const database = getDatabase();
  res.json(database.userotpverification);
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  resetFakeDatabase(); // Reset the fake database when the server starts
});

// Reset the fake database when the server exits
process.on('exit', () => {
  resetFakeDatabase();
});