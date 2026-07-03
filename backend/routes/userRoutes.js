const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validateProfileUpdate } = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect); // every route below requires a valid JWT

router.get('/profile', getProfile);
router.put('/profile', validateProfileUpdate, updateProfile);

module.exports = router;
