const Project = require('../models/Project');
const Todo = require('../models/Todo');
const { getPrisma } = require('../config/prisma');
const { toMongoLikeProject, toMongoLikeTodo, toMongoLikeUser, toMongoLikeCategory } = require('../utils/mongoLike');

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const projects = await Project.find({ user: req.user._id })
    //   .sort('-createdAt')
    //   .populate('user', 'name email');
    // res.json(projects);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const projects = await prisma.project.findMany({
        where: { userId: req.user._id },
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      const shaped = projects.map((p) =>
        toMongoLikeProject({
          ...p,
          user: toMongoLikeUser(p.user),
        })
      );
      return res.json(shaped);
    }

    // Default: MongoDB
    const projects = await Project.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('user', 'name email');

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single project with todos
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
  try {
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const project = await Project.findById(req.params.id)
    //   .populate('user', 'name email');
    // if (!project) return res.status(404).json({ message: 'Project not found' });
    // if (project.user._id.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    // const todos = await Todo.find({ project: project._id })
    //   .populate('user', 'name email')
    //   .populate('categories', 'name color')
    //   .sort('-createdAt');
    // res.json({ ...project.toObject(), todos });

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const project = await prisma.project.findUnique({
        where: { id: req.params.id },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.userId !== req.user._id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const todos = await prisma.todo.findMany({
        where: { projectId: project.id },
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          categories: { include: { category: { select: { id: true, name: true, color: true } } } },
        },
      });

      const shapedProject = toMongoLikeProject({
        ...project,
        user: toMongoLikeUser(project.user),
      });

      const shapedTodos = todos.map((t) =>
        toMongoLikeTodo({
          ...t,
          user: toMongoLikeUser(t.user),
          categories: (t.categories || []).map((tc) => toMongoLikeCategory(tc.category)),
          priority: String(t.priority),
        })
      );

      return res.json({ ...shapedProject, todos: shapedTodos });
    }

    // Default: MongoDB
    const project = await Project.findById(req.params.id)
      .populate('user', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const todos = await Todo.find({ project: project._id })
      .populate('user', 'name email')
      .populate('categories', 'name color')
      .sort('-createdAt');

    res.json({ ...project.toObject(), todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const project = await Project.create({
    //   user: req.user._id,
    //   name,
    //   description,
    //   color: color || '#3B82F6'
    // });
    // res.status(201).json(project);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const project = await prisma.project.create({
        data: {
          user: { connect: { id: req.user._id } },
          name,
          description: description || null,
          color: color || '#3B82F6',
        },
      });
      return res.status(201).json(toMongoLikeProject(project));
    }

    // Default: MongoDB
    const project = await Project.create({
      user: req.user._id,
      name,
      description,
      color: color || '#3B82F6',
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const project = await Project.findById(req.params.id);
    // if (!project) return res.status(404).json({ message: 'Project not found' });
    // if (project.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    // project.name = name || project.name;
    // project.description = description !== undefined ? description : project.description;
    // project.color = color || project.color;
    // const updatedProject = await project.save();
    // res.json(updatedProject);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const existing = await prisma.project.findUnique({
        where: { id: req.params.id },
        select: { id: true, userId: true },
      });

      if (!existing) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (existing.userId !== req.user._id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const updated = await prisma.project.update({
        where: { id: req.params.id },
        data: {
          name: name || undefined,
          description: description !== undefined ? (description || null) : undefined,
          color: color || undefined,
        },
      });

      return res.json(toMongoLikeProject(updated));
    }

    // Default: MongoDB
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    project.color = color || project.color;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const project = await Project.findById(req.params.id);
    // if (!project) return res.status(404).json({ message: 'Project not found' });
    // if (project.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    // await Todo.updateMany(
    //   { project: project._id },
    //   { $unset: { project: 1 } }
    // );
    // await project.deleteOne();
    // res.json({ message: 'Project removed' });

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const project = await prisma.project.findUnique({
        where: { id: req.params.id },
        select: { id: true, userId: true },
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.userId !== req.user._id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await prisma.todo.updateMany({
        where: { projectId: project.id },
        data: { projectId: null },
      });

      await prisma.project.delete({ where: { id: project.id } });
      return res.json({ message: 'Project removed' });
    }

    // Default: MongoDB
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Todo.updateMany(
      { project: project._id },
      { $unset: { project: 1 } }
    );

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};

