import { profilesRepo } from '../db/repos';
import { Profile } from '../types';

export const profileService = {
  getProfile: async (userId: string) => {
    let profile = await profilesRepo.findByUserId(userId);
    if (!profile) {
      profile = await profilesRepo.create({
        userId,
        qualifications: [],
        workExperience: [],
        interests: [],
        skills: [],
        certificates: [],
        completionPercent: 0,
      });
    }
    return profile;
  },

  updateProfile: async (userId: string, data: Partial<Profile>) => {
    const currentProfile = await profileService.getProfile(userId);
    const updated = { ...currentProfile, ...data };
    
    let filledSections = 0;
    if (updated.qualifications?.length > 0) filledSections++;
    if (updated.workExperience?.length > 0) filledSections++;
    if (updated.interests?.length > 0) filledSections++;
    if (updated.skills?.length > 0) filledSections++;
    if (updated.certificates?.length > 0) filledSections++;
    
    updated.completionPercent = (filledSections / 5) * 100;
    
    return profilesRepo.update(userId, updated);
  }
};
