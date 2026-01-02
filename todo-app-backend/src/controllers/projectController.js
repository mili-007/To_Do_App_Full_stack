const Project = require('../models/Project');
const Todo = require('../models/Todo');

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
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
    const project = await Project.findById(req.params.id)
      .populate('user', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user owns the project
    if (project.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Get all todos for this project (One-to-Many relationship)
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
    
    const project = await Project.create({
      user: req.user._id,
      name,
      description,
      color: color || '#3B82F6'
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
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user owns the project
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
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user owns the project
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Remove project reference from todos (set to null)
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

