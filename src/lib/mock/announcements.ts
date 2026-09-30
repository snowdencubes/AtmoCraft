// Demo seed data for AtmoCraft - SIH26075
// Mock announcements for the IMD Learning Portal

import { Announcement } from '@/lib/types';

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Annual Radar Calibration Refresher Batch Open',
    content: 'The mandatory annual refresher course for all Radar Operations staff is now open for enrollment. Please complete the module by end of next month.',
    type: 'announcement',
    pinned: true,
    published: true,
    createdAt: '2024-09-28T09:00:00Z',
  },
  {
    id: 'ann-2',
    title: 'Monsoon Teleconnections & Machine Learning Masterclass',
    content: 'Join Dr. Sanjay Bhatt for an exclusive live masterclass on applying ML techniques to monsoon teleconnections data. Limited seats available.',
    type: 'notification',
    pinned: false,
    published: true,
    createdAt: '2024-09-25T14:30:00Z',
  },
  {
    id: 'ann-3',
    title: 'MoES Digital Skill Index Compliance Guidelines 2024-25',
    content: 'New guidelines have been published regarding the minimum digital skill index required for various roles within IMD.',
    type: 'announcement',
    pinned: false,
    published: true,
    createdAt: '2024-09-20T11:15:00Z',
  },
  {
    id: 'ann-4',
    title: 'Priya Sharma awarded Radar Specialist Level 3',
    content: 'Congratulations to Priya Sharma from the New Delhi RMC for successfully completing the rigorous Level 3 assessment in Doppler Radar operations.',
    type: 'achievement',
    pinned: false,
    published: true,
    createdAt: '2024-09-18T16:45:00Z',
  },
  {
    id: 'ann-5',
    title: 'New Course: Aviation Weather Hazards',
    content: 'A new advanced course on Aviation Weather Hazards and TAF preparation has been added to the catalogue. Enrolment is now open.',
    type: 'new-content',
    pinned: false,
    published: true,
    createdAt: '2024-09-15T10:00:00Z',
  },
  {
    id: 'ann-6',
    title: 'System Maintenance Downtime',
    content: 'AtmoCraft will undergo scheduled maintenance this Sunday between 02:00 AM and 04:00 AM IST. Please plan your learning activities accordingly.',
    type: 'notification',
    pinned: false,
    published: true,
    createdAt: '2024-09-29T18:00:00Z',
  }
];
