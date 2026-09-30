// Demo seed data for Capacity Connect - SIH26075
// Mock certifications for the IMD Learning Portal

import { CertificationRecord } from '@/lib/types';

export const mockCertifications: CertificationRecord[] = [
  {
    id: 'cert-1',
    userId: 'u-trainee-1',
    userName: 'Priya Sharma',
    courseId: 'c-2',
    courseName: 'Doppler Weather Radar Basics',
    issuedAt: '2024-05-21'
  },
  {
    id: 'cert-2',
    userId: 'u-trainee-3',
    userName: 'Meera Krishnan',
    courseId: 'c-7',
    courseName: 'Data Management and Cybersecurity Basics',
    issuedAt: '2024-06-26'
  }
];
