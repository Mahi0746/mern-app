const express = require('express');
const { getBadgesCatalog } = require('../controllers/badgeController');

const router = express.Router();

router.get('/', getBadgesCatalog);

module.exports = router;

