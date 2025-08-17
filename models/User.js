const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  role: {
    type: String,
    enum: ['lecturer', 'student'], // Only lecturer or student allowed
    default: 'student'
  },

  mat_no: {
    type: String,
    required: function() { return this.role === 'student'; }, // Only lecturer or student allowed
    trim: true
  },

  department: {
    type: String,
    required: true,
    trim: true
  },

  level: {
    type: String,
    required: function() { return this.role === 'student'; }, // Only required for students
    enum: ['100L', '200L', '300L', '400L', '500L', '600L', 'ND', 'HND', 'MSc', 'PhD'], // Example levels
    trim: true
  }
}, { timestamps: true });// Adds createdAt and updatedAt automatically

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with stored password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
