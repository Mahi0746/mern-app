const { ensureBadges } = require('../utils/profileManager');

const getBadgesCatalog = async (req, res) => {
  try {
    const badges = await ensureBadges();
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch badges' });
  }
};

module.exports = {
  getBadgesCatalog,
};

