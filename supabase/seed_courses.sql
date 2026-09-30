-- Seed Real IMD Courses

-- Delete existing mock courses
DELETE FROM public.courses;

INSERT INTO public.courses (id, title, description, subject, level, duration, "trainerId", "trainerName", thumbnail, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(), 
    'Advanced Radar Meteorology', 
    'A comprehensive guide to Doppler Weather Radars (DWR), focusing on reflectivity, velocity interpretation, dual-polarization products, and their applications in severe weather nowcasting for IMD observatories.', 
    'Radar', 
    'Advanced', 
    '8 Weeks', 
    (SELECT id FROM public.users WHERE email = 'trainer@imd.gov.in' LIMIT 1), 
    'Senior Trainer', 
    '/images/courses/course_cover_radar.jpg', 
    now(), 
    now()
  ),
  (
    gen_random_uuid(), 
    'Synoptic Forecasting Techniques', 
    'Learn modern synoptic meteorology techniques used by IMD forecasters. This module covers surface and upper-air chart analysis, identifying monsoon troughs, western disturbances, and tropical cyclones.', 
    'Forecasting', 
    'Intermediate', 
    '6 Weeks', 
    (SELECT id FROM public.users WHERE email = 'trainer@imd.gov.in' LIMIT 1), 
    'Senior Trainer', 
    '/images/courses/course_cover_synoptic.jpg', 
    now(), 
    now()
  ),
  (
    gen_random_uuid(), 
    'INSAT-3D Satellite Data Interpretation', 
    'Master the analysis of satellite imagery from the INSAT-3D/3DR series. Learn to interpret visible, infrared, and water vapor channels for accurate precipitation estimation and cloud tracking.', 
    'Satellite', 
    'Beginner', 
    '4 Weeks', 
    (SELECT id FROM public.users WHERE email = 'trainer@imd.gov.in' LIMIT 1), 
    'Senior Trainer', 
    '/images/courses/course_cover_satellite.jpg', 
    now(), 
    now()
  );
