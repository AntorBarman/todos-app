const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


const MONGO_URI = 'mongodb+srv://antorbr320_db_user:TiG72QCI8Wc5M5BH@cluster0.vakpamq.mongodb.net/tododb?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas (tododb) successfully'))
  .catch((err) => console.error('Database connection error:', err));


const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema, 'todos');


app.post('/todos', async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    const savedTodo = await newTodo.save();
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTodo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


app.put('/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTodo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});