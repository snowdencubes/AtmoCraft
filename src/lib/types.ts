// Capacity Connect - Type Definitions
// SIH26075 - India Meteorological Department

export type Role = 'trainee' | 'trainer' | 'admin';

export type UserStatus = 'pending' | 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department: string;
  status: UserStatus;
  createdAt: string;
}

export interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: number;
  field: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Certificate {
  id: string;
  name: string;
  file: string;
  uploadedAt: string;
}

export interface Profile {
  userId: string;
  qualifications: Qualification[];
  workExperience: WorkExperience[];
  interests: string[];
  skills: string[];
  certificates: Certificate[];
  completionPercent: number;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: CourseLevel;
  trainerId: string;
  trainerName: string;
  duration: string;
  enrolled: number;
  rating: number;
  syllabus: string[];
  imageUrl: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
}

export type ResourceType = 'video' | 'pdf' | 'slides';

export interface Resource {
  id: string;
  courseId: string;
  title: string;
  type: ResourceType;
  url: string;
  size: string;
  uploadedAt: string;
  description: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Assessment {
  id: string;
  title: string;
  subject: string;
  courseId: string;
  questions: Question[];
  duration: number;
  createdAt: string;
}

export interface Attempt {
  id: string;
  assessmentId: string;
  userId: string;
  answers: number[];
  markedForReview: boolean[];
  score: number;
  total: number;
  startedAt: string;
  submittedAt: string;
}

export type QuestionnaireStatus = 'draft' | 'open' | 'closed';

export interface Questionnaire {
  id: string;
  title: string;
  subject: string;
  trainerId: string;
  questions: Question[];
  deadline: string;
  status: QuestionnaireStatus;
  createdAt: string;
}

export interface Feedback {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type AnnouncementType = 'notification' | 'announcement' | 'achievement' | 'new-content';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  pinned: boolean;
  published: boolean;
  createdAt: string;
}

export interface Competency {
  id: string;
  name: string;
  category: string;
}

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Expert';

export interface TrainerCompetency {
  trainerId: string;
  trainerName: string;
  competencyId: string;
  competencyName: string;
  proficiency: ProficiencyLevel;
}

export interface CertificationRecord {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  issuedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeCourses: number;
  totalEnrollments: number;
  certificationsIssued: number;
  pendingApprovals: number;
  averageScore: number;
  completionRate: number;
  monthlyEnrollments: { month: string; count: number }[];
  courseDistribution: { subject: string; count: number }[];
  assessmentScores: { course: string; avgScore: number }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
