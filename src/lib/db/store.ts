import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User, Profile, Course, Enrollment, Resource, Assessment,
  Question, Attempt, Questionnaire, Feedback, Announcement,
  Competency, TrainerCompetency, CertificationRecord, Notification
} from '@/lib/types';
import * as mockData from '@/lib/mock';

// Define the interface for questionnaire responses since it's not in types.ts
export interface QuestionnaireResponse {
  id: string;
  questionnaireId: string;
  userId: string;
  answers: Record<string, string | number>;
  submittedAt: string;
}

interface DbState {
  users: User[];
  profiles: Profile[];
  courses: Course[];
  enrollments: Enrollment[];
  resources: Resource[];
  assessments: Assessment[];
  questions: Question[];
  attempts: Attempt[];
  questionnaires: Questionnaire[];
  questionnaire_responses: QuestionnaireResponse[];
  feedback: Feedback[];
  announcements: Announcement[];
  competencies: Competency[];
  trainer_competencies: TrainerCompetency[];
  certification_records: CertificationRecord[];
  notifications: Notification[];

  // Actions
  resetDemoData: () => void;
  // Generic setter could be useful, but not strictly required.
  setTable: <K extends keyof Omit<DbState, 'resetDemoData' | 'setTable'>>(
    table: K,
    data: DbState[K]
  ) => void;
}

export const useDbStore = create<DbState>()(
  persist(
    (set) => ({
      users: [],
      profiles: [],
      courses: [],
      enrollments: [],
      resources: [],
      assessments: [],
      questions: [],
      attempts: [],
      questionnaires: [],
      questionnaire_responses: [],
      feedback: [],
      announcements: [],
      competencies: [],
      trainer_competencies: [],
      certification_records: [],
      notifications: [],

      resetDemoData: () => {
        set({
          users: mockData.mockUsers || [],
          courses: mockData.mockCourses || [],
          resources: mockData.mockResources || [],
          assessments: mockData.mockAssessments || [],
          questionnaires: mockData.mockQuestionnaires || [],
          enrollments: mockData.mockEnrollments || [],
          announcements: mockData.mockAnnouncements || [],
          feedback: mockData.mockFeedback || [],
          competencies: mockData.mockCompetencies || [],
          trainer_competencies: mockData.mockTrainerCompetencies || [],
          certification_records: mockData.mockCertifications || [],
          // Reset the others to empty arrays
          profiles: [],
          questions: [],
          attempts: [],
          questionnaire_responses: [],
          notifications: [],
        });
      },

      setTable: (table, data) => set((state) => ({ ...state, [table]: data })),
    }),
    {
      name: 'capacity-connect-demo-v1',
    }
  )
);
