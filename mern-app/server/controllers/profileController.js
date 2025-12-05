const { ensureProfile } = require('../utils/profileManager');
const UserBadge = require('../models/UserBadge');

const getProfile = async (req, res) => {
  try {
    const profile = await ensureProfile();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load profile' });
  }
};

const getUserBadges = async (req, res) => {
  try {
    const badges = await UserBadge.find({ userId: 'demo-user' }).populate(
      'badgeId'
    );
    res.json(
      badges.map((entry) => ({
        code: entry.badgeId.code,
        title: entry.badgeId.title,
        description: entry.badgeId.description,
        icon: entry.badgeId.icon,
        awardedAt: entry.awardedAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'Failed to load badges' });
  }
};

module.exports = {
  getProfile,
  getUserBadges,
};

