const Team = require('../models/Team');
const Image = require('../models/Image');
const { deleteImage } = require('../config/cloudinary');

// Get all team members
const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      data: teamMembers,
      count: teamMembers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching team members',
      error: error.message
    });
  }
};

// Get single team member by ID
const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching team member',
      error: error.message
    });
  }
};

// Create new team member
const createTeamMember = async (req, res) => {
  try {
    const { name, position, bio, email, linkedin, twitter, order, imageUrl } = req.body;
    
    // Validate that we have an image URL
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Team member image URL is required'
      });
    }

    // TEMPORARY: Allow any image URL for testing (bypass database validation)
    console.log('⚠️  TEMPORARY: Allowing any image URL for testing');
    console.log('Image URL:', imageUrl);

    const teamMember = new Team({
      name,
      position,
      bio,
      image: imageUrl,
      email,
      linkedin,
      twitter,
      order: order || 0
    });

    const savedTeamMember = await teamMember.save();

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: savedTeamMember
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating team member',
      error: error.message
    });
  }
};

// Update team member
const updateTeamMember = async (req, res) => {
  try {
    const { name, position, bio, email, linkedin, twitter, order, isActive, imageUrl } = req.body;
    
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Update fields
    if (name) teamMember.name = name;
    if (position) teamMember.position = position;
    if (bio) teamMember.bio = bio;
    if (email) teamMember.email = email;
    if (linkedin) teamMember.linkedin = linkedin;
    if (twitter) teamMember.twitter = twitter;
    if (order !== undefined) teamMember.order = order;
    if (isActive !== undefined) teamMember.isActive = isActive;
    
    // Handle image update
    if (imageUrl && imageUrl !== teamMember.image) {
      // TEMPORARY: Allow any image URL for testing (bypass database validation)
      console.log('⚠️  TEMPORARY: Allowing any image URL for testing');
      console.log('New Image URL:', imageUrl);
      
      teamMember.image = imageUrl;
    }

    const updatedTeamMember = await teamMember.save();

    res.json({
      success: true,
      message: 'Team member updated successfully',
      data: updatedTeamMember
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating team member',
      error: error.message
    });
  }
};

// Delete team member
const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Note: We don't delete the image from Cloudinary here
    // because it might be used by other team members
    // You can implement cleanup logic if needed

    await Team.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting team member',
      error: error.message
    });
  }
};

// Soft delete (deactivate) team member
const deactivateTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    teamMember.isActive = false;
    await teamMember.save();

    res.json({
      success: true,
      message: 'Team member deactivated successfully',
      data: teamMember
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating team member',
      error: error.message
    });
  }
};

module.exports = {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  deactivateTeamMember
};
