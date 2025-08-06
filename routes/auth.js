const express = require('express');
const router = express.Router();
const { signup,
  login,
  getAllUsers,
  getUserById,
  getMe } = require('../controllers/authController');
  const authenticate = require('../middlewares/authenticate');

router.post('/signup', signup);

router.post('/login', login);


router.get('/users', authenticate, getAllUsers);
router.get('/users/:id', authenticate, getUserById);
router.get('/me', authenticate, getMe);


module.exports = router;
