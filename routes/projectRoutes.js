import express from 'express';
import Project from '../models/Project.js';
import { ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Middleware to ensure all project routes are protected
router.use(ensureAuthenticated);

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.render('projects/index', { projects });
  } catch (error) {
    console.error(error);
    res.render('projects/index', { 
      projects: [],
      error: 'Error fetching projects'
    });
  }
});

// GET new project form
router.get('/new', (req, res) => {
  res.render('projects/new');
});

// POST create new project
router.post('/', async (req, res) => {
  try {
    const { projectName, description, deadline, status, teamMembers } = req.body;
    
    const newProject = new Project({
      projectName,
      description,
      deadline,
      status,
      teamMembers,
      createdBy: req.user._id
    });
    
    await newProject.save();
    res.redirect('/projects');
  } catch (error) {
    console.error(error);
    res.render('projects/new', {
      error: 'Error creating project',
      project: req.body
    });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!project) {
      return res.status(404).render('404');
    }
    
    res.render('projects/show', { project });
  } catch (error) {
    console.error(error);
    res.redirect('/projects');
  }
});

// GET edit project form
router.get('/:id/edit', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!project) {
      return res.status(404).render('404');
    }
    
    res.render('projects/edit', { project });
  } catch (error) {
    console.error(error);
    res.redirect('/projects');
  }
});

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const { description, deadline, status, teamMembers } = req.body;
    
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!project) {
      return res.status(404).render('404');
    }
    
    // Update fields (projectName cannot be edited)
    project.description = description;
    project.deadline = deadline;
    project.status = status;
    project.teamMembers = teamMembers;
    
    await project.save();
    res.redirect(`/projects/${project._id}`);
  } catch (error) {
    console.error(error);
    res.render('projects/edit', {
      error: 'Error updating project',
      project: { ...req.body, _id: req.params.id }
    });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    await Project.deleteOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    res.redirect('/projects');
  } catch (error) {
    console.error(error);
    res.redirect(`/projects/${req.params.id}`);
  }
});

export default router;