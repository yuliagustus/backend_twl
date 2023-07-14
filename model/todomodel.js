const mongoose = require('mongoose');

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

const TodoModel = mongoose.model('Todo', todoSchema);

module.exports = TodoModel;
