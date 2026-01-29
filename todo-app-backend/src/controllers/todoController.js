const Todo = require('../models/Todo');
const { getPrisma } = require('../config/prisma');
const { toMongoLikeTodo, toMongoLikeUser, toMongoLikeProject, toMongoLikeCategory } = require('../utils/mongoLike');

// @desc    Get all todos for a user (including shared todos)
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const todos = await Todo.find({
    //   $or: [
    //     { user: req.user._id },
    //     { sharedWith: req.user._id }
    //   ]
    // })
    //   .populate('user', 'name email')
    //   .populate('project', 'name color')
    //   .populate('categories', 'name color')
    //   .populate('sharedWith', 'name email')
    //   .sort('-createdAt');
    // res.json(todos);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const todos = await prisma.todo.findMany({
        where: {
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
          sharedWith: { include: { user: { select: { id: true, name: true, email: true } } } },
        },
      });

      const shaped = todos.map((t) => {
        const mapped = {
          ...t,
          user: toMongoLikeUser(t.user),
          project: t.project ? toMongoLikeProject(t.project) : null,
          categories: (t.categories || []).map((tc) => toMongoLikeCategory(tc.category)),
          sharedWith: (t.sharedWith || []).map((ts) => toMongoLikeUser(ts.user)),
          priority: String(t.priority),
        };
        delete mapped.userId;
        delete mapped.projectId;
        return toMongoLikeTodo(mapped);
      });

      return res.json(shaped);
    }

    // Default: MongoDB
    const todos = await Todo.find({
      $or: [{ user: req.user._id }, { sharedWith: req.user._id }],
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

    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const todo = await Todo.create({
    //   user: req.user._id,
    //   title,
    //   description,
    //   priority,
    //   dueDate,
    //   project: project || null,
    //   categories: categories || [],
    //   sharedWith: sharedWith || []
    // });
    // await todo.populate('project', 'name color');
    // await todo.populate('categories', 'name color');
    // await todo.populate('sharedWith', 'name email');
    // res.status(201).json(todo);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const created = await prisma.todo.create({
        data: {
          user: { connect: { id: req.user._id } },
          title,
          description: description || null,
          priority: priority || 'medium',
          dueDate: dueDate ? new Date(dueDate) : null,
          project: project ? { connect: { id: project } } : undefined,
          categories: Array.isArray(categories)
            ? { create: categories.map((categoryId) => ({ category: { connect: { id: categoryId } } })) }
            : undefined,
          sharedWith: Array.isArray(sharedWith)
            ? { create: sharedWith.map((userId) => ({ user: { connect: { id: userId } } })) }
            : undefined,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          project: { select: { id: true, name: true, color: true } },
          categories: { include: { category: { select: { id: true, name: true, color: true } } } },
          sharedWith: { include: { user: { select: { id: true, name: true, email: true } } } },
        },
      });

      const shaped = {
        ...created,
        user: toMongoLikeUser(created.user),
        project: created.project ? toMongoLikeProject(created.project) : null,
        categories: (created.categories || []).map((tc) => toMongoLikeCategory(tc.category)),
        sharedWith: (created.sharedWith || []).map((ts) => toMongoLikeUser(ts.user)),
        priority: String(created.priority),
      };
      delete shaped.userId;
      delete shaped.projectId;

      return res.status(201).json(toMongoLikeTodo(shaped));
    }

    // Default: MongoDB
    const todo = await Todo.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate,
      project: project || null,
      categories: categories || [],
      sharedWith: sharedWith || [],
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

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate, project, categories, sharedWith } = req.body;

    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const todo = await Todo.findById(req.params.id);
    // if (!todo) return res.status(404).json({ message: 'Todo not found' });
    // const hasAccess = todo.user.toString() === req.user._id.toString() ||
    //   todo.sharedWith.some(id => id.toString() === req.user._id.toString());
    // if (!hasAccess) return res.status(401).json({ message: 'Not authorized' });
    // const isOwner = todo.user.toString() === req.user._id.toString();
    // todo.title = title !== undefined ? title : todo.title;
    // todo.description = description !== undefined ? description : todo.description;
    // todo.completed = completed !== undefined ? completed : todo.completed;
    // todo.priority = priority !== undefined ? priority : todo.priority;
    // todo.dueDate = dueDate !== undefined ? dueDate : todo.dueDate;
    // if (isOwner) {
    //   if (project !== undefined) todo.project = project || null;
    //   if (categories !== undefined) todo.categories = categories || [];
    //   if (sharedWith !== undefined) todo.sharedWith = sharedWith || [];
    // }
    // const updatedTodo = await todo.save();
    // await updatedTodo.populate('project', 'name color');
    // await updatedTodo.populate('categories', 'name color');
    // await updatedTodo.populate('sharedWith', 'name email');
    // await updatedTodo.populate('user', 'name email');
    // res.json(updatedTodo);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();

      const existing = await prisma.todo.findUnique({
        where: { id: req.params.id },
        include: { sharedWith: true },
      });

      if (!existing) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      const isOwner = existing.userId === req.user._id;
      const hasAccess = isOwner || (existing.sharedWith || []).some((s) => s.userId === req.user._id);
      if (!hasAccess) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      // Owner-only relationship updates
      const shouldUpdateProject = isOwner && project !== undefined;
      const shouldUpdateCategories = isOwner && categories !== undefined;
      const shouldUpdateSharedWith = isOwner && sharedWith !== undefined;

      const updated = await prisma.todo.update({
        where: { id: req.params.id },
        data: {
          title: title !== undefined ? title : undefined,
          description: description !== undefined ? (description || null) : undefined,
          completed: completed !== undefined ? completed : undefined,
          priority: priority !== undefined ? priority : undefined,
          dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
          project: shouldUpdateProject
            ? project
              ? { connect: { id: project } }
              : { disconnect: true }
            : undefined,
          categories: shouldUpdateCategories
            ? {
                deleteMany: {},
                create: Array.isArray(categories)
                  ? categories.map((categoryId) => ({ category: { connect: { id: categoryId } } }))
                  : [],
              }
            : undefined,
          sharedWith: shouldUpdateSharedWith
            ? {
                deleteMany: {},
                create: Array.isArray(sharedWith)
                  ? sharedWith.map((userId) => ({ user: { connect: { id: userId } } }))
                  : [],
              }
            : undefined,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          project: { select: { id: true, name: true, color: true } },
          categories: { include: { category: { select: { id: true, name: true, color: true } } } },
          sharedWith: { include: { user: { select: { id: true, name: true, email: true } } } },
        },
      });

      const shaped = {
        ...updated,
        user: toMongoLikeUser(updated.user),
        project: updated.project ? toMongoLikeProject(updated.project) : null,
        categories: (updated.categories || []).map((tc) => toMongoLikeCategory(tc.category)),
        sharedWith: (updated.sharedWith || []).map((ts) => toMongoLikeUser(ts.user)),
        priority: String(updated.priority),
      };
      delete shaped.userId;
      delete shaped.projectId;

      return res.json(toMongoLikeTodo(shaped));
    }

    // Default: MongoDB
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
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const todo = await Todo.findById(req.params.id);
    // if (!todo) return res.status(404).json({ message: 'Todo not found' });
    // if (todo.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    // const Comment = require('../models/Comment');
    // await Comment.deleteMany({ todo: todo._id });
    // await todo.deleteOne();
    // res.json({ message: 'Todo removed' });

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const todo = await prisma.todo.findUnique({
        where: { id: req.params.id },
        select: { id: true, userId: true },
      });

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      if (todo.userId !== req.user._id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      // Comments + join rows are deleted via CASCADE in schema
      await prisma.todo.delete({ where: { id: req.params.id } });
      return res.json({ message: 'Todo removed' });
    }

    // Default: MongoDB
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
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
