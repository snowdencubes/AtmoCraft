// Demo seed data for AtmoCraft - SIH26075
// Mock enrollments for the IMD Learning Portal

import { Enrollment } from '@/lib/types';

export const mockEnrollments: Enrollment[] = [
  // Trainee 1
  { id: 'e-1', courseId: 'c-1', userId: 'u-trainee-1', progress: 75, enrolledAt: '2024-04-05' },
  { id: 'e-2', courseId: 'c-2', userId: 'u-trainee-1', progress: 100, enrolledAt: '2024-04-10', completedAt: '2024-05-20' },
  { id: 'e-3', courseId: 'c-8', userId: 'u-trainee-1', progress: 20, enrolledAt: '2024-09-01' },
  // Trainee 2
  { id: 'e-4', courseId: 'c-2', userId: 'u-trainee-2', progress: 90, enrolledAt: '2024-04-12' },
  { id: 'e-5', courseId: 'c-4', userId: 'u-trainee-2', progress: 40, enrolledAt: '2024-05-15' },
  // Trainee 3
  { id: 'e-6', courseId: 'c-3', userId: 'u-trainee-3', progress: 60, enrolledAt: '2024-05-01' },
  { id: 'e-7', courseId: 'c-7', userId: 'u-trainee-3', progress: 100, enrolledAt: '2024-06-05', completedAt: '2024-06-25' },
];
