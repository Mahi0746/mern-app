const express = require('express');
const {
  getProfile,
  getUserBadges,
} = require('../controllers/profileController');

const router = express.Router();

router.get('/', getProfile);
router.get('/badges', getUserBadges);

module.exports = router;

