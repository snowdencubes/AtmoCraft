import { supabase } from '@/lib/supabase';
import {
  User, Profile, Course, Enrollment, Resource, Assessment,
  Question, Attempt, Questionnaire, Feedback, Announcement,
  Competency, TrainerCompetency, CertificationRecord, Notification
} from '@/lib/types';

export interface QuestionnaireResponse {
  id: string;
  questionnaireId: string;
  userId: string;
  answers: Record<string, string | number>;
  submittedAt: string;
}

type HasId = { id?: string } & Record<string, any>;

function createRepo<T extends HasId>(tableName: string) {
  return {
    findAll: async (): Promise<T[]> => {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) throw error;
      return data as T[];
    },
    
    findById: async (id: string): Promise<T | undefined> => {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as T | undefined;
    },
    
    create: async (data: T): Promise<T> => {
      const { data: inserted, error } = await supabase
        .from(tableName)
        .insert({ ...data, id: data.id || crypto.randomUUID() })
        .select()
        .single();
      if (error) throw error;
      return inserted as T;
    },
    
    update: async (id: string, data: Partial<T>): Promise<T | undefined> => {
      const { data: updated, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return updated as T | undefined;
    },
    
    delete: async (id: string): Promise<boolean> => {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return true;
    }
  };
}

export const baseUsersRepo = createRepo<User>('users');
export const usersRepo = {
  ...baseUsersRepo,
  findByEmail: async (email: string) => {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as User | undefined;
  }
};

export const profilesRepo = {
  findAll: async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    return data as Profile[];
  },
  findByUserId: async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('userId', userId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as Profile | undefined;
  },
  create: async (data: Profile) => {
    const { data: inserted, error } = await supabase.from('profiles').insert(data).select().single();
    if (error) throw error;
    return inserted as Profile;
  },
  update: async (userId: string, data: Partial<Profile>) => {
    const { data: updated, error } = await supabase.from('profiles').update(data).eq('userId', userId).select().single();
    if (error) throw error;
    return updated as Profile | undefined;
  },
  delete: async (userId: string) => {
    const { error } = await supabase.from('profiles').delete().eq('userId', userId);
    if (error) throw error;
    return true;
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
  findAll: async () => {
    const { data, error } = await supabase.from('trainer_competencies').select('*');
    if (error) throw error;
    return data as TrainerCompetency[];
  },
  findByTrainerId: async (trainerId: string) => {
    const { data, error } = await supabase.from('trainer_competencies').select('*').eq('trainerId', trainerId);
    if (error) throw error;
    return data as TrainerCompetency[];
  },
  create: async (data: TrainerCompetency) => {
    const { data: inserted, error } = await supabase.from('trainer_competencies').insert(data).select().single();
    if (error) throw error;
    return inserted as TrainerCompetency;
  },
  delete: async (trainerId: string, competencyId: string) => {
    const { error } = await supabase.from('trainer_competencies').delete().eq('trainerId', trainerId).eq('competencyId', competencyId);
    if (error) throw error;
    return true;
  }
};

export const certificationRecordsRepo = createRepo<CertificationRecord>('certification_records');
export const notificationsRepo = createRepo<Notification>('notifications');
