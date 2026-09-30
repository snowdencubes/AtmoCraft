import { useDbStore } from './store';

type HasId = { id?: string } & Record<string, any>;

function createRepo<T extends HasId>(tableName: keyof Omit<ReturnType<typeof useDbStore.getState>, 'resetDemoData' | 'setTable'>) {
  return {
    findAll: async (): Promise<T[]> => {
      const state = useDbStore.getState();
      return (state[tableName] as T[]) || [];
    },
    
    findById: async (id: string): Promise<T | undefined> => {
      const state = useDbStore.getState();
      const records = state[tableName] as T[];
      return records.find((record) => record.id === id);
    },
    
    create: async (data: T): Promise<T> => {
      const state = useDbStore.getState();
      const records = state[tableName] as T[];
      
      const newRecord = {
        ...data,
        id: data.id || crypto.randomUUID(),
      };
      
      useDbStore.getState().setTable(tableName, [...records, newRecord] as any);
      return newRecord;
    },
    
    update: async (id: string, data: Partial<T>): Promise<T | undefined> => {
      const state = useDbStore.getState();
      const records = state[tableName] as T[];
      const index = records.findIndex((record) => record.id === id);
      
      if (index === -1) return undefined;
      
      const updatedRecord = { ...records[index], ...data };
      const newRecords = [...records];
      newRecords[index] = updatedRecord;
      
      useDbStore.getState().setTable(tableName, newRecords as any);
      return updatedRecord;
    },
    
    delete: async (id: string): Promise<boolean> => {
      const state = useDbStore.getState();
      const records = state[tableName] as T[];
      const index = records.findIndex((record) => record.id === id);
      
      if (index === -1) return false;
      
      const newRecords = records.filter((record) => record.id !== id);
      useDbStore.getState().setTable(tableName, newRecords as any);
      return true;
    }
  };
}

import {
  User, Profile, Course, Enrollment, Resource, Assessment,
  Question, Attempt, Questionnaire, Feedback, Announcement,
  Competency, TrainerCompetency, CertificationRecord, Notification
} from '@/lib/types';
import { QuestionnaireResponse } from './store';

export const baseUsersRepo = createRepo<User>('users');
export const usersRepo = {
  ...baseUsersRepo,
  findByEmail: async (email: string) => {
    const users = await baseUsersRepo.findAll();
    return users.find((u: User) => u.email === email);
  }
};

export const profilesRepo = {
  findAll: async () => useDbStore.getState().profiles,
  findByUserId: async (userId: string) => useDbStore.getState().profiles.find(p => p.userId === userId),
  create: async (data: Profile) => {
    const current = useDbStore.getState().profiles;
    useDbStore.getState().setTable('profiles', [...current, data]);
    return data;
  },
  update: async (userId: string, data: Partial<Profile>) => {
    const current = useDbStore.getState().profiles;
    const index = current.findIndex(p => p.userId === userId);
    if (index === -1) return undefined;
    const updated = { ...current[index], ...data };
    const newRecords = [...current];
    newRecords[index] = updated;
    useDbStore.getState().setTable('profiles', newRecords);
    return updated;
  },
  delete: async (userId: string) => {
    const current = useDbStore.getState().profiles;
    const initialLen = current.length;
    const newRecords = current.filter(p => p.userId !== userId);
    useDbStore.getState().setTable('profiles', newRecords);
    return newRecords.length < initialLen;
  }
};

export const coursesRepo = createRepo<Course>('courses');
export const enrollmentsRepo = createRepo<Enrollment>('enrollments');
export const resourcesRepo = createRepo<Resource>('resources');
export const assessmentsRepo = createRepo<Assessment>('assessments');
export const questionsRepo = createRepo<Question>('questions');
export const attemptsRepo = createRepo<Attempt>('attempts');
export const questionnairesRepo = createRepo<Questionnaire>('questionnaires');
export const questionnaireResponsesRepo = createRepo<QuestionnaireResponse>('questionnaire_responses');
export const feedbackRepo = createRepo<Feedback>('feedback');
export const announcementsRepo = createRepo<Announcement>('announcements');
export const competenciesRepo = createRepo<Competency>('competencies');
export const trainerCompetenciesRepo = {
  findAll: async () => useDbStore.getState().trainer_competencies,
  findByTrainerId: async (trainerId: string) => useDbStore.getState().trainer_competencies.filter(tc => tc.trainerId === trainerId),
  create: async (data: TrainerCompetency) => {
    const current = useDbStore.getState().trainer_competencies;
    useDbStore.getState().setTable('trainer_competencies', [...current, data]);
    return data;
  },
  delete: async (trainerId: string, competencyId: string) => {
    const current = useDbStore.getState().trainer_competencies;
    const initialLen = current.length;
    const newRecords = current.filter(tc => !(tc.trainerId === trainerId && tc.competencyId === competencyId));
    useDbStore.getState().setTable('trainer_competencies', newRecords);
    return newRecords.length < initialLen;
  }
};
export const certificationRecordsRepo = createRepo<CertificationRecord>('certification_records');
export const notificationsRepo = createRepo<Notification>('notifications');
