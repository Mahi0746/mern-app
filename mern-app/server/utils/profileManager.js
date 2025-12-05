const Profile = require('../models/Profile');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');

const DEFAULT_USER_ID = 'demo-user';

const DEFAULT_BADGES = [
  {
    code: 'first-five',
    title: 'Starter Spark',
    description: 'Completed 5 tasks',
    icon: '✨',
    criteria: 'completedCount',
    threshold: 5,
  },
  {
    code: 'streak-3',
    title: 'Momentum Maker',
    description: '3-day completion streak',
    icon: '🔥',
    criteria: 'streakCount',
    threshold: 3,
  },
  {
    code: 'xp-500',
    title: 'XP Trailblazer',
    description: 'Earned 500 XP',
    icon: '🚀',
    criteria: 'xp',
    threshold: 500,
  },
];

const ensureProfile = async (userId = DEFAULT_USER_ID) => {
  const profile =
    (await Profile.findOne({ userId })) ||
    (await Profile.create({ userId, xp: 0, level: 1 }));
  return profile;
};

const ensureBadges = async () => {
  const existing = await Badge.find();
  if (existing.length === 0) {
    await Badge.insertMany(DEFAULT_BADGES);
  }
  return Badge.find();
};

const calculateLevel = (xp) => Math.max(1, Math.floor(xp / 100) + 1);

const awardBadgesIfNeeded = async (profile) => {
  const badges = await ensureBadges();
  const earned = [];

  for (const badge of badges) {
    const metric = profile[badge.criteria];
    if (metric >= badge.threshold) {
      const alreadyEarned = await UserBadge.findOne({
        userId: profile.userId,
        badgeId: badge._id,
      });
      if (!alreadyEarned) {
        const userBadge = await UserBadge.create({
          userId: profile.userId,
          badgeId: badge._id,
        });
        earned.push({ badge, userBadge });
      }
    }
  }

  return earned;
};

const updateProgressForCompletion = async (userId = DEFAULT_USER_ID) => {
  const profile = await ensureProfile(userId);

  const now = new Date();
  const lastDate = profile.lastCompletedAt
    ? new Date(profile.lastCompletedAt)
    : null;

  if (lastDate) {
    const diffInDays = Math.floor(
      (now.setHours(0, 0, 0, 0) - lastDate.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );
    profile.streakCount = diffInDays === 1 ? profile.streakCount + 1 : 1;
  } else {
    profile.streakCount = 1;
  }

  profile.lastCompletedAt = new Date();
  profile.completedCount += 1;
  profile.xp += 25;
  profile.level = calculateLevel(profile.xp);

  await profile.save();
  const newBadges = await awardBadgesIfNeeded(profile);

  return { profile, newBadges };
};

module.exports = {
  ensureProfile,
  updateProgressForCompletion,
  ensureBadges,
  DEFAULT_USER_ID,
};

