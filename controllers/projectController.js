const Project = require('../models/Project');
const Client = require('../models/Client');

exports.createProject = async (req, res) => {
  try {
    const { title, description, status, client, startDate, endDate } = req.body;

    if (!title || !client) {
      return res.status(400).json({ message: 'Title and client are required' });
    }

    const clientExists = await Client.findById(client);
    if (!clientExists) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (startDate && isNaN(Date.parse(startDate))) {
      return res.status(400).json({ message: 'Invalid start date format' });
    }
    
    if (endDate && isNaN(Date.parse(endDate))) {
      return res.status(400).json({ message: 'Invalid end date format' });
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const project = await Project.create({ 
      title, 
      description, 
      status, 
      client,
      startDate: startDate || null,
      endDate: endDate || null
    });

    res.status(201).json({ 
      message: 'Project created successfully',
      project 
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating project', 
      error: error.message 
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('client', 'name email')
      .sort({ startDate: 1 }); 
      
    res.json(projects);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching projects', 
      error: error.message 
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email phone');
      
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching project', 
      error: error.message 
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, description, status, client, startDate, endDate } = req.body;

    if (startDate && isNaN(Date.parse(startDate))) {
      return res.status(400).json({ message: 'Invalid start date format' });
    }
    
    if (endDate && isNaN(Date.parse(endDate))) {
      return res.status(400).json({ message: 'Invalid end date format' });
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const updateData = {
      title,
      description,
      status,
      client,
      startDate: startDate || null,
      endDate: endDate || null
    };

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ 
      message: 'Project updated successfully',
      project 
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating project', 
      error: error.message 
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ 
      message: 'Project deleted successfully',
      deletedProject: project 
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting project', 
      error: error.message 
    });
  }
};

exports.getProjectsByClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    
    const clientExists = await Client.findById(clientId);
    if (!clientExists) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const projects = await Project.find({ client: clientId })
      .populate('client', 'name email')
      .sort({ startDate: 1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching projects for client', 
      error: error.message 
    });
  }
};