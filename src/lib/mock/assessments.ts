// Demo seed data for AtmoCraft - SIH26075
// Mock assessments for the IMD Learning Portal

import { Assessment } from '@/lib/types';

export const mockAssessments: Assessment[] = [
  {
    id: 'a-1',
    title: 'NWP Fundamentals Quiz',
    subject: 'Numerical Weather Prediction',
    courseId: 'c-1',
    duration: 30,
    createdAt: '2024-03-25',
    questions: [
      {
        id: 'q-1-1',
        text: 'Which set of equations forms the core of most Numerical Weather Prediction models?',
        options: [
          'Navier-Stokes equations',
          "Maxwell's equations",
          'Primitive equations',
          'Schrödinger equation'
        ],
        correctIndex: 2,
        explanation: 'The primitive equations are a set of nonlinear differential equations that are used to approximate global atmospheric flow and are used in most atmospheric models.'
      },
      {
        id: 'q-1-2',
        text: 'What is the primary purpose of data assimilation in NWP?',
        options: [
          'To compress the model output data',
          'To combine observations with a short-range forecast to create initial conditions',
          'To visualize the model results',
          'To increase the horizontal resolution of the model'
        ],
        correctIndex: 1,
        explanation: 'Data assimilation is the process by which observations are incorporated into a computer model of a real system, to create an optimal estimate of the current state.'
      },
      {
        id: 'q-1-3',
        text: 'What does WRF stand for?',
        options: [
          'Weather Research and Forecasting',
          'World Radar Foundation',
          'Wind and Rain Forecasting',
          'Weather Reporting Facility'
        ],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'a-2',
    title: 'Doppler Weather Radar Interpretation',
    subject: 'Radar Meteorology',
    courseId: 'c-2',
    duration: 45,
    createdAt: '2024-04-10',
    questions: [
      {
        id: 'q-2-1',
        text: 'What is the primary advantage of Doppler radar over conventional radar?',
        options: [
          'It can measure the chemical composition of clouds',
          'It can measure the velocity of precipitation particles along the radar beam',
          'It has a much longer range',
          'It is cheaper to operate'
        ],
        correctIndex: 1,
        explanation: 'Doppler radars can measure the radial velocity of targets by detecting the shift in frequency (Doppler shift) of the returned signal.'
      },
      {
        id: 'q-2-2',
        text: 'In a base velocity image, what do red/warm colors typically represent?',
        options: [
          'Heavy rainfall',
          'Motion towards the radar',
          'Motion away from the radar',
          'Hail'
        ],
        correctIndex: 2,
        explanation: 'By convention, warm colors (reds) represent motion away from the radar, and cool colors (greens) represent motion towards the radar.'
      },
      {
        id: 'q-2-3',
        text: 'What causes the "bright band" signature on a radar display?',
        options: [
          'Ground clutter',
          'Anomalous propagation (AP)',
          'Melting snowflakes falling through the 0°C isotherm',
          'Birds or insects'
        ],
        correctIndex: 2
      }
    ]
  },
  {
    id: 'a-3',
    title: 'Python for Climate Data Assessment',
    subject: 'Climate Science',
    courseId: 'c-3',
    duration: 60,
    createdAt: '2024-05-20',
    questions: [
      {
        id: 'q-3-1',
        text: 'Which Python library is specifically designed for working with multi-dimensional arrays, commonly used for NetCDF climate data?',
        options: [
          'Pandas',
          'Matplotlib',
          'Xarray',
          'Scikit-learn'
        ],
        correctIndex: 2,
        explanation: 'Xarray introduces labels in the form of dimensions, coordinates and attributes on top of raw NumPy-like arrays, making it ideal for NetCDF data.'
      },
      {
        id: 'q-3-2',
        text: 'What is the primary function of Cartopy in meteorology applications?',
        options: [
          'Statistical analysis',
          'Geospatial data processing and map drawing',
          'Machine learning',
          'Downloading climate datasets'
        ],
        correctIndex: 1,
        explanation: 'Cartopy is a Python package designed for geospatial data processing in order to produce maps and other geospatial data analyses.'
      }
    ]
  }
];
