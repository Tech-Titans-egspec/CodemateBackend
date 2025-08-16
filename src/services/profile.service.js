import Profile from "../models/profile.model.js";


export const findMatches = async (userId) => {
  // Fetch current user's profile
  const currentProfile = await Profile.findOne({ user: userId });
  if (!currentProfile) throw new Error("Profile not found");

  // Match developers with at least 1 common skill + same location
  const matches = await Profile.find({
    user: { $ne: userId }, // exclude self
    isPublic: true, // only public profiles
    location: currentProfile.location, // match by location
    skills: { $in: currentProfile.skills }, // at least one skill matches
  }).lean();

  // Sort matches by number of common skills
  const sortedMatches = matches.sort((a, b) => {
    const commonSkillsA = a.skills.filter(skill =>
      currentProfile.skills.includes(skill)
    ).length;
    const commonSkillsB = b.skills.filter(skill =>
      currentProfile.skills.includes(skill)
    ).length;
    return commonSkillsB - commonSkillsA; 
  });

  return sortedMatches;
};


export const createOrUpdateProfile = async (userId, profileData) => {
  return await Profile.findOneAndUpdate(
    { user: userId },
    { $set: profileData },
    { new: true, upsert: true } // create if not exists
  );
};

export const getProfileByUserId = async (userId) => {
  return await Profile.findOne({ user: userId }).populate("user", "username email");
};

export const getAllProfiles = async () => {
  return await Profile.find({ isPublic: true }).populate("user", "username email");
};

export const deleteProfile = async (userId) => {
  return await Profile.findOneAndDelete({ user: userId });
};
