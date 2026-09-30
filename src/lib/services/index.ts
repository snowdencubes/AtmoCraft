import {
  User, Profile, Course, Enrollment, Resource, Assessment,
  Attempt, Questionnaire, Feedback, Announcement, Competency,
  TrainerCompetency, CertificationRecord, DashboardStats, Role
} from '@/lib/types';
import * as mocks from '@/lib/mock';

const DELAY = 500;
const delay = (ms: number = DELAY) => new Promise(r => setTimeout(r, ms));

// Users
export const getUsers = async (): Promise<User[]> => {
  await delay();
  return mocks.mockUsers;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  await delay();
  return mocks.mockUsers.find(u => u.id === id);
};

// Courses
export const getCourses = async (): Promise<Course[]> => {
  await delay();
  return mocks.mockCourses;
};

export const getCourseById = async (id: string): Promise<Course | undefined> => {
  await delay();
  return mocks.mockCourses.find(c => c.id === id);
};

// Enrollments
export const getEnrollments = async (userId: string): Promise<Enrollment[]> => {
  await delay();
  return mocks.mockEnrollments.filter(e => e.userId === userId);
};

export const enrollInCourse = async (courseId: string, userId: string): Promise<boolean> => {
  await delay();
  console.log(`User ${userId} enrolled in ${courseId}`);
  return true;
};

// Resources
export const getResources = async (): Promise<Resource[]> => {
  await delay();
  return mocks.mockResources;
};

export const getResourcesByCourse = async (courseId: string): Promise<Resource[]> => {
  await delay();
  return mocks.mockResources.filter(r => r.courseId === courseId);
};

// Assessments
export const getAssessments = async (): Promise<Assessment[]> => {
  await delay();
  return mocks.mockAssessments;
};

export const getAssessmentById = async (id: string): Promise<Assessment | undefined> => {
  await delay();
  return mocks.mockAssessments.find(a => a.id === id);
};

// Questionnaires
export const getQuestionnaires = async (): Promise<Questionnaire[]> => {
  await delay();
  return mocks.mockQuestionnaires;
};

// Feedback
export const getFeedback = async (courseId: string): Promise<Feedback[]> => {
  await delay();
  return mocks.mockFeedback.filter(f => f.courseId === courseId);
};

// Announcements
export const getAnnouncements = async (): Promise<Announcement[]> => {
  await delay();
  return mocks.mockAnnouncements;
};

// Competencies & Trainers
export const getCompetencies = async (): Promise<Competency[]> => {
  await delay();
  return mocks.mockCompetencies;
};

export const getTrainerCompetencies = async (): Promise<TrainerCompetency[]> => {
  await delay();
  return mocks.mockTrainerCompetencies;
};

// Certifications
export const getCertifications = async (): Promise<CertificationRecord[]> => {
  await delay();
  return mocks.mockCertifications;
};

// Dashboard Stats (Admin)
export const getDashboardStats = async (): Promise<DashboardStats> => {
  await delay();
  return {
    totalUsers: mocks.mockUsers.length,
    activeCourses: mocks.mockCourses.length,
    totalEnrollments: mocks.mockEnrollments.length,
    certificationsIssued: mocks.mockCertifications.length,
    pendingApprovals: mocks.mockUsers.filter(u => u.status === 'pending').length,
    averageScore: 82.5,
    completionRate: 68.4,
    monthlyEnrollments: [
      { month: 'Jan', count: 45 },
      { month: 'Feb', count: 52 },
      { month: 'Mar', count: 86 },
      { month: 'Apr', count: 120 },
      { month: 'May', count: 95 },
      { month: 'Jun', count: 142 },
    ],
    courseDistribution: [
      { subject: 'NWP', count: 35 },
      { subject: 'Radar', count: 25 },
      { subject: 'Climate', count: 20 },
      { subject: 'Cyclone', count: 15 },
      { subject: 'Agromet', count: 5 },
    ],
    assessmentScores: [
      { course: 'NWP Intro', avgScore: 78 },
      { course: 'Radar Basics', avgScore: 85 },
      { course: 'Climate Analysis', avgScore: 72 },
      { course: 'Cyclone Comms', avgScore: 88 },
      { course: 'Agromet Advisory', avgScore: 92 },
    ]
  };
};
