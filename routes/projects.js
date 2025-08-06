const express = require('express');
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByClient,
} = require('../controllers/projectController');

const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { validateProjectUpdate } = require('../middlewares/validateProject');


router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProjectById);
router.get('/client/:clientId', authenticate, getProjectsByClient);

router.post('/', authenticate, authorize('admin'), createProject);
router.put('/:id', authenticate, authorize('admin'), updateProject);
router.delete('/:id', authenticate, authorize('admin'), deleteProject);
router.put('/:id', authenticate, authorize('admin'), validateProjectUpdate, updateProject);
router.post('/', authenticate, authorize('admin'), validateProjectUpdate, createProject);


module.exports = router;
