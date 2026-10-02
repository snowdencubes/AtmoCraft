import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role for bypass RLS

const supabase = createClient(supabaseUrl, supabaseKey);

const mockCourses = [
  {
    id: 'c-1',
    title: 'Introduction to Numerical Weather Prediction',
    description: 'Learn the fundamentals of NWP models including WRF, GFS, and ECMWF. Understand model initialization, data assimilation, and output interpretation for operational weather forecasting.',
    subject: 'Numerical Weather Prediction',
    level: 'Intermediate',
    trainerId: 'trainer-1',
    trainerName: 'Dr. Rajesh Kumar',
    duration: '8 weeks',
    enrolled: 45,
    rating: 4.6,
    syllabus: [
      'Fundamentals of atmospheric dynamics',
      'NWP model architectures (WRF, GFS, ECMWF)',
      'Data assimilation techniques',
      'Model initialization and boundary conditions',
      'Post-processing and verification'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2070',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c-2',
    title: 'Doppler Weather Radar Basics',
    description: 'Comprehensive training on Doppler weather radar technology, data interpretation, and applications in severe weather monitoring across Indian radar network.',
    subject: 'Radar Meteorology',
    level: 'Beginner',
    trainerId: 'trainer-2',
    trainerName: 'Dr. Ananya Singh',
    duration: '6 weeks',
    enrolled: 62,
    rating: 4.8,
    syllabus: [
      'Radar fundamentals and principles',
      'Doppler effect and velocity measurements',
      'Reflectivity and precipitation estimation',
      'Radar data quality control',
      'Severe weather signatures on radar'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?q=80&w=1944',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c-3',
    title: 'Climate Data Analysis with Python',
    description: 'Master Python-based tools for climate data processing, statistical analysis, and visualization using real IMD datasets and climate reanalysis products.',
    subject: 'Climate Science',
    level: 'Advanced',
    trainerId: 'trainer-3',
    trainerName: 'Dr. Sanjay Bhatt',
    duration: '10 weeks',
    enrolled: 34,
    rating: 4.5,
    syllabus: [
      'Python fundamentals for meteorology',
      'NetCDF and GRIB data handling',
      'Statistical methods in climatology',
      'Time series analysis of climate data'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c-4',
    title: 'Cyclone Warning Communication',
    description: 'Training on cyclone tracking, intensity estimation, and effective warning dissemination following IMD standard operating procedures.',
    subject: 'Cyclone Meteorology',
    level: 'Intermediate',
    trainerId: 'trainer-4',
    trainerName: 'Dr. Kavita Rao',
    duration: '5 weeks',
    enrolled: 38,
    rating: 4.7,
    syllabus: [
      'Tropical cyclone formation and structure',
      'Dvorak technique for intensity estimation',
      'Track prediction methods',
      'Storm surge forecasting',
      'Warning message standards (IMD format)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=1974',
    createdAt: new Date().toISOString(),
  }
];

const mockResources = [
  {
    id: 'r-1',
    title: 'NWP Model Output Interpretation Guide',
    type: 'pdf',
    url: '#',
    size: '2.4 MB',
    summary: 'A comprehensive guide on interpreting output from WRF and GFS models.',
    provider_id: 'provider-1',
    is_published: true,
    link_status: 'working',
    slug: 'nwp-interpretation-guide',
  },
  {
    id: 'r-2',
    title: 'Introduction to Data Assimilation',
    type: 'video',
    url: '#',
    size: '45.1 MB',
    summary: 'Video lecture covering the basics of 3D-Var and 4D-Var data assimilation.',
    provider_id: 'provider-1',
    is_published: true,
    link_status: 'working',
    slug: 'intro-data-assimilation',
  },
  {
    id: 'r-3',
    title: 'Doppler Radar Calibration Video Tutorial',
    type: 'video',
    url: '#',
    size: '120.5 MB',
    summary: 'Step-by-step tutorial on standard calibration procedures for S-band DWR.',
    provider_id: 'provider-2',
    is_published: true,
    link_status: 'working',
    slug: 'radar-calibration-tutorial',
  },
  {
    id: 'r-4',
    title: 'Radar Reflectivity vs. Rainfall Rate (Z-R) Relationships',
    type: 'download',
    url: '#',
    size: '5.2 MB',
    summary: 'Presentation on Z-R relationships for different types of precipitation.',
    provider_id: 'provider-2',
    is_published: true,
    link_status: 'working',
    slug: 'zr-relationships-presentation',
  }
];

async function seed() {
  console.log("Seeding Genuine Courses...");
  
  // Upsert courses
  for (const course of mockCourses) {
    const { error } = await supabase.from('courses').upsert(course, { onConflict: 'id' });
    if (error) {
      console.error(`Error inserting course ${course.id}:`, error);
    }
  }
  
  console.log("Seeding Providers for Resources...");
  const providers = [
    { id: 'provider-1', name: 'WMO Training', domain: 'wmo.int' },
    { id: 'provider-2', name: 'IMD Official', domain: 'mausam.imd.gov.in' }
  ];
  
  for (const provider of providers) {
    await supabase.from('resource_providers').upsert(provider, { onConflict: 'id' });
  }

  console.log("Seeding Genuine Resources...");
  for (const resource of mockResources) {
    const { error } = await supabase.from('resources').upsert(resource, { onConflict: 'id' });
    if (error) {
      console.error(`Error inserting resource ${resource.id}:`, error);
    }
  }

  console.log("Seeding complete!");
}

seed();
