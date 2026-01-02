const Category = require('../models/Category');
const Todo = require('../models/Todo');

// @desc    Get all categories for a user
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id })
      .sort('name');
    
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single category with todos (Many-to-Many relationship)
// @route   GET /api/categories/:id
// @access  Private
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if user owns the category
    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Get all todos that have this category (Many-to-Many relationship)
    const todos = await Todo.find({ 
      categories: category._id,
      $or: [
        { user: req.user._id },
        { sharedWith: req.user._id }
      ]
    })
      .populate('user', 'name email')
      .populate('project', 'name color')
      .populate('categories', 'name color')
      .sort('-createdAt');
    
    res.json({ ...category.toObject(), todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    
    // Check if category with same name already exists for this user
    const existingCategory = await Category.findOne({ 
      name: name.trim(), 
      user: req.user._id 
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const category = await Category.create({
      user: req.user._id,
      name: name.trim(),
      color: color || '#10B981'
    });
    
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if user owns the category
    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (name) {
      // Check if another category with same name exists
      const existingCategory = await Category.findOne({ 
        name: name.trim(), 
        user: req.user._id,
        _id: { $ne: category._id }
      });
      
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
      
      category.name = name.trim();
    }
    
    if (color) {
      category.color = color;
    }
    
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if user owns the category
    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Remove category from all todos (Many-to-Many relationship cleanup)
    await Todo.updateMany(
      { categories: category._id },
      { $pull: { categories: category._id } }
    );
    
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};

