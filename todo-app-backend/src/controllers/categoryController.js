const Category = require('../models/Category');
const Todo = require('../models/Todo');
const { getPrisma } = require('../config/prisma');
const { toMongoLikeCategory, toMongoLikeTodo, toMongoLikeUser, toMongoLikeProject } = require('../utils/mongoLike');

// @desc    Get all categories for a user
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const categories = await Category.find({ user: req.user._id })
    //   .sort('name');
    // res.json(categories);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const categories = await prisma.category.findMany({
        where: { userId: req.user._id },
        orderBy: { name: 'asc' },
      });
      const shaped = categories.map((c) => toMongoLikeCategory(c));
      return res.json(shaped);
    }

    // Default: MongoDB
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
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const category = await Category.findById(req.params.id);
    // if (!category) return res.status(404).json({ message: 'Category not found' });
    // if (category.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    // const todos = await Todo.find({ categories: category._id, $or: [{ user: req.user._id }, { sharedWith: req.user._id }] })
    //   .populate('user', 'name email').populate('project', 'name color').populate('categories', 'name color').sort('-createdAt');
    // res.json({ ...category.toObject(), todos });

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const category = await prisma.category.findUnique({
        where: { id: req.params.id },
      });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      if (category.userId !== req.user._id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const todos = await prisma.todo.findMany({
        where: {
          categories: { some: { categoryId: category.id } },
          OR: [
            { userId: req.user._id },
            { sharedWith: { some: { userId: req.user._id } } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          project: { select: { id: true, name: true, color: true } },
          categories: { include: { category: { select: { id: true, name: true, color: true } } } },
        },
      });

      const shapedCategory = toMongoLikeCategory(category);
      const shapedTodos = todos.map((t) => {
        const mapped = {
          ...t,
          user: toMongoLikeUser(t.user),
          project: t.project ? toMongoLikeProject(t.project) : null,
          categories: (t.categories || []).map((tc) => toMongoLikeCategory(tc.category)),
          priority: String(t.priority),
        };
        delete mapped.userId;
        delete mapped.projectId;
        return toMongoLikeTodo(mapped);
      });

      return res.json({ ...shapedCategory, todos: shapedTodos });
    }

    // Default: MongoDB
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const todos = await Todo.find({
      categories: category._id,
      $or: [{ user: req.user._id }, { sharedWith: req.user._id }],
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
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const existingCategory = await Category.findOne({ name: name.trim(), user: req.user._id });
    // if (existingCategory) return res.status(400).json({ message: 'Category with this name already exists' });
    // const category = await Category.create({ user: req.user._id, name: name.trim(), color: color || '#10B981' });
    // res.status(201).json(category);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const trimmedName = name ? String(name).trim() : '';
      if (!trimmedName) {
        return res.status(400).json({ message: 'Please add a category name' });
      }

      const existing = await prisma.category.findFirst({
        where: { userId: req.user._id, name: trimmedName },
      });
      if (existing) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }

      const category = await prisma.category.create({
        data: {
          user: { connect: { id: req.user._id } },
          name: trimmedName,
          color: color || '#10B981',
        },
      });
      return res.status(201).json(toMongoLikeCategory(category));
    }

    // Default: MongoDB
    const existingCategory = await Category.findOne({
      name: name.trim(),
      user: req.user._id,
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = await Category.create({
      user: req.user._id,
      name: name.trim(),
      color: color || '#10B981',
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    if (error.code === 11000 || error.code === 'P2002') {
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
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const category = await Category.findById(req.params.id);
    // if (!category) return res.status(404).json({ message: 'Category not found' });
    // if (category.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    // if (name) { const existingCategory = await Category.findOne({ name: name.trim(), user: req.user._id, _id: { $ne: category._id } });
    //   if (existingCategory) return res.status(400).json({ message: 'Category with this name already exists' });
    //   category.name = name.trim(); }
    // if (color) category.color = color;
    // const updatedCategory = await category.save();
    // res.json(updatedCategory);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const existing = await prisma.category.findUnique({
        where: { id: req.params.id },
        select: { id: true, userId: true },
      });

      if (!existing) {
        return res.status(404).json({ message: 'Category not found' });
      }

      if (existing.userId !== req.user._id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const data = {};
      if (name !== undefined) {
        const trimmedName = String(name).trim();
        const conflict = await prisma.category.findFirst({
          where: { userId: req.user._id, name: trimmedName, id: { not: req.params.id } },
        });
        if (conflict) {
          return res.status(400).json({ message: 'Category with this name already exists' });
        }
        data.name = trimmedName;
      }
      if (color !== undefined) data.color = color;

      const updated = await prisma.category.update({
        where: { id: req.params.id },
        data,
      });
      return res.json(toMongoLikeCategory(updated));
    }

    // Default: MongoDB
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
        _id: { $ne: category._id },
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
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const category = await Category.findById(req.params.id);
    // if (!category) return res.status(404).json({ message: 'Category not found' });
    // if (category.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    // await Todo.updateMany({ categories: category._id }, { $pull: { categories: category._id } });
    // await category.deleteOne();
    // res.json({ message: 'Category removed' });

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const category = await prisma.category.findUnique({
        where: { id: req.params.id },
        select: { id: true, userId: true },
      });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      if (category.userId !== req.user._id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      // TodoCategory join rows are cascade-deleted when category is deleted
      await prisma.category.delete({ where: { id: req.params.id } });
      return res.json({ message: 'Category removed' });
    }

    // Default: MongoDB
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

