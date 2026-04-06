const Project = require('../models/Project');

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const { category, limit, page } = req.query;
    const filter = { isActive: true };
    
    if (category && typeof category === 'string' && ['residential', 'commercial'].includes(category.toLowerCase())) {
      filter.category = category.toLowerCase();
    }

    // Pagination setup
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 20; // Default: 20 projects per page
    const skip = (parsedPage - 1) * parsedLimit;

    // Get total count for pagination info
    const totalCount = await Project.countDocuments(filter);

    // Fetch paginated projects with field selection (exclude large fields for list view)
    const projects = await Project.find(filter)
      .select('title category description location completionYear client featuredImage order isActive createdAt')
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    res.json({
      success: true,
      data: projects,
      count: projects.length,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(totalCount / parsedLimit),
        totalRecords: totalCount,
        limit: parsedLimit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// Get single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      location,
      completionYear,
      client,
      images,
      videos,
      technologies,
      materials,
      featuredImage,
      order
    } = req.body;

    if (!title || !category || !description || !location || !completionYear || !client || !featuredImage) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    if (!['residential', 'commercial'].includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Category must be either residential or commercial'
      });
    }

    const project = new Project({
      title,
      category: category.toLowerCase(),
      description,
      location,
      completionYear,
      client,
      images: images || [],
      videos: videos || [],
      technologies: technologies || [],
      materials: materials || [],
      featuredImage,
      order: order || 0
    });

    const savedProject = await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: savedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      location,
      completionYear,
      client,
      images,
      videos,
      technologies,
      materials,
      featuredImage,
      order,
      isActive
    } = req.body;

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update fields
    if (title) project.title = title;
    if (category) {
      if (!['residential', 'commercial'].includes(category.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Category must be either residential or commercial'
        });
      }
      project.category = category.toLowerCase();
    }
    if (description) project.description = description;
    if (location) project.location = location;
    if (completionYear) project.completionYear = completionYear;
    if (client) project.client = client;
    if (images) project.images = images;
    if (videos) project.videos = videos;
    if (technologies) project.technologies = technologies;
    if (materials) project.materials = materials;
    if (featuredImage) project.featuredImage = featuredImage;
    if (order !== undefined) project.order = order;
    if (isActive !== undefined) project.isActive = isActive;

    const updatedProject = await project.save();

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

// Deactivate project (soft delete)
const deactivateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.isActive = false;
    await project.save();

    res.json({
      success: true,
      message: 'Project deactivated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating project',
      error: error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deactivateProject
};
