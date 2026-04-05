const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deactivateProject
} = require('../controllers/projectController');

// GET /api/projects - Get all projects (with optional category filter)
router.get('/', getAllProjects);

// GET /api/projects/:id - Get single project
router.get('/:id', getProjectById);

// POST /api/projects - Create new project
router.post('/', createProject);

// PUT /api/projects/:id - Update project
router.put('/:id', updateProject);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', deleteProject);

// PATCH /api/projects/:id/deactivate - Deactivate project
router.patch('/:id/deactivate', deactivateProject);

module.exports = router;
