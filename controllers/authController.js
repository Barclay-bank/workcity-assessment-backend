const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, mat_no, role, department, level } = req.body;

    // Only allow lecturer or student roles
    if (!['lecturer', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be lecturer or student.' });
    }

    // Validate level is provided for students
    if (role === 'student' && !level) {
      return res.status(400).json({ message: 'Level is required for students' });
    }

    // Validate mat_no is provided for students
    if (role === 'student' && !mat_no) {
      return res.status(400).json({ message: 'Matriculation number is required for students' });
    }

    // Validate department is provided
    if (!department) {
      return res.status(400).json({ message: 'Department is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ 
      name, 
      email, 
      password, 
      mat_no: role === 'student' ? mat_no : undefined, // Only set mat_no for students
      phone,
      role,
      department,
      level: role === 'student' ? level : undefined // Only set level for students
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'User created successfully',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        mat_no: user.mat_no, 
        role: user.role,
        phone: user.phone,
        department: user.department,
        level: user.level 
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};
// Login
// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First check if user exists at all
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user is trying to login with wrong role
    // Get the opposite role of what they're trying to login as
    const oppositeRole = user.role === 'student' ? 'lecturer' : 'student';
    
    // Check if there's a user with same email but different role
    const oppositeRoleUser = await User.findOne({ 
      email,
      role: oppositeRole 
    });

    if (oppositeRoleUser) {
      return res.status(400).json({ 
        message: `This email is registered as a ${oppositeRole}. Please login using the ${oppositeRole} portal.` 
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        department: user.department,
        level: user.level,
        mat_no: user.mat_no,
        phone: user.phone
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
};

// Get all users - Only lecturers can access this
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'lecturer') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const users = await User.find().select('-password -__v'); 
    res.status(200).json({
      message: 'Users retrieved successfully',
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
};

// Get user by ID - Lecturer can view anyone, student can only view self
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.role !== 'lecturer' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: error.message 
    });
  }
};

// Get profile (self)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -__v');
    
    res.status(200).json({
      message: 'User profile retrieved successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
};

// Delete user - Only lecturers can delete users
exports.deleteUser = async (req, res) => {
  try {
    // Check if requester is a lecturer
    if (req.user.role !== 'lecturer') {
      return res.status(403).json({ 
        message: 'Unauthorized - Only lecturers can delete users' 
      });
    }

    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deletion of other lecturers (optional)
    if (user.role === 'lecturer' && req.user._id.toString() !== userId) {
      return res.status(403).json({ 
        message: 'Unauthorized - Cannot delete other lecturers' 
      });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting user', 
      error: error.message 
    });
  }
};