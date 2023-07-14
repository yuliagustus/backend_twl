const TodoModel = require('../model/todomodel');

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

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
};
