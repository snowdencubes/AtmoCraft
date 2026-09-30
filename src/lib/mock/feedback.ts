// Demo seed data for AtmoCraft - SIH26075
// Mock feedback for the IMD Learning Portal

import { Feedback } from '@/lib/types';

export const mockFeedback: Feedback[] = [
  {
    id: 'f-1',
    courseId: 'c-1',
    userId: 'u-trainee-1',
    userName: 'Priya Sharma',
    rating: 5,
    comment: 'Excellent course! The section on data assimilation was particularly clear and helpful for my daily forecasting tasks.',
    createdAt: '2024-05-22'
  },
  {
    id: 'f-2',
    courseId: 'c-2',
    userId: 'u-trainee-2',
    userName: 'Arjun Patel',
    rating: 4,
    comment: 'Very good introduction to DWR. Would love to see more hands-on exercises with real anomalous propagation cases.',
    createdAt: '2024-06-10'
  },
  {
    id: 'f-3',
    courseId: 'c-7',
    userId: 'u-trainee-3',
    userName: 'Meera Krishnan',
    rating: 5,
    comment: 'The cybersecurity module was an eye-opener. Very relevant to our current data management practices.',
    createdAt: '2024-06-28'
  }
];
