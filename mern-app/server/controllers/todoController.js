const Todo = require('../models/Todo');
const {
  updateProgressForCompletion,
  ensureProfile,
} = require('../utils/profileManager');

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
};

const createTodo = async (req, res) => {
  try {
    const todo = await Todo.create({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      pointsEarned: req.body.pointsEarned,
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create todo' });
  }
};

const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update todo' });
  }
};

const toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.isCompleted = !todo.isCompleted;
    await todo.save();

    let progress = null;
    if (todo.isCompleted) {
      progress = await updateProgressForCompletion(todo.userId);
    } else {
      const profile = await ensureProfile(todo.userId);
      progress = { profile, newBadges: [] };
    }

    res.json({ todo, progress });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update todo' });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo removed' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete todo' });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
};

