// Demo seed data for AtmoCraft - SIH26075
// Mock competencies for the IMD Learning Portal

import { Competency, TrainerCompetency } from '@/lib/types';

export const mockCompetencies: Competency[] = [
  { id: 'comp-1', name: 'Numerical Weather Prediction (NWP)', category: 'Modeling' },
  { id: 'comp-2', name: 'Radar Meteorology', category: 'Observation' },
  { id: 'comp-3', name: 'Satellite Data Analysis', category: 'Observation' },
  { id: 'comp-4', name: 'Climate Modeling', category: 'Climate' },
  { id: 'comp-5', name: 'Python for Data Science', category: 'IT & Tools' },
  { id: 'comp-6', name: 'Tropical Cyclone Forecasting', category: 'Forecasting' },
  { id: 'comp-7', name: 'Aviation Meteorology', category: 'Forecasting' },
];

export const mockTrainerCompetencies: TrainerCompetency[] = [
  {
    trainerId: 'u-trainer-1',
    trainerName: 'Dr. Rajesh Kumar',
    competencyId: 'comp-1',
    competencyName: 'Numerical Weather Prediction (NWP)',
    proficiency: 'Expert'
  },
  {
    trainerId: 'u-trainer-1',
    trainerName: 'Dr. Rajesh Kumar',
    competencyId: 'comp-5',
    competencyName: 'Python for Data Science',
    proficiency: 'Intermediate'
  },
  {
    trainerId: 'u-trainer-2',
    trainerName: 'Dr. Ananya Singh',
    competencyId: 'comp-2',
    competencyName: 'Radar Meteorology',
    proficiency: 'Expert'
  },
  {
    trainerId: 'u-trainer-2',
    trainerName: 'Dr. Ananya Singh',
    competencyId: 'comp-3',
    competencyName: 'Satellite Data Analysis',
    proficiency: 'Expert'
  },
  {
    trainerId: 'u-trainer-3',
    trainerName: 'Dr. Sanjay Bhatt',
    competencyId: 'comp-4',
    competencyName: 'Climate Modeling',
    proficiency: 'Expert'
  },
  {
    trainerId: 'u-trainer-3',
    trainerName: 'Dr. Sanjay Bhatt',
    competencyId: 'comp-5',
    competencyName: 'Python for Data Science',
    proficiency: 'Expert'
  },
  {
    trainerId: 'u-trainer-4',
    trainerName: 'Dr. Kavita Rao',
    competencyId: 'comp-6',
    competencyName: 'Tropical Cyclone Forecasting',
    proficiency: 'Expert'
  },
  {
    trainerId: 'u-trainer-4',
    trainerName: 'Dr. Kavita Rao',
    competencyId: 'comp-7',
    competencyName: 'Aviation Meteorology',
    proficiency: 'Intermediate'
  }
];
