const Todo = require('../models/Todo');

// @desc    Get all todos for a user (including shared todos)
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    // Get todos owned by user or shared with user
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

// @desc    Create a todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate, project, categories, sharedWith } = req.body;
    
    const todo = await Todo.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate,
      project: project || null,
      categories: categories || [],
      sharedWith: sharedWith || []
    });
    
    // Populate relationships
    await todo.populate('project', 'name color');
    await todo.populate('categories', 'name color');
    await todo.populate('sharedWith', 'name email');
    
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate, project, categories, sharedWith } = req.body;
    
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Check if user owns the todo or has shared access
    const hasAccess = todo.user.toString() === req.user._id.toString() ||
      todo.sharedWith.some(id => id.toString() === req.user._id.toString());
    
    if (!hasAccess) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Only owner can modify relationships
    const isOwner = todo.user.toString() === req.user._id.toString();
    
    todo.title = title !== undefined ? title : todo.title;
    todo.description = description !== undefined ? description : todo.description;
    todo.completed = completed !== undefined ? completed : todo.completed;
    todo.priority = priority !== undefined ? priority : todo.priority;
    todo.dueDate = dueDate !== undefined ? dueDate : todo.dueDate;
    
    if (isOwner) {
      if (project !== undefined) todo.project = project || null;
      if (categories !== undefined) todo.categories = categories || [];
      if (sharedWith !== undefined) todo.sharedWith = sharedWith || [];
    }
    
    const updatedTodo = await todo.save();
    
    // Populate relationships
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

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Only owner can delete
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Delete all comments associated with this todo
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
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
