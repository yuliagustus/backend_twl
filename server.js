const express = require('express');
const mongoose = require('mongoose');
const todorouter = require('../expressJS/router/todorouter')
const userrouter = require('../expressJS/router/userrouter')
const cors = require('cors')

// Create Express app
const app = express();
app.use(cors())
app.use(express.json())

// MongoDB URI
const mongoURI = 'mongodb://127.0.0.1:27017/twl';

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));





app.use('/todo',todorouter)
app.use('/todo',userrouter)
// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
