import {
  User, Profile, Course, Enrollment, Resource, Assessment,
  Attempt, Questionnaire, Feedback, Announcement, Competency,
  TrainerCompetency, CertificationRecord, DashboardStats, Role
} from '@/lib/types';
import * as mocks from '@/lib/mock';
import { enrollmentsRepo, feedbackRepo, resourcesRepo } from '@/lib/db/repos';

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
  const all = await enrollmentsRepo.findAll();
  return all.filter((e: Enrollment) => e.userId === userId);
};

export const enrollInCourse = async (courseId: string, userId: string): Promise<boolean> => {
  await delay();
  await enrollmentsRepo.create({
    courseId,
    userId,
    progress: 0,
    viewedResources: [],
    enrolledAt: new Date().toISOString()
  } as Enrollment);
  return true;
};

export const markResourceViewed = async (courseId: string, userId: string, resourceId: string): Promise<void> => {
  await delay(200);
  const enrollments = await enrollmentsRepo.findAll();
  const enrollment = enrollments.find(e => e.courseId === courseId && e.userId === userId);
  if (!enrollment) return;

  const viewed = enrollment.viewedResources || [];
  if (!viewed.includes(resourceId)) {
    const updatedViewed = [...viewed, resourceId];
    
    // Calculate progress: share of resources opened + assessment (simplified: just resources for now)
    const allResources = await resourcesRepo.findAll();
    const courseResources = allResources.filter(r => r.courseId === courseId);
    
    const progress = courseResources.length > 0 
      ? Math.round((updatedViewed.length / courseResources.length) * 100) 
      : 100;

    await enrollmentsRepo.update(enrollment.id, {
      viewedResources: updatedViewed,
      progress
    });
  }
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
  const all = await feedbackRepo.findAll();
  return all.filter((f: Feedback) => f.courseId === courseId);
};

export const saveFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> => {
  await delay(300);
  const all = await feedbackRepo.findAll();
  const existing = all.find(f => f.courseId === feedback.courseId && f.userId === feedback.userId);
  
  if (existing) {
    const updated = await feedbackRepo.update(existing.id, feedback);
    return updated as Feedback;
  } else {
    const created = await feedbackRepo.create({
      ...feedback,
      createdAt: new Date().toISOString()
    } as Feedback);
    return created;
  }
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
