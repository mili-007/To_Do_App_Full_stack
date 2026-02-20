const Todo = require('../models/Todo');

//  Get start of current date
function getStartOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Return true if the given due date 
function isDueDateInPast(dueDate) {
  if (dueDate == null || dueDate === '') return false;
  const d = dueDate instanceof Date ? dueDate : new Date(dueDate);
  if (Number.isNaN(d.getTime())) return false;
  const today = getStartOfToday();
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

// Get a single todo by ID (owner or shared-with only)
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
      .populate('user', 'name email')
      .populate('project', 'name color')
      .populate('categories', 'name color')
      .populate('sharedWith', 'name email');

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const hasAccess =
      todo.user._id.toString() === req.user._id.toString() ||
      todo.sharedWith.some((u) => u._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all todos for a user (including shared todos)
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({
      $or: [
        { user: req.user._id },
        { sharedWith: req.user._id }
      ]
    })
      .populate('user', 'name email')
      .populate('project', 'name color')
      .populate('categories', 'name color')
      .populate('sharedWith', 'name email')
      .sort('-createdAt');
    
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a todo
const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate, project, categories, sharedWith } = req.body;

    const trimmedTitle = typeof title === 'string' ? title.trim() : '';
    if (!trimmedTitle) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (isDueDateInPast(dueDate)) {
      return res.status(400).json({
        message: 'Due date cannot be in the past. Please select today or a future date.'
      });
    }

    const todo = await Todo.create({
      user: req.user._id,
      title: trimmedTitle,
      description,
      priority,
      dueDate,
      project: project || null,
      categories: categories || [],
      sharedWith: sharedWith || []
    });
    
    await todo.populate('project', 'name color');
    await todo.populate('categories', 'name color');
    await todo.populate('sharedWith', 'name email');
    
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a todo
const updateTodo = async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate, project, categories, sharedWith } = req.body;
    
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    const hasAccess = todo.user.toString() === req.user._id.toString() ||
      todo.sharedWith.some(id => id.toString() === req.user._id.toString());
    
    if (!hasAccess) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const isOwner = todo.user.toString() === req.user._id.toString();
    
    if (title !== undefined) {
      const trimmedTitle = typeof title === 'string' ? title.trim() : '';
      if (!trimmedTitle) {
        return res.status(400).json({ message: 'Title is required' });
      }
      todo.title = trimmedTitle;
    }
    todo.description = description !== undefined ? description : todo.description;
    todo.completed = completed !== undefined ? completed : todo.completed;
    todo.priority = priority !== undefined ? priority : todo.priority;

    if (dueDate !== undefined) {
      const hasNewDate = dueDate !== null && dueDate !== '';
      if (hasNewDate && isDueDateInPast(dueDate)) {
        return res.status(400).json({
          message: 'Due date cannot be in the past. Please select today or a future date.'
        });
      }
      todo.dueDate = hasNewDate ? dueDate : null;
    }

    if (isOwner) {
      if (project !== undefined) todo.project = project || null;
      if (categories !== undefined) todo.categories = categories || [];
      if (sharedWith !== undefined) todo.sharedWith = sharedWith || [];
    }
    
    const updatedTodo = await todo.save();
    
    await updatedTodo.populate('project', 'name color');
    await updatedTodo.populate('categories', 'name color');
    await updatedTodo.populate('sharedWith', 'name email');
    await updatedTodo.populate('user', 'name email');
    
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a todo
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const Comment = require('../models/Comment');
    await Comment.deleteMany({ todo: todo._id });
    
    await todo.deleteOne();
    res.json({ message: 'Todo removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTodoById,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
