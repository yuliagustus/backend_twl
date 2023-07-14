const express = require('express');
const todoController = require('../controller/todocontroller')
const isAuthenticated = require('../middleware/authmiddleware')

const router = express.Router();

// GET /todos
router.get('/list',isAuthenticated, todoController.getAllTodos);

// GET /todos/:id
router.get('/list/:id', todoController.getTodoById);

// POST /todos
router.post('/list',isAuthenticated, todoController.createTodo);

// PUT /todos/:id
router.put('/list/:id', todoController.updateTodo);

// DELETE /todos/:id
router.delete('/list/:id',isAuthenticated, todoController.deleteTodo);

module.exports = router;
