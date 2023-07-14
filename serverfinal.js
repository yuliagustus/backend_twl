const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoURI = 'mongodb+srv://yuliana:yuliana@cluster0.0zznpds.mongodb.net/?retryWrites=true&w=majority';
// Create Express app
const app = express();
app.use(cors())
app.use(express.json())
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





const todoSchema = new mongoose.Schema({
    kegiatan: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    nama: {
      type: String,
      required: true
    }
  });
  

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);
const TodoModel = mongoose.model('Todo', todoSchema);

// Get all todos
const getAllTodos = async (req, res) => {
    try {
      const todos = await TodoModel.find();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  };
  
  // Get a single todo by ID
  const getTodoById = async (req, res) => {
    try {
      const todo = await TodoModel.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todo' });
    }
  };
  
  // Create a new todo
  const createTodo = async (req, res) => {
    try {
      const { kegiatan, date, nama } = req.body;
      const newTodo = new TodoModel({ kegiatan, date, nama });
      const savedTodo = await newTodo.save();
      res.status(201).json(savedTodo);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to create todo' });
    }
  };
  
  // Update a todo by ID
  const updateTodo = async (req, res) => {
    try {
      const { kegiatan, date, nama } = req.body;
      const updatedTodo = await TodoModel.findByIdAndUpdate(
        req.params.id,
        { kegiatan, date, nama },
        { new: true }
      );
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(updatedTodo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update todo' });
    }
  };
  
  // Delete a todo by ID
  const deleteTodo = async (req, res) => {
    try {
      const deletedTodo = await TodoModel.findByIdAndDelete(req.params.id);
      if (!deletedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  };

  const register = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Create a new user
      const newUser = new User({
        username,
        password,
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Check password
      if (password !== user.password) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ user: user.username }, 'hakunamatata', { expiresIn: '1h' });
  
      // Set the JWT token as a cookie
      res.cookie('token', token, { maxAge: 3600000, httpOnly: true }); // Expiry set to 1 hour (3600000 milliseconds)
  
      // Return the token as a response
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const isAuthenticated = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]; // Extract token from the Authorization header
      const decoded = jwt.verify(token, 'hakunamatata'); // Verify the token using the secret key
  
      // Attach the decoded token to the request object
      req.user = decoded.user;
  
      next(); // Move to the next middleware
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
  
  app.get('/todos', isAuthenticated, getAllTodos);

  app.get('/todos/:id', getTodoById);
  
  app.post('/todos', isAuthenticated, createTodo);
  
  app.put('/todos/:id', updateTodo);
  
  app.delete('/todos/:id', isAuthenticated, deleteTodo);
  
  app.post('/register', register);
  
  app.post('/login', login);
  
