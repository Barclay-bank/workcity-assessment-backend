const express = require('express');
const router = express.Router();

const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');

const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { validateClient } = require('../middlewares/validateClient');

router.get('/', authenticate, getClients);
router.get('/:id', authenticate, getClientById);

router.post('/', authenticate, authorize('admin'), createClient);
router.put('/:id', authenticate, authorize('admin'), updateClient);
router.delete('/:id', authenticate, authorize('admin'), deleteClient);

router.post('/', authenticate, authorize('admin'), validateClient, createClient);
router.put('/:id', authenticate, authorize('admin'), validateClient, updateClient);


module.exports = router;
