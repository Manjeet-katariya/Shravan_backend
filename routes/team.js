const express = require('express');
const router = express.Router();
const {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  deactivateTeamMember
} = require('../controllers/teamController');

// GET /api/team - Get all team members
router.get('/', getAllTeamMembers);

// GET /api/team/:id - Get single team member
router.get('/:id', getTeamMemberById);

// POST /api/team - Create new team member (JSON only)
router.post('/', createTeamMember);

// PUT /api/team/:id - Update team member (JSON only)
router.put('/:id', updateTeamMember);

// DELETE /api/team/:id - Delete team member permanently
router.delete('/:id', deleteTeamMember);

// PATCH /api/team/:id/deactivate - Deactivate team member (soft delete)
router.patch('/:id/deactivate', deactivateTeamMember);

module.exports = router;
