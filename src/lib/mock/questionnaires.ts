// Demo seed data for Capacity Connect - SIH26075
// Mock questionnaires for the IMD Learning Portal

import { Questionnaire } from '@/lib/types';

export const mockQuestionnaires: Questionnaire[] = [
  {
    id: 'qn-1',
    title: 'Pre-training Assessment: Cyclone Tracking',
    subject: 'Cyclone Meteorology',
    trainerId: 'u-trainer-4',
    deadline: '2024-11-30T23:59:59Z',
    status: 'open',
    createdAt: '2024-10-15T10:00:00Z',
    questions: [
      {
        id: 'qn-1-q1',
        text: 'What is the minimum wind speed required for a system to be classified as a Cyclonic Storm in the North Indian Ocean?',
        options: [
          '25 knots',
          '34 knots',
          '48 knots',
          '64 knots'
        ],
        correctIndex: 1
      },
      {
        id: 'qn-1-q2',
        text: 'Which organization is responsible for naming tropical cyclones in the North Indian Ocean?',
        options: [
          'WMO',
          'RSMC New Delhi',
          'JTWC',
          'National Hurricane Center'
        ],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'qn-2',
    title: 'Feedback Survey: New Radar Calibration SOP',
    subject: 'Radar Meteorology',
    trainerId: 'u-trainer-2',
    deadline: '2024-09-15T23:59:59Z',
    status: 'closed',
    createdAt: '2024-08-01T10:00:00Z',
    questions: [
      {
        id: 'qn-2-q1',
        text: 'Did you find the new calibration SOP easier to follow than the previous version?',
        options: [
          'Yes, much easier',
          'Yes, slightly easier',
          'About the same',
          'No, harder to follow'
        ],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'qn-3',
    title: 'Draft: NWP Post-processing techniques',
    subject: 'Numerical Weather Prediction',
    trainerId: 'u-trainer-1',
    deadline: '2025-01-15T23:59:59Z',
    status: 'draft',
    createdAt: '2024-11-01T10:00:00Z',
    questions: []
  }
];
