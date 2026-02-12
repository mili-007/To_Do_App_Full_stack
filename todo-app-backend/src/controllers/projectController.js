const Project = require('../models/Project');
const Todo = require('../models/Todo');

// Get all projects for a user
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

// Get a single project with todos
const getProject = async (req, res) => {
  try {
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

//  Create a project
const createProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await Project.create({
      user: req.user._id,
      name: trimmedName,
      description: typeof description === 'string' ? description.trim() : description,
      color: color || '#3B82F6'
    });
    
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (name !== undefined) {
      const trimmedName = typeof name === 'string' ? name.trim() : '';
      if (!trimmedName) {
        return res.status(400).json({ message: 'Project name is required' });
      }
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (name !== undefined) project.name = typeof name === 'string' ? name.trim() : project.name;
    project.description = description !== undefined ? (typeof description === 'string' ? description.trim() : description) : project.description;
    project.color = color || project.color;
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
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
