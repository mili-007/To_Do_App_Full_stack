const Category = require('../models/Category');
const Todo = require('../models/Todo');

// Get all categories for a user
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

// Get a single category with todos (Many-to-Many relationship)
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
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

// Create a category
const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({
      name: trimmedName,
      user: req.user._id
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = await Category.create({
      user: req.user._id,
      name: trimmedName,
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

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { name, color } = req.body;

    if (name !== undefined) {
      const trimmedName = typeof name === 'string' ? name.trim() : '';
      if (!trimmedName) {
        return res.status(400).json({ message: 'Category name is required' });
      }
    }

    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (name) {
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

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
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
