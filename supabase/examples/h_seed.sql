-- Health and Fitness Schema Seed Data
-- This file contains seed data for all health_fitness schema tables except exercise_categories, supplements, and foods
-- which are already seeded in the migration file

DO $$
DECLARE
    -- Account IDs - using specific UUIDs
    account1 UUID := 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4';
    account2 UUID := 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4';
    account3 UUID := 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1';
    
    -- Category IDs
    chest_cat_id INTEGER;
    back_cat_id INTEGER;
    shoulders_cat_id INTEGER;
    arms_cat_id INTEGER;
    legs_cat_id INTEGER;
    core_cat_id INTEGER;
    cardio_cat_id INTEGER;
    full_body_cat_id INTEGER;
    
    -- Exercise IDs
    exercise1 UUID;
    exercise2 UUID;
    exercise3 UUID;
    exercise4 UUID;
    exercise5 UUID;
    exercise6 UUID;
    exercise7 UUID;
    exercise8 UUID;
    exercise9 UUID;
    exercise10 UUID;
    
    -- Workout Plan IDs
    workout_plan1 UUID;
    workout_plan2 UUID;
    workout_plan3 UUID;
    
    -- Workout Session IDs
    workout_session1 UUID;
    workout_session2 UUID;
    workout_session3 UUID;
    workout_session4 UUID;
    workout_session5 UUID;
    
    -- Meal IDs
    meal1 UUID;
    meal2 UUID;
    meal3 UUID;
    meal4 UUID;
    meal5 UUID;
    
    -- Supplement IDs
    supplement1 UUID;
    supplement2 UUID;
    supplement3 UUID;
    
    -- Food IDs
    food1 UUID;
    food2 UUID;
    food3 UUID;
    food4 UUID;
    food5 UUID;
BEGIN
    -- Account IDs are already hardcoded above
    RAISE NOTICE 'Using accounts: account1=%, account2=%, account3=%', account1, account2, account3;

    -- Get category IDs
    SELECT id INTO chest_cat_id FROM health_fitness.exercise_categories WHERE name = 'Chest';
    SELECT id INTO back_cat_id FROM health_fitness.exercise_categories WHERE name = 'Back';
    SELECT id INTO shoulders_cat_id FROM health_fitness.exercise_categories WHERE name = 'Shoulders';
    SELECT id INTO arms_cat_id FROM health_fitness.exercise_categories WHERE name = 'Arms';
    SELECT id INTO legs_cat_id FROM health_fitness.exercise_categories WHERE name = 'Legs';
    SELECT id INTO core_cat_id FROM health_fitness.exercise_categories WHERE name = 'Core';
    SELECT id INTO cardio_cat_id FROM health_fitness.exercise_categories WHERE name = 'Cardio';
    SELECT id INTO full_body_cat_id FROM health_fitness.exercise_categories WHERE name = 'Full Body';
    
    -- Get supplement IDs
    SELECT id INTO supplement1 FROM health_fitness.supplements WHERE name = 'Whey Protein Powder';
    SELECT id INTO supplement2 FROM health_fitness.supplements WHERE name = 'Creatine Monohydrate';
    SELECT id INTO supplement3 FROM health_fitness.supplements WHERE name = 'Multivitamin';
    
    -- Get food IDs
    SELECT id INTO food1 FROM health_fitness.foods WHERE name = 'Chicken Breast (skinless)';
    SELECT id INTO food2 FROM health_fitness.foods WHERE name = 'Brown Rice (cooked)';
    SELECT id INTO food3 FROM health_fitness.foods WHERE name = 'Broccoli';
    SELECT id INTO food4 FROM health_fitness.foods WHERE name = 'Greek Yogurt (plain)';
    SELECT id INTO food5 FROM health_fitness.foods WHERE name = 'Banana';
    
    -- ==========================================
    -- EXERCISES (15 exercises across categories)
    -- ==========================================
    INSERT INTO health_fitness.exercises 
    (id, name, category_id, description, instructions, primary_muscles, secondary_muscles, equipment, difficulty_level, is_compound)
    VALUES
    (gen_random_uuid(), 'Barbell Bench Press', chest_cat_id, 
     'Classic chest building exercise using a barbell',
     'Lie flat on bench, grip bar slightly wider than shoulders, lower to chest, press up',
     ARRAY['pectoralis_major'], ARRAY['triceps', 'anterior_deltoids'], ARRAY['barbell', 'bench'], 
     'intermediate', true)
    RETURNING id INTO exercise1;
    
    INSERT INTO health_fitness.exercises 
    (id, name, category_id, description, instructions, primary_muscles, secondary_muscles, equipment, difficulty_level, is_compound)
    VALUES
    (gen_random_uuid(), 'Pull-ups', back_cat_id,
     'Bodyweight back exercise using a pull-up bar',
     'Hang from bar with overhand grip, pull body up until chin over bar, lower with control',
     ARRAY['latissimus_dorsi'], ARRAY['biceps', 'rhomboids', 'middle_trapezius'],
     ARRAY['pull_up_bar'], 'intermediate', true)
    RETURNING id INTO exercise2;
    
    INSERT INTO health_fitness.exercises 
    VALUES
    (gen_random_uuid(), 'Barbell Squats', legs_cat_id,
     'Fundamental lower body compound exercise',
     'Position bar on upper back, feet shoulder-width, squat down keeping chest up, drive through heels to stand',
     ARRAY['quadriceps', 'glutes'], ARRAY['hamstrings', 'calves', 'core'],
     ARRAY['barbell', 'squat_rack'], 'intermediate', true)
    RETURNING id INTO exercise3;
    
    INSERT INTO health_fitness.exercises 
    VALUES
    (gen_random_uuid(), 'Deadlifts', legs_cat_id,
     'Full body compound exercise focusing on posterior chain',
     'Stand behind barbell, bend and grip bar, keep back straight, lift by extending hips and knees',
     ARRAY['hamstrings', 'glutes', 'erector_spinae'], ARRAY['trapezius', 'lats', 'forearms'],
     ARRAY['barbell'], 'advanced', true)
    RETURNING id INTO exercise4;
    
    INSERT INTO health_fitness.exercises 
    VALUES
    (gen_random_uuid(), 'Overhead Press', shoulders_cat_id,
     'Shoulder pressing movement with barbell',
     'Start with bar at shoulder level, press overhead until arms locked out, lower with control',
     ARRAY['deltoids'], ARRAY['triceps', 'upper_pectorals', 'core'],
     ARRAY['barbell'], 'intermediate', true)
    RETURNING id INTO exercise5;
    
    INSERT INTO health_fitness.exercises 
    VALUES
    (gen_random_uuid(), 'Dumbbell Bicep Curls', arms_cat_id,
     'Isolation exercise for biceps',
     'Hold dumbbells at sides, curl up rotating palms to face shoulders, squeeze at top, lower slowly',
     ARRAY['biceps'], ARRAY['forearms'],
     ARRAY['dumbbells'], 'beginner', false)
    RETURNING id INTO exercise6;
    
    INSERT INTO health_fitness.exercises 
    VALUES
    (gen_random_uuid(), 'Plank', core_cat_id,
     'Isometric core strengthening exercise',
     'Support body on forearms and toes, maintain straight line from head to heels, hold position',
     ARRAY['rectus_abdominis', 'transverse_abdominis'], ARRAY['shoulders', 'glutes'],
     ARRAY['bodyweight'], 'beginner', false)
    RETURNING id INTO exercise7;
    
    INSERT INTO health_fitness.exercises 
    VALUES
    (gen_random_uuid(), 'Running', cardio_cat_id,
     'Basic cardiovascular exercise',
     'Maintain steady pace, land on midfoot, keep posture upright, breathe rhythmically',
     ARRAY['quadriceps', 'hamstrings', 'calves'], ARRAY['glutes', 'core'],
     ARRAY['none'], 'beginner', true)
    RETURNING id INTO exercise8;
    
    INSERT INTO health_fitness.exercises 
    VALUES
    (gen_random_uuid(), 'Push-ups', chest_cat_id,
     'Bodyweight chest and tricep exercise',
     'Start in plank position, lower body until chest near floor, push back up to start',
     ARRAY['pectoralis_major'], ARRAY['triceps', 'anterior_deltoids', 'core'],
     ARRAY['bodyweight'], 'beginner', true)
    RETURNING id INTO exercise9;
    
    INSERT INTO health_fitness.exercises 
    VALUES
    (gen_random_uuid(), 'Lat Pulldowns', back_cat_id,
     'Cable machine back exercise',
     'Sit at lat pulldown, grip bar wide, pull down to upper chest, control the negative',
     ARRAY['latissimus_dorsi'], ARRAY['biceps', 'rhomboids'],
     ARRAY['cable_machine'], 'beginner', true)
    RETURNING id INTO exercise10;
    
    INSERT INTO health_fitness.exercises 
    VALUES
    (gen_random_uuid(), 'Leg Press', legs_cat_id,
     'Machine-based leg exercise',
     'Sit in leg press machine, place feet shoulder-width on platform, press weight up, lower with control',
     ARRAY['quadriceps', 'glutes'], ARRAY['hamstrings', 'calves'],
     ARRAY['leg_press_machine'], 'beginner', true),
    
    (gen_random_uuid(), 'Dumbbell Rows', back_cat_id,
     'Unilateral back exercise with dumbbell',
     'Support on bench with one hand, row dumbbell to hip with other, squeeze shoulder blade',
     ARRAY['latissimus_dorsi', 'rhomboids'], ARRAY['biceps', 'rear_deltoids'],
     ARRAY['dumbbell', 'bench'], 'beginner', false),
    
    (gen_random_uuid(), 'Burpees', full_body_cat_id,
     'High-intensity full body exercise',
     'Squat down, jump feet back to plank, do push-up, jump feet to hands, jump up with arms overhead',
     ARRAY['full_body'], ARRAY['core', 'shoulders', 'legs'],
     ARRAY['bodyweight'], 'intermediate', true),
    
    (gen_random_uuid(), 'Russian Twists', core_cat_id,
     'Rotational core exercise',
     'Sit with knees bent, lean back slightly, rotate torso side to side holding weight',
     ARRAY['obliques', 'rectus_abdominis'], ARRAY['hip_flexors'],
     ARRAY['medicine_ball', 'dumbbell'], 'intermediate', false),
    
    (gen_random_uuid(), 'Calf Raises', legs_cat_id,
     'Isolation exercise for calves',
     'Stand on balls of feet, raise heels as high as possible, lower with control',
     ARRAY['gastrocnemius', 'soleus'], ARRAY[]::TEXT[],
     ARRAY['bodyweight', 'dumbbells'], 'beginner', false);
    
    -- ==========================================
    -- BODY MEASUREMENTS (15 entries across 3 users over 3 months)
    -- ==========================================
    INSERT INTO health_fitness.body_measurements 
    (account_id, measurement_date, weight_kg, body_fat_percentage, muscle_mass_kg, water_percentage, 
     waist_cm, chest_cm, hips_cm, thigh_cm, bicep_cm, neck_cm, bmr_calories, notes)
    VALUES
    -- User 1 - Weight loss journey
    (account1, CURRENT_DATE - INTERVAL '90 days', 85.5, 22.5, 58.2, 55.0, 
     92.0, 104.0, 102.0, 58.0, 32.0, 38.0, 1750, 'Starting measurements - goal is to lose fat'),
    (account1, CURRENT_DATE - INTERVAL '75 days', 84.2, 21.8, 58.5, 55.5,
     90.5, 103.5, 101.0, 57.5, 32.0, 37.5, 1735, 'Down 1.3kg in 2 weeks, good progress'),
    (account1, CURRENT_DATE - INTERVAL '60 days', 82.8, 20.5, 58.8, 56.0,
     88.0, 103.0, 99.5, 57.0, 32.5, 37.0, 1720, 'Waist down 4cm! Muscle mass maintained'),
    (account1, CURRENT_DATE - INTERVAL '45 days', 81.5, 19.2, 59.0, 56.5,
     86.0, 102.5, 98.0, 56.5, 33.0, 37.0, 1705, 'Visible abs starting to show'),
    (account1, CURRENT_DATE - INTERVAL '30 days', 80.2, 18.0, 59.2, 57.0,
     84.0, 102.0, 97.0, 56.0, 33.0, 36.5, 1690, 'Hit my first goal weight!'),
    (account1, CURRENT_DATE - INTERVAL '15 days', 79.5, 17.2, 59.3, 57.5,
     83.0, 102.0, 96.5, 56.0, 33.5, 36.5, 1680, 'Maintaining muscle while cutting'),
    (account1, CURRENT_DATE - INTERVAL '7 days', 79.0, 16.8, 59.4, 57.8,
     82.5, 102.0, 96.0, 56.0, 33.5, 36.5, 1675, 'Steady progress continuing'),
    (account1, CURRENT_DATE - INTERVAL '1 day', 78.8, 16.5, 59.5, 58.0,
     82.0, 102.0, 95.5, 56.0, 34.0, 36.0, 1670, 'Almost at goal!'),

    -- User 2 - Muscle gain journey
    (account2, CURRENT_DATE - INTERVAL '90 days', 70.0, 15.0, 55.0, 58.0,
     78.0, 96.0, 94.0, 52.0, 30.0, 35.0, 1600, 'Starting bulk phase - skinny starting point'),
    (account2, CURRENT_DATE - INTERVAL '60 days', 73.5, 16.2, 57.5, 57.0,
     80.0, 99.0, 96.0, 54.0, 31.5, 35.5, 1650, 'Gaining steadily, strength increasing'),
    (account2, CURRENT_DATE - INTERVAL '30 days', 76.0, 17.0, 59.0, 56.5,
     81.0, 101.0, 97.0, 55.0, 33.0, 36.0, 1680, 'Happy with muscle gain, some fat gain expected'),
    (account2, CURRENT_DATE - INTERVAL '7 days', 77.5, 17.5, 60.0, 56.0,
     82.0, 102.0, 98.0, 56.0, 34.0, 36.5, 1700, 'Bulk going well, considering mini cut soon'),
    (account2, CURRENT_DATE - INTERVAL '2 days', 78.0, 17.8, 60.2, 56.0,
     82.5, 102.5, 98.5, 56.5, 34.5, 36.5, 1710, 'Strong and growing'),
    
    -- User 3 - Maintenance/recomposition
    (account3, CURRENT_DATE - INTERVAL '75 days', 68.0, 25.0, 48.0, 52.0,
     82.0, 92.0, 98.0, 55.0, 28.0, 34.0, 1450, 'Starting fitness journey - focus on health'),
    (account3, CURRENT_DATE - INTERVAL '50 days', 68.5, 23.5, 49.0, 53.0,
     81.0, 93.0, 97.5, 55.5, 28.5, 34.0, 1460, 'Body recomposition - losing fat, gaining muscle'),
    (account3, CURRENT_DATE - INTERVAL '25 days', 69.0, 22.0, 50.0, 54.0,
     80.0, 94.0, 97.0, 56.0, 29.0, 34.0, 1470, 'Weight stable but body composition improving'),
    (account3, CURRENT_DATE - INTERVAL '10 days', 69.2, 21.0, 50.5, 54.5,
     79.0, 94.5, 96.5, 56.0, 29.5, 34.0, 1475, 'Feeling stronger and healthier'),
    (account3, CURRENT_DATE - INTERVAL '2 days', 69.5, 20.5, 51.0, 55.0,
     78.5, 95.0, 96.0, 56.5, 30.0, 34.0, 1480, 'Best shape of my life!');
    
    -- ==========================================
    -- HEALTH METRICS (20 entries)
    -- ==========================================
    INSERT INTO health_fitness.health_metrics 
    (account_id, measurement_date, measurement_time, systolic_bp, diastolic_bp, resting_heart_rate, 
     blood_sugar_mg_dl, body_temperature_c, oxygen_saturation, stress_level, energy_level, mood_rating, notes)
    VALUES
    -- User 1
    (account1, CURRENT_DATE - INTERVAL '30 days', '07:00:00', 118, 75, 58, 92, 36.5, 98.5, 4, 7, 8, 'Morning measurement after good sleep'),
    (account1, CURRENT_DATE - INTERVAL '25 days', '07:30:00', 120, 78, 60, 95, 36.6, 98.0, 5, 6, 7, 'Slightly elevated BP - work stress'),
    (account1, CURRENT_DATE - INTERVAL '20 days', '06:45:00', 115, 72, 56, 90, 36.4, 99.0, 3, 8, 8, 'Feeling great, RHR improving'),
    (account1, CURRENT_DATE - INTERVAL '15 days', '07:00:00', 116, 74, 55, 88, 36.5, 98.5, 3, 8, 9, 'Cardio fitness improving - lower RHR'),
    (account1, CURRENT_DATE - INTERVAL '10 days', '07:15:00', 114, 71, 54, 91, 36.5, 98.0, 4, 7, 8, 'Consistent improvements'),
    (account1, CURRENT_DATE - INTERVAL '5 days', '07:00:00', 112, 70, 52, 89, 36.4, 99.0, 2, 9, 9, 'Best readings yet!'),
    (account1, CURRENT_DATE - INTERVAL '1 day', '06:30:00', 113, 71, 53, 90, 36.5, 98.5, 3, 8, 8, 'Maintaining good health'),
    
    -- User 2
    (account2, CURRENT_DATE - INTERVAL '28 days', '08:00:00', 125, 80, 65, 98, 36.7, 97.5, 6, 5, 6, 'Higher BP - need more cardio'),
    (account2, CURRENT_DATE - INTERVAL '21 days', '07:45:00', 122, 78, 63, 95, 36.6, 98.0, 5, 6, 7, 'Slight improvement'),
    (account2, CURRENT_DATE - INTERVAL '14 days', '08:00:00', 120, 76, 61, 93, 36.5, 98.5, 4, 7, 7, 'Adding cardio is helping'),
    (account2, CURRENT_DATE - INTERVAL '7 days', '07:30:00', 118, 75, 60, 92, 36.5, 98.0, 4, 7, 8, 'BP normalizing'),
    (account2, CURRENT_DATE - INTERVAL '3 days', '08:00:00', 117, 74, 59, 91, 36.6, 98.5, 3, 8, 8, 'Feeling much better'),
    
    -- User 3
    (account3, CURRENT_DATE - INTERVAL '35 days', '09:00:00', 130, 85, 70, 105, 36.8, 97.0, 7, 4, 5, 'Need to improve - pre-diabetic range'),
    (account3, CURRENT_DATE - INTERVAL '28 days', '08:30:00', 128, 83, 68, 102, 36.7, 97.5, 6, 5, 6, 'Starting to exercise regularly'),
    (account3, CURRENT_DATE - INTERVAL '21 days', '09:00:00', 125, 81, 66, 100, 36.6, 98.0, 5, 6, 7, 'Improvements showing'),
    (account3, CURRENT_DATE - INTERVAL '14 days', '08:45:00', 122, 79, 64, 98, 36.5, 98.0, 5, 6, 7, 'Blood sugar improving with diet'),
    (account3, CURRENT_DATE - INTERVAL '7 days', '09:00:00', 120, 78, 62, 95, 36.5, 98.5, 4, 7, 8, 'Feeling healthier'),
    (account3, CURRENT_DATE - INTERVAL '3 days', '08:30:00', 118, 76, 61, 93, 36.5, 98.5, 4, 7, 8, 'Great progress in 1 month'),
    (account3, CURRENT_DATE - INTERVAL '1 day', '09:00:00', 117, 75, 60, 92, 36.4, 99.0, 3, 8, 9, 'Health markers normalizing'),
    (account3, CURRENT_DATE, '08:00:00', 116, 74, 59, 91, 36.5, 98.5, 3, 8, 9, 'Feeling the best in years!');
    
    -- ==========================================
    -- SLEEP RECORDS (30 days of data for each user)
    -- ==========================================
    -- Generate sleep records for last 30 days
    INSERT INTO health_fitness.sleep_records 
    (account_id, sleep_date, bedtime, wake_time, total_sleep_hours, deep_sleep_hours, light_sleep_hours, 
     rem_sleep_hours, awake_time_hours, sleep_efficiency, times_awakened, sleep_quality, 
     sleep_latency_minutes, caffeine_before_bed, alcohol_before_bed, screen_time_before_bed, notes)
    SELECT 
        account_id,
        sleep_date,
        bedtime::TIME,
        wake_time::TIME,
        total_sleep,
        deep_sleep,
        light_sleep,
        rem_sleep,
        awake_time,
        efficiency,
        awakenings,
        quality,
        latency,
        caffeine,
        alcohol,
        screen,
        notes
    FROM (
        VALUES
        -- User 1 - Good sleeper
        (account1, CURRENT_DATE - INTERVAL '30 days', '22:30', '06:30', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, 'Great sleep'),
        (account1, CURRENT_DATE - INTERVAL '29 days', '23:00', '07:00', 7.8, 2.1, 4.1, 1.6, 0.2, 97.0, 1, 9, 10, false, false, true, 'Very restful'),
        (account1, CURRENT_DATE - INTERVAL '28 days', '22:45', '06:45', 7.6, 1.9, 4.2, 1.5, 0.4, 95.0, 2, 8, 12, false, true, false, 'Wine at dinner'),
        (account1, CURRENT_DATE - INTERVAL '27 days', '22:15', '06:15', 7.7, 2.2, 3.9, 1.6, 0.3, 96.0, 1, 9, 8, false, false, false, 'Perfect night'),
        (account1, CURRENT_DATE - INTERVAL '26 days', '23:30', '07:00', 7.0, 1.8, 3.8, 1.4, 0.5, 93.0, 3, 7, 20, true, false, true, 'Late coffee affected sleep'),
        (account1, CURRENT_DATE - INTERVAL '25 days', '22:00', '06:00', 7.9, 2.3, 4.0, 1.6, 0.1, 98.0, 0, 10, 5, false, false, false, 'Best sleep this week'),
        (account1, CURRENT_DATE - INTERVAL '24 days', '22:30', '06:30', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '23 days', '23:00', '06:45', 7.3, 1.9, 3.9, 1.5, 0.5, 93.0, 2, 8, 18, false, false, true, NULL),
        (account1, CURRENT_DATE - INTERVAL '22 days', '22:45', '06:30', 7.4, 2.0, 3.9, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '21 days', '22:30', '06:15', 7.4, 2.1, 3.8, 1.5, 0.5, 93.0, 2, 8, 14, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '20 days', '22:15', '06:00', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 12, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '19 days', '22:30', '06:30', 7.6, 2.1, 4.0, 1.5, 0.4, 95.0, 1, 9, 13, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '18 days', '22:45', '06:45', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '17 days', '23:00', '07:00', 7.7, 2.2, 3.9, 1.6, 0.3, 96.0, 1, 9, 10, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '16 days', '22:30', '06:30', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '15 days', '22:00', '06:00', 7.8, 2.3, 4.0, 1.5, 0.2, 97.0, 1, 9, 8, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '14 days', '22:30', '06:30', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '13 days', '22:45', '06:45', 7.6, 2.1, 4.0, 1.5, 0.4, 95.0, 2, 8, 14, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '12 days', '22:15', '06:15', 7.7, 2.2, 3.9, 1.6, 0.3, 96.0, 1, 9, 10, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '11 days', '22:30', '06:30', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '10 days', '23:00', '07:00', 7.8, 2.1, 4.1, 1.6, 0.2, 97.0, 1, 9, 12, false, false, true, NULL),
        (account1, CURRENT_DATE - INTERVAL '9 days', '22:30', '06:30', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '8 days', '22:00', '06:00', 7.9, 2.3, 4.0, 1.6, 0.1, 98.0, 0, 10, 5, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '7 days', '22:30', '06:30', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '6 days', '22:45', '06:45', 7.6, 2.1, 4.0, 1.5, 0.4, 95.0, 2, 8, 14, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '5 days', '22:30', '06:30', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '4 days', '22:15', '06:15', 7.7, 2.2, 3.9, 1.6, 0.3, 96.0, 1, 9, 10, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '3 days', '22:30', '06:30', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '2 days', '22:00', '06:00', 7.8, 2.3, 4.0, 1.5, 0.2, 97.0, 1, 9, 8, false, false, false, NULL),
        (account1, CURRENT_DATE - INTERVAL '1 day', '22:30', '06:30', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account1, CURRENT_DATE, '22:15', '06:15', 7.8, 2.2, 4.0, 1.6, 0.2, 97.0, 1, 9, 10, false, false, false, 'Excellent sleep'),

        -- User 2 - Variable sleeper
        (account2, CURRENT_DATE - INTERVAL '15 days', '23:30', '06:30', 6.5, 1.5, 3.5, 1.3, 0.5, 92.0, 3, 6, 25, false, false, true, 'Restless night'),
        (account2, CURRENT_DATE - INTERVAL '14 days', '00:00', '07:30', 7.0, 1.8, 3.7, 1.5, 0.5, 93.0, 2, 7, 30, false, true, true, 'Weekend late night'),
        (account2, CURRENT_DATE - INTERVAL '13 days', '23:00', '06:00', 6.8, 1.6, 3.6, 1.4, 0.5, 93.0, 3, 7, 20, true, false, false, 'Pre-workout kept me up'),
        (account2, CURRENT_DATE - INTERVAL '12 days', '22:30', '05:30', 6.7, 1.7, 3.5, 1.5, 0.5, 93.0, 2, 7, 18, false, false, false, NULL),
        (account2, CURRENT_DATE - INTERVAL '11 days', '23:15', '06:45', 7.0, 1.8, 3.7, 1.5, 0.5, 93.0, 2, 7, 22, false, false, true, NULL),
        (account2, CURRENT_DATE - INTERVAL '10 days', '22:45', '06:15', 7.1, 1.8, 3.8, 1.5, 0.5, 93.0, 2, 7, 17, false, false, false, NULL),
        (account2, CURRENT_DATE - INTERVAL '9 days', '23:00', '06:30', 7.0, 1.7, 3.8, 1.5, 0.5, 93.0, 3, 7, 20, false, false, false, NULL),
        (account2, CURRENT_DATE - INTERVAL '8 days', '22:30', '06:00', 7.2, 1.9, 3.8, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account2, CURRENT_DATE - INTERVAL '7 days', '23:30', '07:00', 7.0, 1.7, 3.8, 1.5, 0.5, 93.0, 3, 7, 25, false, false, true, NULL),
        (account2, CURRENT_DATE - INTERVAL '6 days', '22:45', '06:15', 7.1, 1.8, 3.8, 1.5, 0.5, 93.0, 2, 7, 18, false, false, false, NULL),
        (account2, CURRENT_DATE - INTERVAL '5 days', '23:00', '06:30', 7.0, 1.7, 3.8, 1.5, 0.5, 93.0, 2, 7, 20, false, false, false, NULL),
        (account2, CURRENT_DATE - INTERVAL '4 days', '22:30', '06:00', 7.2, 1.9, 3.8, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, NULL),
        (account2, CURRENT_DATE - INTERVAL '3 days', '23:15', '06:45', 6.9, 1.7, 3.7, 1.5, 0.5, 93.0, 3, 7, 22, false, false, true, NULL),
        (account2, CURRENT_DATE - INTERVAL '2 days', '22:45', '06:15', 7.1, 1.8, 3.8, 1.5, 0.5, 93.0, 2, 7, 17, false, false, false, NULL),
        (account2, CURRENT_DATE - INTERVAL '1 day', '23:00', '06:30', 7.0, 1.7, 3.8, 1.5, 0.5, 93.0, 2, 7, 20, false, false, false, NULL),
        (account2, CURRENT_DATE, '22:45', '06:15', 7.1, 1.8, 3.8, 1.5, 0.5, 93.0, 2, 7, 18, false, false, false, 'Good rest'),

        -- User 3 - Improving sleep
        (account3, CURRENT_DATE - INTERVAL '10 days', '23:45', '06:15', 6.0, 1.3, 3.2, 1.2, 0.5, 92.0, 4, 5, 35, true, false, true, 'Poor sleep hygiene'),
        (account3, CURRENT_DATE - INTERVAL '9 days', '23:30', '06:30', 6.5, 1.5, 3.5, 1.3, 0.5, 92.0, 3, 6, 28, false, false, true, 'Getting better'),
        (account3, CURRENT_DATE - INTERVAL '8 days', '23:15', '06:45', 6.8, 1.6, 3.6, 1.4, 0.5, 93.0, 3, 6, 25, false, false, true, NULL),
        (account3, CURRENT_DATE - INTERVAL '7 days', '23:00', '06:30', 7.0, 1.7, 3.8, 1.5, 0.5, 93.0, 2, 7, 20, false, false, false, 'No screens helped'),
        (account3, CURRENT_DATE - INTERVAL '6 days', '22:45', '06:15', 7.1, 1.8, 3.8, 1.5, 0.5, 93.0, 2, 7, 18, false, false, false, NULL),
        (account3, CURRENT_DATE - INTERVAL '5 days', '22:30', '06:00', 7.2, 1.9, 3.8, 1.5, 0.5, 93.0, 2, 8, 15, false, false, false, 'Routine working'),
        (account3, CURRENT_DATE - INTERVAL '4 days', '22:45', '06:15', 7.1, 1.8, 3.8, 1.5, 0.5, 93.0, 2, 7, 17, false, false, false, NULL),
        (account3, CURRENT_DATE - INTERVAL '3 days', '22:30', '06:00', 7.3, 1.9, 3.9, 1.5, 0.5, 93.0, 2, 8, 14, false, false, false, NULL),
        (account3, CURRENT_DATE - INTERVAL '2 days', '22:15', '05:45', 7.4, 2.0, 3.9, 1.5, 0.5, 93.0, 1, 8, 12, false, false, false, 'Great improvement'),
        (account3, CURRENT_DATE - INTERVAL '1 day', '22:30', '06:00', 7.3, 1.9, 3.9, 1.5, 0.5, 93.0, 2, 8, 14, false, false, false, NULL),
        (account3, CURRENT_DATE, '22:15', '06:00', 7.5, 2.0, 4.0, 1.5, 0.5, 93.0, 1, 9, 12, false, false, false, 'Best sleep yet!')
    ) AS t(account_id, sleep_date, bedtime, wake_time, total_sleep, deep_sleep, light_sleep, rem_sleep, 
           awake_time, efficiency, awakenings, quality, latency, caffeine, alcohol, screen, notes)
    ON CONFLICT (account_id, sleep_date) DO NOTHING;
    
    -- ==========================================
    -- WORKOUT PLANS (3 plans)
    -- ==========================================
    INSERT INTO health_fitness.workout_plans 
    (id, account_id, name, description, plan_type, difficulty_level, duration_weeks, 
     days_per_week, estimated_duration_minutes, goal, is_active, created_by)
    VALUES
    (gen_random_uuid(), account1, 'Fat Loss & Strength Program',
     'Combination of strength training and cardio for optimal fat loss while maintaining muscle',
     'hybrid', 'intermediate', 12, 5, 60, 'weight_loss', true, 'user')
    RETURNING id INTO workout_plan1;
    
    INSERT INTO health_fitness.workout_plans 
    VALUES
    (gen_random_uuid(), account2, 'Push Pull Legs Hypertrophy',
     'Classic PPL split focused on muscle growth with progressive overload',
     'strength', 'intermediate', 16, 6, 75, 'muscle_gain', true, 'app')
    RETURNING id INTO workout_plan2;
    
    INSERT INTO health_fitness.workout_plans 
    VALUES
    (gen_random_uuid(), account3, 'Beginner Full Body Routine',
     'Simple full body workout 3x per week for building base strength and fitness',
     'strength', 'beginner', 8, 3, 45, 'general_fitness', true, 'app')
    RETURNING id INTO workout_plan3;
    
    -- ==========================================
    -- WORKOUT SESSIONS (Extended to cover last 12 weeks for charts)
    -- ==========================================
    -- User 1 historical sessions (bulk insert without RETURNING)
    INSERT INTO health_fitness.workout_sessions
    (account_id, workout_plan_id, session_date, start_time, end_time, duration_minutes,
     session_type, intensity_level, calories_burned, average_heart_rate, max_heart_rate,
     perceived_exertion, workout_quality, location, notes)
    VALUES
    -- Week 12 (84-78 days ago)
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '84 days',
     CURRENT_DATE - INTERVAL '84 days' + TIME '06:00', CURRENT_DATE - INTERVAL '84 days' + TIME '07:00',
     60, 'strength', 7, 320, 120, 160, 7, 8, 'gym', 'Starting new program'),
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '82 days',
     CURRENT_DATE - INTERVAL '82 days' + TIME '06:00', CURRENT_DATE - INTERVAL '82 days' + TIME '06:45',
     45, 'cardio', 6, 340, 140, 168, 6, 7, 'outdoor', 'Easy run'),
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '80 days',
     CURRENT_DATE - INTERVAL '80 days' + TIME '06:00', CURRENT_DATE - INTERVAL '80 days' + TIME '07:00',
     60, 'strength', 7, 330, 122, 162, 7, 8, 'gym', NULL),
    -- Week 10 (70-63 days ago)
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '70 days',
     CURRENT_DATE - INTERVAL '70 days' + TIME '06:00', CURRENT_DATE - INTERVAL '70 days' + TIME '07:00',
     60, 'strength', 7, 330, 123, 163, 7, 8, 'gym', NULL),
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '67 days',
     CURRENT_DATE - INTERVAL '67 days' + TIME '06:00', CURRENT_DATE - INTERVAL '67 days' + TIME '07:00',
     65, 'strength', 8, 350, 125, 165, 8, 8, 'gym', NULL),
    -- Week 8 (56-49 days ago)
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '56 days',
     CURRENT_DATE - INTERVAL '56 days' + TIME '06:00', CURRENT_DATE - INTERVAL '56 days' + TIME '07:00',
     60, 'strength', 8, 340, 124, 164, 8, 8, 'gym', NULL),
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '54 days',
     CURRENT_DATE - INTERVAL '54 days' + TIME '06:00', CURRENT_DATE - INTERVAL '54 days' + TIME '06:45',
     45, 'cardio', 7, 360, 143, 170, 7, 8, 'outdoor', NULL),
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '52 days',
     CURRENT_DATE - INTERVAL '52 days' + TIME '06:00', CURRENT_DATE - INTERVAL '52 days' + TIME '07:00',
     60, 'strength', 8, 350, 125, 165, 8, 8, 'gym', NULL),
    -- Week 6 (42-35 days ago)
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '42 days',
     CURRENT_DATE - INTERVAL '42 days' + TIME '06:00', CURRENT_DATE - INTERVAL '42 days' + TIME '07:00',
     60, 'strength', 8, 350, 125, 165, 8, 8, 'gym', NULL),
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '39 days',
     CURRENT_DATE - INTERVAL '39 days' + TIME '06:00', CURRENT_DATE - INTERVAL '39 days' + TIME '06:45',
     45, 'hiit', 8, 370, 150, 175, 8, 8, 'home', NULL),
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '37 days',
     CURRENT_DATE - INTERVAL '37 days' + TIME '06:00', CURRENT_DATE - INTERVAL '37 days' + TIME '07:00',
     60, 'strength', 8, 355, 126, 166, 8, 9, 'gym', NULL),
    -- Week 4 (28-21 days ago)
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '28 days',
     CURRENT_DATE - INTERVAL '28 days' + TIME '06:00', CURRENT_DATE - INTERVAL '28 days' + TIME '07:00',
     60, 'strength', 8, 355, 126, 166, 8, 9, 'gym', NULL),
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '25 days',
     CURRENT_DATE - INTERVAL '25 days' + TIME '06:00', CURRENT_DATE - INTERVAL '25 days' + TIME '06:45',
     45, 'cardio', 7, 365, 144, 171, 7, 8, 'outdoor', NULL),
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '23 days',
     CURRENT_DATE - INTERVAL '23 days' + TIME '06:00', CURRENT_DATE - INTERVAL '23 days' + TIME '07:00',
     60, 'strength', 8, 360, 127, 167, 8, 9, 'gym', NULL),
    -- Week 2 (14-7 days ago)
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '14 days',
     CURRENT_DATE - INTERVAL '14 days' + TIME '06:00', CURRENT_DATE - INTERVAL '14 days' + TIME '07:00',
     60, 'strength', 8, 360, 127, 167, 8, 9, 'gym', NULL),
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '11 days',
     CURRENT_DATE - INTERVAL '11 days' + TIME '06:00', CURRENT_DATE - INTERVAL '11 days' + TIME '06:45',
     45, 'hiit', 9, 375, 152, 177, 9, 8, 'home', NULL);

    -- User 1 recent sessions (with RETURNING for exercise sets)
    INSERT INTO health_fitness.workout_sessions
    (account_id, workout_plan_id, session_date, start_time, end_time, duration_minutes,
     session_type, intensity_level, calories_burned, average_heart_rate, max_heart_rate,
     perceived_exertion, workout_quality, location, notes)
    VALUES
    (account1, workout_plan1, CURRENT_DATE - INTERVAL '10 days',
     CURRENT_DATE - INTERVAL '10 days' + TIME '06:00', CURRENT_DATE - INTERVAL '10 days' + TIME '07:00',
     60, 'strength', 8, 350, 125, 165, 8, 9, 'gym', 'Great leg day, hit PR on squats')
    RETURNING id INTO workout_session1;

    INSERT INTO health_fitness.workout_sessions VALUES
    (gen_random_uuid(), account1, workout_plan1, CURRENT_DATE - INTERVAL '9 days',
     CURRENT_DATE - INTERVAL '9 days' + TIME '06:00', CURRENT_DATE - INTERVAL '9 days' + TIME '06:45',
     45, 'cardio', 7, 380, 145, 172, 7, 8, 'outdoor', 'Morning run, felt strong')
    RETURNING id INTO workout_session2;

    INSERT INTO health_fitness.workout_sessions VALUES
    (gen_random_uuid(), account1, workout_plan1, CURRENT_DATE - INTERVAL '8 days',
     CURRENT_DATE - INTERVAL '8 days' + TIME '18:00', CURRENT_DATE - INTERVAL '8 days' + TIME '19:15',
     75, 'strength', 9, 400, 130, 168, 9, 8, 'gym', 'Upper body push day')
    RETURNING id INTO workout_session3;

    INSERT INTO health_fitness.workout_sessions VALUES
    (gen_random_uuid(), account1, workout_plan1, CURRENT_DATE - INTERVAL '7 days',
     CURRENT_DATE - INTERVAL '7 days' + TIME '06:00', CURRENT_DATE - INTERVAL '7 days' + TIME '07:00',
     60, 'strength', 8, 350, 125, 165, 8, 9, 'gym', 'Leg day'),

    (gen_random_uuid(), account1, workout_plan1, CURRENT_DATE - INTERVAL '6 days',
     CURRENT_DATE - INTERVAL '6 days' + TIME '06:00', CURRENT_DATE - INTERVAL '6 days' + TIME '07:00',
     60, 'strength', 8, 360, 128, 166, 8, 9, 'gym', 'Back and biceps'),

    (gen_random_uuid(), account1, workout_plan1, CURRENT_DATE - INTERVAL '5 days',
     CURRENT_DATE - INTERVAL '5 days' + TIME '06:00', CURRENT_DATE - INTERVAL '5 days' + TIME '06:45',
     45, 'cardio', 7, 370, 143, 170, 7, 8, 'outdoor', 'Easy run'),

    (gen_random_uuid(), account1, workout_plan1, CURRENT_DATE - INTERVAL '4 days',
     CURRENT_DATE - INTERVAL '4 days' + TIME '06:30', CURRENT_DATE - INTERVAL '4 days' + TIME '07:00',
     30, 'hiit', 9, 280, 155, 180, 9, 7, 'home', 'Quick HIIT session'),

    (gen_random_uuid(), account1, workout_plan1, CURRENT_DATE - INTERVAL '3 days',
     CURRENT_DATE - INTERVAL '3 days' + TIME '06:00', CURRENT_DATE - INTERVAL '3 days' + TIME '07:00',
     65, 'strength', 8, 365, 127, 167, 8, 9, 'gym', 'Chest and triceps'),

    (gen_random_uuid(), account1, workout_plan1, CURRENT_DATE - INTERVAL '1 day',
     CURRENT_DATE - INTERVAL '1 day' + TIME '06:00', CURRENT_DATE - INTERVAL '1 day' + TIME '06:45',
     45, 'cardio', 7, 375, 144, 171, 7, 8, 'outdoor', 'Morning run');

    -- User 2 historical sessions (bulk insert without RETURNING)
    INSERT INTO health_fitness.workout_sessions
    (account_id, workout_plan_id, session_date, start_time, end_time, duration_minutes,
     session_type, intensity_level, calories_burned, average_heart_rate, max_heart_rate,
     perceived_exertion, workout_quality, location, notes)
    VALUES
    -- Week 12-10
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '84 days',
     CURRENT_DATE - INTERVAL '84 days' + TIME '17:00', CURRENT_DATE - INTERVAL '84 days' + TIME '18:30',
     90, 'strength', 7, 420, 130, 165, 7, 8, 'gym', 'Starting PPL program'),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '82 days',
     CURRENT_DATE - INTERVAL '82 days' + TIME '17:00', CURRENT_DATE - INTERVAL '82 days' + TIME '18:30',
     90, 'strength', 7, 425, 131, 166, 7, 8, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '80 days',
     CURRENT_DATE - INTERVAL '80 days' + TIME '17:00', CURRENT_DATE - INTERVAL '80 days' + TIME '18:45',
     105, 'strength', 8, 440, 133, 168, 8, 8, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '77 days',
     CURRENT_DATE - INTERVAL '77 days' + TIME '17:00', CURRENT_DATE - INTERVAL '77 days' + TIME '18:30',
     90, 'strength', 7, 430, 132, 167, 7, 8, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '75 days',
     CURRENT_DATE - INTERVAL '75 days' + TIME '17:00', CURRENT_DATE - INTERVAL '75 days' + TIME '18:30',
     90, 'strength', 8, 435, 133, 168, 8, 8, 'gym', NULL),
    -- Week 8-6
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '56 days',
     CURRENT_DATE - INTERVAL '56 days' + TIME '17:00', CURRENT_DATE - INTERVAL '56 days' + TIME '18:30',
     90, 'strength', 8, 440, 134, 169, 8, 8, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '54 days',
     CURRENT_DATE - INTERVAL '54 days' + TIME '17:00', CURRENT_DATE - INTERVAL '54 days' + TIME '18:30',
     90, 'strength', 8, 445, 135, 170, 8, 9, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '52 days',
     CURRENT_DATE - INTERVAL '52 days' + TIME '17:00', CURRENT_DATE - INTERVAL '52 days' + TIME '18:45',
     105, 'strength', 9, 465, 137, 172, 9, 9, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '49 days',
     CURRENT_DATE - INTERVAL '49 days' + TIME '17:00', CURRENT_DATE - INTERVAL '49 days' + TIME '18:30',
     90, 'strength', 8, 450, 135, 170, 8, 9, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '47 days',
     CURRENT_DATE - INTERVAL '47 days' + TIME '17:00', CURRENT_DATE - INTERVAL '47 days' + TIME '18:30',
     90, 'strength', 8, 455, 136, 171, 8, 9, 'gym', NULL),
    -- Week 4-2
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '28 days',
     CURRENT_DATE - INTERVAL '28 days' + TIME '17:00', CURRENT_DATE - INTERVAL '28 days' + TIME '18:30',
     90, 'strength', 8, 455, 136, 171, 8, 9, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '26 days',
     CURRENT_DATE - INTERVAL '26 days' + TIME '17:00', CURRENT_DATE - INTERVAL '26 days' + TIME '18:30',
     90, 'strength', 8, 458, 137, 172, 8, 9, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '24 days',
     CURRENT_DATE - INTERVAL '24 days' + TIME '17:00', CURRENT_DATE - INTERVAL '24 days' + TIME '18:45',
     105, 'strength', 9, 475, 138, 173, 9, 9, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '21 days',
     CURRENT_DATE - INTERVAL '21 days' + TIME '17:00', CURRENT_DATE - INTERVAL '21 days' + TIME '18:30',
     90, 'strength', 8, 460, 137, 172, 8, 9, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '19 days',
     CURRENT_DATE - INTERVAL '19 days' + TIME '17:00', CURRENT_DATE - INTERVAL '19 days' + TIME '18:30',
     90, 'strength', 8, 462, 137, 172, 8, 9, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '14 days',
     CURRENT_DATE - INTERVAL '14 days' + TIME '17:00', CURRENT_DATE - INTERVAL '14 days' + TIME '18:30',
     90, 'strength', 8, 465, 138, 173, 8, 9, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '12 days',
     CURRENT_DATE - INTERVAL '12 days' + TIME '17:00', CURRENT_DATE - INTERVAL '12 days' + TIME '18:45',
     105, 'strength', 9, 485, 139, 174, 9, 9, 'gym', NULL),
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '10 days',
     CURRENT_DATE - INTERVAL '10 days' + TIME '17:00', CURRENT_DATE - INTERVAL '10 days' + TIME '18:30',
     90, 'strength', 8, 470, 138, 173, 8, 9, 'gym', NULL);

    -- User 2 recent session (with RETURNING for exercise sets)
    INSERT INTO health_fitness.workout_sessions
    (account_id, workout_plan_id, session_date, start_time, end_time, duration_minutes,
     session_type, intensity_level, calories_burned, average_heart_rate, max_heart_rate,
     perceived_exertion, workout_quality, location, notes)
    VALUES
    (account2, workout_plan2, CURRENT_DATE - INTERVAL '7 days',
     CURRENT_DATE - INTERVAL '7 days' + TIME '17:00', CURRENT_DATE - INTERVAL '7 days' + TIME '18:30',
     90, 'strength', 8, 450, 135, 170, 8, 9, 'gym', 'Push day - chest focus')
    RETURNING id INTO workout_session4;

    INSERT INTO health_fitness.workout_sessions VALUES
    (gen_random_uuid(), account2, workout_plan2, CURRENT_DATE - INTERVAL '6 days',
     CURRENT_DATE - INTERVAL '6 days' + TIME '17:00', CURRENT_DATE - INTERVAL '6 days' + TIME '18:30',
     90, 'strength', 8, 460, 138, 172, 8, 8, 'gym', 'Pull day - deadlifts felt heavy'),

    (gen_random_uuid(), account2, workout_plan2, CURRENT_DATE - INTERVAL '5 days',
     CURRENT_DATE - INTERVAL '5 days' + TIME '17:00', CURRENT_DATE - INTERVAL '5 days' + TIME '18:45',
     105, 'strength', 9, 500, 140, 175, 9, 10, 'gym', 'Leg day - new squat PR!'),

    (gen_random_uuid(), account2, workout_plan2, CURRENT_DATE - INTERVAL '3 days',
     CURRENT_DATE - INTERVAL '3 days' + TIME '17:00', CURRENT_DATE - INTERVAL '3 days' + TIME '18:15',
     75, 'strength', 7, 380, 132, 165, 7, 8, 'gym', 'Push day - shoulders'),

    (gen_random_uuid(), account2, workout_plan2, CURRENT_DATE - INTERVAL '2 days',
     CURRENT_DATE - INTERVAL '2 days' + TIME '17:00', CURRENT_DATE - INTERVAL '2 days' + TIME '18:20',
     80, 'strength', 8, 420, 136, 168, 8, 9, 'gym', 'Pull day - back width focus'),

    (gen_random_uuid(), account2, workout_plan2, CURRENT_DATE - INTERVAL '4 days',
     CURRENT_DATE - INTERVAL '4 days' + TIME '17:00', CURRENT_DATE - INTERVAL '4 days' + TIME '18:30',
     90, 'strength', 8, 445, 137, 171, 8, 9, 'gym', 'Push day - bench press focus'),

    (gen_random_uuid(), account2, workout_plan2, CURRENT_DATE - INTERVAL '1 day',
     CURRENT_DATE - INTERVAL '1 day' + TIME '17:00', CURRENT_DATE - INTERVAL '1 day' + TIME '18:45',
     105, 'strength', 9, 490, 140, 175, 9, 9, 'gym', 'Leg day - feeling great');

    -- User 3 historical sessions (bulk insert without RETURNING)
    INSERT INTO health_fitness.workout_sessions
    (account_id, workout_plan_id, session_date, start_time, end_time, duration_minutes,
     session_type, intensity_level, calories_burned, average_heart_rate, max_heart_rate,
     perceived_exertion, workout_quality, location, notes)
    VALUES
    -- Week 8-6
    (account3, workout_plan3, CURRENT_DATE - INTERVAL '56 days',
     CURRENT_DATE - INTERVAL '56 days' + TIME '19:00', CURRENT_DATE - INTERVAL '56 days' + TIME '19:40',
     40, 'strength', 5, 200, 115, 142, 5, 7, 'home', 'First workout - nervous'),
    (account3, workout_plan3, CURRENT_DATE - INTERVAL '53 days',
     CURRENT_DATE - INTERVAL '53 days' + TIME '19:00', CURRENT_DATE - INTERVAL '53 days' + TIME '19:40',
     40, 'strength', 5, 205, 116, 143, 5, 7, 'home', NULL),
    (account3, workout_plan3, CURRENT_DATE - INTERVAL '50 days',
     CURRENT_DATE - INTERVAL '50 days' + TIME '19:00', CURRENT_DATE - INTERVAL '50 days' + TIME '19:40',
     40, 'strength', 6, 210, 117, 144, 6, 7, 'home', NULL),
    -- Week 4-2
    (account3, workout_plan3, CURRENT_DATE - INTERVAL '28 days',
     CURRENT_DATE - INTERVAL '28 days' + TIME '19:00', CURRENT_DATE - INTERVAL '28 days' + TIME '19:45',
     45, 'strength', 6, 215, 118, 145, 6, 7, 'home', NULL),
    (account3, workout_plan3, CURRENT_DATE - INTERVAL '25 days',
     CURRENT_DATE - INTERVAL '25 days' + TIME '19:00', CURRENT_DATE - INTERVAL '25 days' + TIME '19:45',
     45, 'strength', 6, 218, 118, 146, 6, 8, 'home', NULL),
    (account3, workout_plan3, CURRENT_DATE - INTERVAL '22 days',
     CURRENT_DATE - INTERVAL '22 days' + TIME '19:00', CURRENT_DATE - INTERVAL '22 days' + TIME '19:45',
     45, 'strength', 6, 220, 119, 146, 6, 8, 'home', NULL),
    (account3, workout_plan3, CURRENT_DATE - INTERVAL '18 days',
     CURRENT_DATE - INTERVAL '18 days' + TIME '19:00', CURRENT_DATE - INTERVAL '18 days' + TIME '19:45',
     45, 'strength', 6, 222, 119, 147, 6, 8, 'home', NULL),
    (account3, workout_plan3, CURRENT_DATE - INTERVAL '15 days',
     CURRENT_DATE - INTERVAL '15 days' + TIME '19:00', CURRENT_DATE - INTERVAL '15 days' + TIME '19:45',
     45, 'strength', 6, 225, 119, 147, 6, 8, 'home', NULL),
    (account3, workout_plan3, CURRENT_DATE - INTERVAL '12 days',
     CURRENT_DATE - INTERVAL '12 days' + TIME '19:00', CURRENT_DATE - INTERVAL '12 days' + TIME '19:45',
     45, 'strength', 6, 228, 120, 148, 6, 8, 'home', NULL);

    -- User 3 recent session (with RETURNING for exercise sets)
    INSERT INTO health_fitness.workout_sessions
    (account_id, workout_plan_id, session_date, start_time, end_time, duration_minutes,
     session_type, intensity_level, calories_burned, average_heart_rate, max_heart_rate,
     perceived_exertion, workout_quality, location, notes)
    VALUES
    (account3, workout_plan3, CURRENT_DATE - INTERVAL '8 days',
     CURRENT_DATE - INTERVAL '8 days' + TIME '19:00', CURRENT_DATE - INTERVAL '8 days' + TIME '19:45',
     45, 'strength', 6, 220, 118, 145, 6, 7, 'home', 'Full body workout A')
    RETURNING id INTO workout_session5;

    INSERT INTO health_fitness.workout_sessions VALUES
    (gen_random_uuid(), account3, workout_plan3, CURRENT_DATE - INTERVAL '6 days',
     CURRENT_DATE - INTERVAL '6 days' + TIME '19:00', CURRENT_DATE - INTERVAL '6 days' + TIME '19:45',
     45, 'strength', 6, 230, 120, 148, 6, 8, 'home', 'Full body workout B'),

    (gen_random_uuid(), account3, workout_plan3, CURRENT_DATE - INTERVAL '4 days',
     CURRENT_DATE - INTERVAL '4 days' + TIME '19:00', CURRENT_DATE - INTERVAL '4 days' + TIME '19:50',
     50, 'strength', 7, 250, 122, 150, 7, 8, 'home', 'Full body workout A - getting stronger'),

    (gen_random_uuid(), account3, workout_plan3, CURRENT_DATE - INTERVAL '2 days',
     CURRENT_DATE - INTERVAL '2 days' + TIME '10:00', CURRENT_DATE - INTERVAL '2 days' + TIME '10:30',
     30, 'yoga', 4, 100, 95, 110, 4, 9, 'home', 'Recovery yoga session'),

    (gen_random_uuid(), account3, workout_plan3, CURRENT_DATE - INTERVAL '1 day',
     CURRENT_DATE - INTERVAL '1 day' + TIME '19:00', CURRENT_DATE - INTERVAL '1 day' + TIME '19:45',
     45, 'strength', 7, 240, 121, 149, 7, 8, 'home', 'Full body workout B');
    
    -- ==========================================
    -- EXERCISE SETS (Multiple sets for some workouts)
    -- ==========================================
    INSERT INTO health_fitness.exercise_sets 
    (workout_session_id, exercise_id, set_order, set_type, repetitions, weight_kg, 
     rest_seconds, perceived_exertion, completed, notes)
    VALUES
    -- Workout Session 1 (User 1 leg day)
    (workout_session1, exercise3, 1, 'warmup', 10, 60, 90, 5, true, 'Warm-up set'),
    (workout_session1, exercise3, 2, 'warmup', 8, 80, 90, 6, true, NULL),
    (workout_session1, exercise3, 3, 'normal', 5, 100, 180, 8, true, 'Working set'),
    (workout_session1, exercise3, 4, 'normal', 5, 100, 180, 9, true, NULL),
    (workout_session1, exercise3, 5, 'normal', 5, 100, 180, 9, true, 'Last set tough'),
    (workout_session1, exercise4, 1, 'normal', 8, 80, 150, 8, true, 'Romanian deadlifts'),
    (workout_session1, exercise4, 2, 'normal', 8, 80, 150, 8, true, NULL),
    (workout_session1, exercise4, 3, 'normal', 8, 80, 150, 9, true, NULL),
    
    -- Workout Session 3 (User 1 upper push)
    (workout_session3, exercise1, 1, 'warmup', 12, 40, 60, 5, true, NULL),
    (workout_session3, exercise1, 2, 'normal', 8, 70, 120, 7, true, NULL),
    (workout_session3, exercise1, 3, 'normal', 8, 70, 120, 8, true, NULL),
    (workout_session3, exercise1, 4, 'normal', 6, 75, 150, 9, true, 'Heavy set'),
    (workout_session3, exercise5, 1, 'normal', 10, 40, 90, 7, true, 'Overhead press'),
    (workout_session3, exercise5, 2, 'normal', 10, 40, 90, 8, true, NULL),
    (workout_session3, exercise5, 3, 'normal', 8, 45, 120, 9, true, NULL),
    
    -- Workout Session 4 (User 2 push day)
    (workout_session4, exercise1, 1, 'warmup', 15, 50, 60, 5, true, NULL),
    (workout_session4, exercise1, 2, 'warmup', 10, 70, 90, 6, true, NULL),
    (workout_session4, exercise1, 3, 'normal', 8, 85, 150, 8, true, NULL),
    (workout_session4, exercise1, 4, 'normal', 8, 85, 150, 8, true, NULL),
    (workout_session4, exercise1, 5, 'normal', 6, 90, 180, 9, true, 'PR attempt'),
    (workout_session4, exercise1, 6, 'drop', 12, 60, 90, 10, true, 'Drop set finisher'),
    
    -- Workout Session 5 (User 3 full body)
    (workout_session5, exercise9, 1, 'normal', 15, 0, 60, 6, true, 'Bodyweight push-ups'),
    (workout_session5, exercise9, 2, 'normal', 12, 0, 60, 7, true, NULL),
    (workout_session5, exercise9, 3, 'normal', 10, 0, 90, 8, true, 'Getting tired'),
    (workout_session5, exercise3, 1, 'normal', 12, 40, 90, 7, true, 'Goblet squats'),
    (workout_session5, exercise3, 2, 'normal', 12, 40, 90, 7, true, NULL),
    (workout_session5, exercise10, 1, 'normal', 12, 30, 90, 6, true, 'Lat pulldowns'),
    (workout_session5, exercise10, 2, 'normal', 12, 30, 90, 7, true, NULL),
    (workout_session5, exercise7, 1, 'normal', 30, 0, 30, 8, true, 'Plank hold (seconds)'),
    (workout_session5, exercise7, 2, 'normal', 25, 0, 30, 9, true, NULL);

    -- Additional exercise sets for muscle group variety (last 30 days)
    -- Using subqueries to reference recent workout sessions

    -- User 1 Day 7 (Leg day) - Add more leg exercises
    INSERT INTO health_fitness.exercise_sets
    (workout_session_id, exercise_id, set_order, set_type, repetitions, weight_kg,
     rest_seconds, perceived_exertion, completed, notes)
    VALUES
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '7 days' LIMIT 1),
     exercise3, 1, 'warmup', 10, 60, 90, 5, true, 'Squat warmup'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '7 days' LIMIT 1),
     exercise3, 2, 'normal', 8, 100, 120, 8, true, 'Working set'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '7 days' LIMIT 1),
     exercise3, 3, 'normal', 8, 100, 120, 9, true, NULL);

    -- User 1 Day 6 (Back and biceps) - Add back and arms exercises
    INSERT INTO health_fitness.exercise_sets
    (workout_session_id, exercise_id, set_order, set_type, repetitions, weight_kg,
     rest_seconds, perceived_exertion, completed, notes)
    VALUES
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise2, 1, 'normal', 8, 0, 120, 7, true, 'Pull-ups'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise2, 2, 'normal', 7, 0, 120, 8, true, NULL),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise2, 3, 'normal', 6, 0, 120, 9, true, 'Last set'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise10, 1, 'normal', 12, 50, 90, 7, true, 'Lat pulldowns'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise10, 2, 'normal', 10, 55, 90, 8, true, NULL),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise6, 1, 'normal', 12, 15, 60, 7, true, 'Bicep curls'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise6, 2, 'normal', 10, 17.5, 60, 8, true, NULL);

    -- User 1 Day 3 (Chest and triceps) - Add chest exercises
    INSERT INTO health_fitness.exercise_sets
    (workout_session_id, exercise_id, set_order, set_type, repetitions, weight_kg,
     rest_seconds, perceived_exertion, completed, notes)
    VALUES
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '3 days' LIMIT 1),
     exercise1, 1, 'warmup', 12, 60, 90, 5, true, 'Bench warmup'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '3 days' LIMIT 1),
     exercise1, 2, 'normal', 8, 80, 120, 8, true, 'Working set'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '3 days' LIMIT 1),
     exercise1, 3, 'normal', 6, 85, 180, 9, true, NULL),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '3 days' LIMIT 1),
     exercise9, 1, 'normal', 15, 0, 60, 7, true, 'Push-ups'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account1 AND session_date = CURRENT_DATE - INTERVAL '3 days' LIMIT 1),
     exercise9, 2, 'normal', 12, 0, 60, 8, true, NULL);

    -- User 2 Day 6 (Pull day) - Add back exercises
    INSERT INTO health_fitness.exercise_sets
    (workout_session_id, exercise_id, set_order, set_type, repetitions, weight_kg,
     rest_seconds, perceived_exertion, completed, notes)
    VALUES
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise2, 1, 'normal', 10, 0, 120, 8, true, 'Pull-ups'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise2, 2, 'normal', 8, 0, 120, 9, true, NULL),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise10, 1, 'normal', 12, 60, 90, 7, true, 'Lat pulldowns'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise10, 2, 'normal', 10, 65, 90, 8, true, NULL),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise6, 1, 'normal', 12, 20, 60, 7, true, 'Bicep curls'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise6, 2, 'normal', 10, 22.5, 60, 8, true, NULL);

    -- User 2 Day 5 (Leg day) - Add leg exercises
    INSERT INTO health_fitness.exercise_sets
    (workout_session_id, exercise_id, set_order, set_type, repetitions, weight_kg,
     rest_seconds, perceived_exertion, completed, notes)
    VALUES
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '5 days' LIMIT 1),
     exercise3, 1, 'warmup', 10, 80, 90, 6, true, 'Squat warmup'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '5 days' LIMIT 1),
     exercise3, 2, 'normal', 5, 120, 180, 9, true, 'PR attempt'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '5 days' LIMIT 1),
     exercise3, 3, 'normal', 5, 120, 180, 9, true, 'PR set 2'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '5 days' LIMIT 1),
     exercise4, 1, 'normal', 5, 100, 180, 8, true, 'Romanian deadlifts');

    -- User 2 Day 3 (Push day - shoulders) - Add shoulder exercises
    INSERT INTO health_fitness.exercise_sets
    (workout_session_id, exercise_id, set_order, set_type, repetitions, weight_kg,
     rest_seconds, perceived_exertion, completed, notes)
    VALUES
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '3 days' LIMIT 1),
     exercise5, 1, 'warmup', 10, 30, 60, 5, true, 'OHP warmup'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '3 days' LIMIT 1),
     exercise5, 2, 'normal', 8, 50, 120, 8, true, 'Working set'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '3 days' LIMIT 1),
     exercise5, 3, 'normal', 6, 55, 150, 9, true, NULL),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '3 days' LIMIT 1),
     exercise9, 1, 'normal', 20, 0, 60, 7, true, 'Push-ups'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account2 AND session_date = CURRENT_DATE - INTERVAL '3 days' LIMIT 1),
     exercise9, 2, 'normal', 15, 0, 60, 8, true, NULL);

    -- User 3 Day 6 (Full body) - Add various exercises
    INSERT INTO health_fitness.exercise_sets
    (workout_session_id, exercise_id, set_order, set_type, repetitions, weight_kg,
     rest_seconds, perceived_exertion, completed, notes)
    VALUES
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account3 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise9, 1, 'normal', 12, 0, 60, 6, true, 'Push-ups'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account3 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise9, 2, 'normal', 10, 0, 60, 7, true, NULL),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account3 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise3, 1, 'normal', 15, 30, 90, 7, true, 'Goblet squats'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account3 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise10, 1, 'normal', 12, 25, 90, 6, true, 'Lat pulldowns'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account3 AND session_date = CURRENT_DATE - INTERVAL '6 days' LIMIT 1),
     exercise7, 1, 'normal', 25, 0, 30, 7, true, 'Plank');

    -- User 3 Day 4 (Full body) - Add various exercises
    INSERT INTO health_fitness.exercise_sets
    (workout_session_id, exercise_id, set_order, set_type, repetitions, weight_kg,
     rest_seconds, perceived_exertion, completed, notes)
    VALUES
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account3 AND session_date = CURRENT_DATE - INTERVAL '4 days' LIMIT 1),
     exercise9, 1, 'normal', 15, 0, 60, 7, true, 'Push-ups'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account3 AND session_date = CURRENT_DATE - INTERVAL '4 days' LIMIT 1),
     exercise3, 1, 'normal', 15, 35, 90, 7, true, 'Goblet squats'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account3 AND session_date = CURRENT_DATE - INTERVAL '4 days' LIMIT 1),
     exercise3, 2, 'normal', 12, 40, 90, 8, true, NULL),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account3 AND session_date = CURRENT_DATE - INTERVAL '4 days' LIMIT 1),
     exercise10, 1, 'normal', 12, 30, 90, 7, true, 'Lat pulldowns'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account3 AND session_date = CURRENT_DATE - INTERVAL '4 days' LIMIT 1),
     exercise6, 1, 'normal', 15, 10, 60, 6, true, 'Bicep curls'),
    ((SELECT id FROM health_fitness.workout_sessions WHERE account_id = account3 AND session_date = CURRENT_DATE - INTERVAL '4 days' LIMIT 1),
     exercise7, 1, 'normal', 30, 0, 30, 8, true, 'Plank');

    -- ==========================================
    -- CARDIO ACTIVITIES (10 entries)
    -- ==========================================
    INSERT INTO health_fitness.cardio_activities 
    (account_id, activity_date, activity_type, duration_minutes, distance_km, pace_per_km, 
     elevation_gain_m, calories_burned, average_heart_rate, max_heart_rate, 
     perceived_exertion, enjoyment_rating, weather_conditions, temperature_c, route_name, notes)
    VALUES
    (account1, CURRENT_DATE - INTERVAL '9 days', 'running', 45, 7.5, '00:06:00', 
     50, 380, 145, 172, 7, 8, 'Sunny', 18, 'River trail', 'Morning run, felt strong'),
    
    (account1, CURRENT_DATE - INTERVAL '5 days', 'cycling', 60, 25.0, '00:02:24',
     150, 420, 135, 165, 6, 9, 'Cloudy', 20, 'Hill route', 'Good endurance ride'),
    
    (account1, CURRENT_DATE - INTERVAL '2 days', 'running', 30, 5.5, '00:05:27',
     20, 280, 150, 175, 8, 7, 'Light rain', 15, 'Neighborhood loop', 'Tempo run'),
    
    (account2, CURRENT_DATE - INTERVAL '12 days', 'running', 25, 4.0, '00:06:15',
     10, 220, 140, 168, 6, 6, 'Windy', 16, 'Park loops', 'Easy recovery run'),
    
    (account2, CURRENT_DATE - INTERVAL '4 days', 'swimming', 45, 1.5, NULL,
     0, 350, 130, 155, 7, 9, 'Indoor pool', 25, NULL, 'Felt great in water'),
    
    (account3, CURRENT_DATE - INTERVAL '15 days', 'walking', 60, 4.0, '00:15:00',
     30, 180, 95, 115, 3, 8, 'Perfect', 22, 'Nature trail', 'Peaceful walk'),
    
    (account3, CURRENT_DATE - INTERVAL '10 days', 'cycling', 30, 8.0, '00:03:45',
     40, 150, 110, 135, 4, 7, 'Sunny', 24, 'Bike path', 'Getting more comfortable'),
    
    (account3, CURRENT_DATE - INTERVAL '7 days', 'running', 20, 2.5, '00:08:00',
     5, 140, 125, 148, 5, 6, 'Overcast', 19, 'Track', 'First continuous run!'),
    
    (account3, CURRENT_DATE - INTERVAL '3 days', 'walking', 45, 3.5, '00:12:51',
     20, 140, 98, 118, 3, 9, 'Beautiful sunset', 21, 'Beach walk', 'Relaxing evening'),
    
    (account1, CURRENT_DATE, 'running', 50, 10.0, '00:05:00',
     80, 520, 155, 178, 8, 9, 'Cool morning', 12, '10k race route', 'Personal best 10k!');
    
    -- ==========================================
    -- MEALS (Extended to cover last 7 days for nutrition log widget)
    -- ==========================================
    -- User 1 historical meals (bulk insert without RETURNING)
    INSERT INTO health_fitness.meals
    (account_id, meal_date, meal_type, meal_time, location, notes)
    VALUES
    -- Day 7
    (account1, CURRENT_DATE - INTERVAL '7 days', 'breakfast', '07:30', 'home', NULL),
    (account1, CURRENT_DATE - INTERVAL '7 days', 'lunch', '12:30', 'office', NULL),
    (account1, CURRENT_DATE - INTERVAL '7 days', 'dinner', '19:00', 'home', NULL),
    -- Day 6
    (account1, CURRENT_DATE - INTERVAL '6 days', 'breakfast', '07:30', 'home', NULL),
    (account1, CURRENT_DATE - INTERVAL '6 days', 'lunch', '12:30', 'office', NULL),
    (account1, CURRENT_DATE - INTERVAL '6 days', 'dinner', '19:00', 'home', NULL),
    -- Day 5
    (account1, CURRENT_DATE - INTERVAL '5 days', 'breakfast', '07:30', 'home', NULL),
    (account1, CURRENT_DATE - INTERVAL '5 days', 'lunch', '12:30', 'office', NULL),
    (account1, CURRENT_DATE - INTERVAL '5 days', 'snack', '15:30', 'office', NULL),
    (account1, CURRENT_DATE - INTERVAL '5 days', 'dinner', '19:00', 'home', NULL),
    -- Day 4
    (account1, CURRENT_DATE - INTERVAL '4 days', 'breakfast', '07:30', 'home', NULL),
    (account1, CURRENT_DATE - INTERVAL '4 days', 'lunch', '12:30', 'office', NULL),
    (account1, CURRENT_DATE - INTERVAL '4 days', 'dinner', '19:00', 'home', NULL),
    -- Day 3
    (account1, CURRENT_DATE - INTERVAL '3 days', 'breakfast', '07:30', 'home', NULL),
    (account1, CURRENT_DATE - INTERVAL '3 days', 'lunch', '12:30', 'office', NULL),
    (account1, CURRENT_DATE - INTERVAL '3 days', 'dinner', '19:00', 'home', NULL),
    -- Day 1
    (account1, CURRENT_DATE - INTERVAL '1 day', 'breakfast', '07:00', 'home', NULL),
    (account1, CURRENT_DATE - INTERVAL '1 day', 'lunch', '12:00', 'restaurant', 'Business lunch'),
    (account1, CURRENT_DATE - INTERVAL '1 day', 'dinner', '18:30', 'home', NULL);

    -- User 1 specific meals (with RETURNING for meal_foods)
    INSERT INTO health_fitness.meals
    (account_id, meal_date, meal_type, meal_time, location, notes)
    VALUES
    (account1, CURRENT_DATE - INTERVAL '2 days', 'breakfast', '07:30', 'home', 'Post-workout meal')
    RETURNING id INTO meal1;

    INSERT INTO health_fitness.meals VALUES
    (gen_random_uuid(), account1, CURRENT_DATE - INTERVAL '2 days', 'lunch', '12:30', 'office', NULL)
    RETURNING id INTO meal2;

    INSERT INTO health_fitness.meals VALUES
    (gen_random_uuid(), account1, CURRENT_DATE - INTERVAL '2 days', 'snack', '15:30', 'office', 'Afternoon snack')
    RETURNING id INTO meal3;

    INSERT INTO health_fitness.meals VALUES
    (gen_random_uuid(), account1, CURRENT_DATE - INTERVAL '2 days', 'dinner', '19:00', 'home', 'Healthy dinner')
    RETURNING id INTO meal4;

    -- User 2 historical meals (bulk insert without RETURNING)
    INSERT INTO health_fitness.meals
    (account_id, meal_date, meal_type, meal_time, location, notes)
    VALUES
    -- Day 7
    (account2, CURRENT_DATE - INTERVAL '7 days', 'breakfast', '08:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '7 days', 'lunch', '13:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '7 days', 'dinner', '20:00', 'home', NULL),
    -- Day 6
    (account2, CURRENT_DATE - INTERVAL '6 days', 'breakfast', '08:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '6 days', 'lunch', '13:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '6 days', 'dinner', '20:00', 'home', NULL),
    -- Day 5
    (account2, CURRENT_DATE - INTERVAL '5 days', 'breakfast', '08:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '5 days', 'pre_workout', '16:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '5 days', 'post_workout', '18:30', 'gym', NULL),
    (account2, CURRENT_DATE - INTERVAL '5 days', 'dinner', '20:00', 'home', NULL),
    -- Day 4
    (account2, CURRENT_DATE - INTERVAL '4 days', 'breakfast', '08:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '4 days', 'lunch', '13:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '4 days', 'dinner', '20:00', 'home', NULL),
    -- Day 3
    (account2, CURRENT_DATE - INTERVAL '3 days', 'breakfast', '08:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '3 days', 'pre_workout', '16:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '3 days', 'post_workout', '18:30', 'gym', NULL),
    (account2, CURRENT_DATE - INTERVAL '3 days', 'dinner', '20:00', 'home', NULL),
    -- Day 2
    (account2, CURRENT_DATE - INTERVAL '2 days', 'breakfast', '08:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '2 days', 'lunch', '13:00', 'home', NULL),
    (account2, CURRENT_DATE - INTERVAL '2 days', 'dinner', '20:00', 'home', NULL),
    -- Day 1 - other meals
    (account2, CURRENT_DATE - INTERVAL '1 day', 'pre_workout', '16:00', 'home', 'Pre-workout fuel'),
    (account2, CURRENT_DATE - INTERVAL '1 day', 'post_workout', '18:30', 'gym', 'Protein shake'),
    (account2, CURRENT_DATE - INTERVAL '1 day', 'dinner', '20:00', 'home', 'High protein dinner');

    -- User 2 specific meal (with RETURNING for meal_foods)
    INSERT INTO health_fitness.meals
    (account_id, meal_date, meal_type, meal_time, location, notes)
    VALUES
    (account2, CURRENT_DATE - INTERVAL '1 day', 'breakfast', '08:00', 'home', 'Big breakfast for bulking')
    RETURNING id INTO meal5;

    -- User 3 all meals (bulk insert without RETURNING)
    INSERT INTO health_fitness.meals VALUES
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '7 days', 'breakfast', '08:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '7 days', 'lunch', '12:45', 'work', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '7 days', 'dinner', '19:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '6 days', 'breakfast', '08:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '6 days', 'lunch', '12:45', 'work', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '6 days', 'dinner', '19:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '5 days', 'breakfast', '08:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '5 days', 'lunch', '12:45', 'work', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '5 days', 'snack', '16:00', 'work', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '5 days', 'dinner', '19:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '4 days', 'breakfast', '08:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '4 days', 'lunch', '12:45', 'work', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '4 days', 'dinner', '19:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '3 days', 'breakfast', '08:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '3 days', 'lunch', '12:45', 'work', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '3 days', 'dinner', '19:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '2 days', 'breakfast', '08:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '2 days', 'lunch', '12:45', 'work', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '2 days', 'dinner', '19:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '1 day', 'breakfast', '08:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '1 day', 'lunch', '12:45', 'work', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE - INTERVAL '1 day', 'dinner', '19:30', 'home', NULL),
    (gen_random_uuid(), account3, CURRENT_DATE, 'breakfast', '08:30', 'home', 'Balanced breakfast'),
    (gen_random_uuid(), account3, CURRENT_DATE, 'lunch', '12:45', 'work', 'Meal prep'),
    (gen_random_uuid(), account3, CURRENT_DATE, 'snack', '16:00', 'work', 'Healthy snack'),
    (gen_random_uuid(), account3, CURRENT_DATE, 'dinner', '19:30', 'home', 'Light dinner');
    
    -- ==========================================
    -- MEAL FOODS (Foods consumed in meals)
    -- ==========================================
    INSERT INTO health_fitness.meal_foods 
    (meal_id, food_id, quantity_g)
    VALUES
    -- Meal 1 (User 1 breakfast)
    (meal1, food4, 200), -- Greek yogurt
    (meal1, food5, 120), -- Banana
    (meal1, (SELECT id FROM health_fitness.foods WHERE name = 'Oats'), 50),
    
    -- Meal 2 (User 1 lunch)
    (meal2, food1, 150), -- Chicken breast
    (meal2, food2, 150), -- Brown rice
    (meal2, food3, 100), -- Broccoli
    
    -- Meal 3 (User 1 snack)
    (meal3, (SELECT id FROM health_fitness.foods WHERE name = 'Almonds'), 30),
    
    -- Meal 4 (User 1 dinner)
    (meal4, (SELECT id FROM health_fitness.foods WHERE name = 'Salmon'), 150),
    (meal4, (SELECT id FROM health_fitness.foods WHERE name = 'Sweet Potato'), 200),
    (meal4, food3, 150), -- Broccoli
    
    -- Meal 5 (User 2 breakfast Day 1)
    (meal5, (SELECT id FROM health_fitness.foods WHERE name = 'Eggs'), 150), -- ~3 eggs
    (meal5, food2, 100), -- Brown rice
    (meal5, food5, 100), -- Banana

    -- User 2 Day 2 breakfast
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '2 days' AND meal_type = 'breakfast' LIMIT 1),
     (SELECT id FROM health_fitness.foods WHERE name = 'Eggs'), 150),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '2 days' AND meal_type = 'breakfast' LIMIT 1),
     food2, 80),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '2 days' AND meal_type = 'breakfast' LIMIT 1),
     food4, 150),

    -- User 2 Day 2 lunch
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '2 days' AND meal_type = 'lunch' LIMIT 1),
     food1, 200),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '2 days' AND meal_type = 'lunch' LIMIT 1),
     food2, 200),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '2 days' AND meal_type = 'lunch' LIMIT 1),
     food3, 100),

    -- User 2 Day 3 breakfast
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '3 days' AND meal_type = 'breakfast' LIMIT 1),
     food4, 200),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '3 days' AND meal_type = 'breakfast' LIMIT 1),
     (SELECT id FROM health_fitness.foods WHERE name = 'Oats'), 60),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '3 days' AND meal_type = 'breakfast' LIMIT 1),
     food5, 100),

    -- User 2 Day 4 breakfast
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '4 days' AND meal_type = 'breakfast' LIMIT 1),
     (SELECT id FROM health_fitness.foods WHERE name = 'Eggs'), 180),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '4 days' AND meal_type = 'breakfast' LIMIT 1),
     (SELECT id FROM health_fitness.foods WHERE name = 'Oats'), 50),

    -- User 2 Day 4 lunch
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '4 days' AND meal_type = 'lunch' LIMIT 1),
     (SELECT id FROM health_fitness.foods WHERE name = 'Salmon'), 180),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '4 days' AND meal_type = 'lunch' LIMIT 1),
     (SELECT id FROM health_fitness.foods WHERE name = 'Sweet Potato'), 250),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account2 AND meal_date = CURRENT_DATE - INTERVAL '4 days' AND meal_type = 'lunch' LIMIT 1),
     food3, 100),

    -- User 3 Day 1 breakfast
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE - INTERVAL '1 day' AND meal_type = 'breakfast' LIMIT 1),
     (SELECT id FROM health_fitness.foods WHERE name = 'Oats'), 50),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE - INTERVAL '1 day' AND meal_type = 'breakfast' LIMIT 1),
     food5, 100),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE - INTERVAL '1 day' AND meal_type = 'breakfast' LIMIT 1),
     (SELECT id FROM health_fitness.foods WHERE name = 'Almonds'), 20),

    -- User 3 Day 1 lunch
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE - INTERVAL '1 day' AND meal_type = 'lunch' LIMIT 1),
     food1, 120),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE - INTERVAL '1 day' AND meal_type = 'lunch' LIMIT 1),
     food2, 150),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE - INTERVAL '1 day' AND meal_type = 'lunch' LIMIT 1),
     food3, 80),

    -- User 3 Day 2 breakfast
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE - INTERVAL '2 days' AND meal_type = 'breakfast' LIMIT 1),
     (SELECT id FROM health_fitness.foods WHERE name = 'Eggs'), 120),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE - INTERVAL '2 days' AND meal_type = 'breakfast' LIMIT 1),
     food2, 80),

    -- User 3 Day 3 lunch
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE - INTERVAL '3 days' AND meal_type = 'lunch' LIMIT 1),
     food1, 100),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE - INTERVAL '3 days' AND meal_type = 'lunch' LIMIT 1),
     (SELECT id FROM health_fitness.foods WHERE name = 'Sweet Potato'), 150),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE - INTERVAL '3 days' AND meal_type = 'lunch' LIMIT 1),
     food3, 100),

    -- User 3 current day breakfast
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE AND meal_type = 'breakfast' LIMIT 1),
     food4, 150),
    ((SELECT id FROM health_fitness.meals WHERE account_id = account3 AND meal_date = CURRENT_DATE AND meal_type = 'breakfast' LIMIT 1),
     food5, 100);
    
    -- ==========================================
    -- WATER INTAKE (Extended to cover last 7 days)
    -- ==========================================
    INSERT INTO health_fitness.water_intake
    (account_id, intake_date, intake_time, amount_ml, source_type)
    VALUES
    -- User 1 - 7 days
    -- Day 7
    (account1, CURRENT_DATE - INTERVAL '7 days', '07:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '7 days', '10:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '7 days', '12:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '7 days', '15:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '7 days', '18:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '7 days', '20:00', 300, 'water'),
    -- Day 6
    (account1, CURRENT_DATE - INTERVAL '6 days', '07:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '6 days', '10:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '6 days', '12:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '6 days', '15:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '6 days', '18:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '6 days', '20:00', 300, 'water'),
    -- Day 5
    (account1, CURRENT_DATE - INTERVAL '5 days', '07:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '5 days', '09:00', 250, 'coffee'),
    (account1, CURRENT_DATE - INTERVAL '5 days', '11:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '5 days', '14:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '5 days', '17:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '5 days', '19:30', 500, 'water'),
    -- Day 4
    (account1, CURRENT_DATE - INTERVAL '4 days', '07:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '4 days', '10:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '4 days', '12:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '4 days', '15:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '4 days', '18:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '4 days', '20:00', 300, 'water'),
    -- Day 3
    (account1, CURRENT_DATE - INTERVAL '3 days', '07:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '3 days', '10:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '3 days', '12:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '3 days', '15:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '3 days', '18:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '3 days', '20:00', 300, 'water'),
    -- Day 2
    (account1, CURRENT_DATE - INTERVAL '2 days', '07:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '2 days', '10:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '2 days', '12:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '2 days', '15:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '2 days', '18:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '2 days', '20:00', 300, 'water'),
    -- Day 1
    (account1, CURRENT_DATE - INTERVAL '1 day', '07:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '1 day', '09:00', 250, 'coffee'),
    (account1, CURRENT_DATE - INTERVAL '1 day', '11:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '1 day', '14:00', 500, 'water'),
    (account1, CURRENT_DATE - INTERVAL '1 day', '17:00', 350, 'water'),
    (account1, CURRENT_DATE - INTERVAL '1 day', '19:30', 500, 'water'),

    -- User 2 - 7 days
    -- Day 7
    (account2, CURRENT_DATE - INTERVAL '7 days', '08:00', 400, 'water'),
    (account2, CURRENT_DATE - INTERVAL '7 days', '10:30', 300, 'coffee'),
    (account2, CURRENT_DATE - INTERVAL '7 days', '13:00', 500, 'water'),
    (account2, CURRENT_DATE - INTERVAL '7 days', '16:00', 600, 'water'),
    (account2, CURRENT_DATE - INTERVAL '7 days', '18:00', 1000, 'water'),
    (account2, CURRENT_DATE - INTERVAL '7 days', '21:00', 400, 'water'),
    -- Day 6
    (account2, CURRENT_DATE - INTERVAL '6 days', '08:00', 400, 'water'),
    (account2, CURRENT_DATE - INTERVAL '6 days', '10:30', 300, 'coffee'),
    (account2, CURRENT_DATE - INTERVAL '6 days', '13:00', 500, 'water'),
    (account2, CURRENT_DATE - INTERVAL '6 days', '16:00', 600, 'water'),
    (account2, CURRENT_DATE - INTERVAL '6 days', '18:00', 1000, 'water'),
    (account2, CURRENT_DATE - INTERVAL '6 days', '21:00', 400, 'water'),
    -- Day 5
    (account2, CURRENT_DATE - INTERVAL '5 days', '08:00', 400, 'water'),
    (account2, CURRENT_DATE - INTERVAL '5 days', '10:30', 300, 'coffee'),
    (account2, CURRENT_DATE - INTERVAL '5 days', '13:00', 500, 'water'),
    (account2, CURRENT_DATE - INTERVAL '5 days', '16:00', 600, 'water'),
    (account2, CURRENT_DATE - INTERVAL '5 days', '18:00', 1000, 'water'),
    (account2, CURRENT_DATE - INTERVAL '5 days', '21:00', 400, 'water'),
    -- Day 4
    (account2, CURRENT_DATE - INTERVAL '4 days', '08:00', 400, 'water'),
    (account2, CURRENT_DATE - INTERVAL '4 days', '10:30', 300, 'coffee'),
    (account2, CURRENT_DATE - INTERVAL '4 days', '13:00', 500, 'water'),
    (account2, CURRENT_DATE - INTERVAL '4 days', '16:00', 600, 'water'),
    (account2, CURRENT_DATE - INTERVAL '4 days', '18:00', 1000, 'water'),
    (account2, CURRENT_DATE - INTERVAL '4 days', '21:00', 400, 'water'),
    -- Day 3
    (account2, CURRENT_DATE - INTERVAL '3 days', '08:00', 400, 'water'),
    (account2, CURRENT_DATE - INTERVAL '3 days', '10:30', 300, 'coffee'),
    (account2, CURRENT_DATE - INTERVAL '3 days', '13:00', 500, 'water'),
    (account2, CURRENT_DATE - INTERVAL '3 days', '16:00', 600, 'water'),
    (account2, CURRENT_DATE - INTERVAL '3 days', '18:00', 1000, 'water'),
    (account2, CURRENT_DATE - INTERVAL '3 days', '21:00', 400, 'water'),
    -- Day 2
    (account2, CURRENT_DATE - INTERVAL '2 days', '08:00', 400, 'water'),
    (account2, CURRENT_DATE - INTERVAL '2 days', '10:30', 300, 'coffee'),
    (account2, CURRENT_DATE - INTERVAL '2 days', '13:00', 500, 'water'),
    (account2, CURRENT_DATE - INTERVAL '2 days', '16:00', 600, 'water'),
    (account2, CURRENT_DATE - INTERVAL '2 days', '18:00', 1000, 'water'),
    (account2, CURRENT_DATE - INTERVAL '2 days', '21:00', 400, 'water'),
    -- Day 1
    (account2, CURRENT_DATE - INTERVAL '1 day', '08:00', 400, 'water'),
    (account2, CURRENT_DATE - INTERVAL '1 day', '10:30', 300, 'coffee'),
    (account2, CURRENT_DATE - INTERVAL '1 day', '13:00', 500, 'water'),
    (account2, CURRENT_DATE - INTERVAL '1 day', '16:00', 600, 'water'),
    (account2, CURRENT_DATE - INTERVAL '1 day', '18:00', 1000, 'water'),
    (account2, CURRENT_DATE - INTERVAL '1 day', '21:00', 400, 'water'),

    -- User 3 - 7 days
    -- Day 7
    (account3, CURRENT_DATE - INTERVAL '7 days', '08:00', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '7 days', '10:00', 200, 'tea'),
    (account3, CURRENT_DATE - INTERVAL '7 days', '12:00', 400, 'water'),
    (account3, CURRENT_DATE - INTERVAL '7 days', '14:30', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '7 days', '16:30', 300, 'water'),
    (account3, CURRENT_DATE - INTERVAL '7 days', '19:00', 400, 'water'),
    -- Day 6
    (account3, CURRENT_DATE - INTERVAL '6 days', '08:00', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '6 days', '10:00', 200, 'tea'),
    (account3, CURRENT_DATE - INTERVAL '6 days', '12:00', 400, 'water'),
    (account3, CURRENT_DATE - INTERVAL '6 days', '14:30', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '6 days', '16:30', 300, 'water'),
    (account3, CURRENT_DATE - INTERVAL '6 days', '19:00', 400, 'water'),
    -- Day 5
    (account3, CURRENT_DATE - INTERVAL '5 days', '08:00', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '5 days', '10:00', 200, 'tea'),
    (account3, CURRENT_DATE - INTERVAL '5 days', '12:00', 400, 'water'),
    (account3, CURRENT_DATE - INTERVAL '5 days', '14:30', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '5 days', '16:30', 300, 'water'),
    (account3, CURRENT_DATE - INTERVAL '5 days', '19:00', 400, 'water'),
    -- Day 4
    (account3, CURRENT_DATE - INTERVAL '4 days', '08:00', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '4 days', '10:00', 200, 'tea'),
    (account3, CURRENT_DATE - INTERVAL '4 days', '12:00', 400, 'water'),
    (account3, CURRENT_DATE - INTERVAL '4 days', '14:30', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '4 days', '16:30', 300, 'water'),
    (account3, CURRENT_DATE - INTERVAL '4 days', '19:00', 400, 'water'),
    -- Day 3
    (account3, CURRENT_DATE - INTERVAL '3 days', '08:00', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '3 days', '10:00', 200, 'tea'),
    (account3, CURRENT_DATE - INTERVAL '3 days', '12:00', 400, 'water'),
    (account3, CURRENT_DATE - INTERVAL '3 days', '14:30', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '3 days', '16:30', 300, 'water'),
    (account3, CURRENT_DATE - INTERVAL '3 days', '19:00', 400, 'water'),
    -- Day 2
    (account3, CURRENT_DATE - INTERVAL '2 days', '08:00', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '2 days', '10:00', 200, 'tea'),
    (account3, CURRENT_DATE - INTERVAL '2 days', '12:00', 400, 'water'),
    (account3, CURRENT_DATE - INTERVAL '2 days', '14:30', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '2 days', '16:30', 300, 'water'),
    (account3, CURRENT_DATE - INTERVAL '2 days', '19:00', 400, 'water'),
    -- Day 1
    (account3, CURRENT_DATE - INTERVAL '1 day', '08:00', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '1 day', '10:00', 200, 'tea'),
    (account3, CURRENT_DATE - INTERVAL '1 day', '12:00', 400, 'water'),
    (account3, CURRENT_DATE - INTERVAL '1 day', '14:30', 350, 'water'),
    (account3, CURRENT_DATE - INTERVAL '1 day', '16:30', 300, 'water'),
    (account3, CURRENT_DATE - INTERVAL '1 day', '19:00', 400, 'water'),
    -- Current day
    (account3, CURRENT_DATE, '08:00', 350, 'water'),
    (account3, CURRENT_DATE, '10:00', 200, 'tea'),
    (account3, CURRENT_DATE, '12:00', 400, 'water'),
    (account3, CURRENT_DATE, '14:30', 350, 'water'),
    (account3, CURRENT_DATE, '16:30', 300, 'water'),
    (account3, CURRENT_DATE, '19:00', 400, 'water');
    
    -- ==========================================
    -- SUPPLEMENT INTAKE (Daily supplements)
    -- ==========================================
    INSERT INTO health_fitness.supplement_intake 
    (account_id, supplement_id, intake_date, intake_time, quantity, unit, notes)
    VALUES
    -- User 1
    (account1, supplement3, CURRENT_DATE - INTERVAL '5 days', '07:00', 1, 'tablet', 'Daily multivitamin'),
    (account1, supplement1, CURRENT_DATE - INTERVAL '5 days', '07:30', 30, 'grams', 'Post-workout protein'),
    (account1, supplement3, CURRENT_DATE - INTERVAL '4 days', '07:00', 1, 'tablet', NULL),
    (account1, supplement1, CURRENT_DATE - INTERVAL '4 days', '07:30', 30, 'grams', NULL),
    (account1, supplement3, CURRENT_DATE - INTERVAL '3 days', '07:00', 1, 'tablet', NULL),
    (account1, supplement3, CURRENT_DATE - INTERVAL '2 days', '07:00', 1, 'tablet', NULL),
    (account1, supplement1, CURRENT_DATE - INTERVAL '2 days', '19:30', 30, 'grams', 'Evening protein'),
    (account1, supplement3, CURRENT_DATE - INTERVAL '1 day', '07:00', 1, 'tablet', NULL),
    
    -- User 2
    (account2, supplement1, CURRENT_DATE - INTERVAL '3 days', '08:00', 40, 'grams', 'Morning shake'),
    (account2, supplement2, CURRENT_DATE - INTERVAL '3 days', '16:00', 5, 'grams', 'Pre-workout creatine'),
    (account2, supplement1, CURRENT_DATE - INTERVAL '3 days', '18:30', 40, 'grams', 'Post-workout'),
    (account2, supplement1, CURRENT_DATE - INTERVAL '2 days', '08:00', 40, 'grams', NULL),
    (account2, supplement2, CURRENT_DATE - INTERVAL '2 days', '16:00', 5, 'grams', NULL),
    (account2, supplement1, CURRENT_DATE - INTERVAL '2 days', '18:30', 40, 'grams', NULL),
    (account2, supplement1, CURRENT_DATE - INTERVAL '1 day', '08:00', 40, 'grams', NULL),
    (account2, supplement2, CURRENT_DATE - INTERVAL '1 day', '16:00', 5, 'grams', NULL),
    (account2, supplement1, CURRENT_DATE - INTERVAL '1 day', '18:30', 40, 'grams', NULL),
    (account2, supplement3, CURRENT_DATE - INTERVAL '1 day', '08:00', 1, 'tablet', NULL),
    
    -- User 3
    (account3, supplement3, CURRENT_DATE - INTERVAL '7 days', '08:30', 1, 'tablet', 'Starting supplement routine'),
    (account3, supplement3, CURRENT_DATE - INTERVAL '6 days', '08:30', 1, 'tablet', NULL),
    (account3, supplement3, CURRENT_DATE - INTERVAL '5 days', '08:30', 1, 'tablet', NULL),
    (account3, (SELECT id FROM health_fitness.supplements WHERE name = 'Vitamin D3'), CURRENT_DATE - INTERVAL '5 days', '08:30', 1000, 'IU', 'Doctor recommended'),
    (account3, supplement3, CURRENT_DATE - INTERVAL '4 days', '08:30', 1, 'tablet', NULL),
    (account3, supplement3, CURRENT_DATE - INTERVAL '3 days', '08:30', 1, 'tablet', NULL),
    (account3, supplement3, CURRENT_DATE - INTERVAL '2 days', '08:30', 1, 'tablet', NULL),
    (account3, supplement3, CURRENT_DATE - INTERVAL '1 day', '08:30', 1, 'tablet', NULL),
    (account3, supplement3, CURRENT_DATE, '08:30', 1, 'tablet', NULL);
    
    -- ==========================================
    -- HEALTH GOALS (9 goals)
    -- ==========================================
    INSERT INTO health_fitness.health_goals 
    (account_id, goal_type, title, description, target_value, current_value, unit, 
     start_date, target_date, status, priority)
    VALUES
    (account1, 'weight_loss', 'Lose 10kg of body weight',
     'Reduce weight from 85kg to 75kg through diet and exercise',
     75, 79.5, 'kg', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '30 days',
     'in_progress', 'high'),
    
    (account1, 'body_fat', 'Reach 15% body fat',
     'Reduce body fat percentage while maintaining muscle mass',
     15, 17.2, 'percent', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '60 days',
     'in_progress', 'high'),
    
    (account1, 'strength', 'Bench press 100kg',
     'Increase bench press 1RM to 100kg',
     100, 90, 'kg', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '90 days',
     'in_progress', 'medium'),
    
    (account2, 'muscle_gain', 'Gain 8kg of muscle mass',
     'Bulk up from 70kg to 78kg with clean muscle gain',
     78, 77.5, 'kg', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '30 days',
     'in_progress', 'high'),
    
    (account2, 'strength', 'Squat 150kg',
     'Increase squat 1RM to 150kg',
     150, 135, 'kg', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '60 days',
     'in_progress', 'high'),
    
    (account2, 'endurance', 'Run 5k in under 25 minutes',
     'Improve cardiovascular fitness to run 5k faster',
     25, 28, 'minutes', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '60 days',
     'in_progress', 'low'),
    
    (account3, 'general_fitness', 'Exercise 3x per week consistently',
     'Build consistent exercise habit',
     12, 8, 'sessions', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days',
     'in_progress', 'high'),
    
    (account3, 'body_composition', 'Reduce body fat to 20%',
     'Improve body composition through exercise and nutrition',
     20, 20.5, 'percent', CURRENT_DATE - INTERVAL '75 days', CURRENT_DATE + INTERVAL '15 days',
     'in_progress', 'medium'),
    
    (account3, 'flexibility', 'Touch toes comfortably',
     'Improve flexibility through daily stretching',
     1, 0.7, 'achievement', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days',
     'in_progress', 'low');
    
    -- ==========================================
    -- WELLNESS LOGS (15 entries)
    -- ==========================================
    INSERT INTO health_fitness.wellness_logs 
    (account_id, log_date, overall_wellness, stress_level, anxiety_level, mood_rating, 
     motivation_level, social_connection, work_life_balance, symptoms, notes)
    VALUES
    (account1, CURRENT_DATE - INTERVAL '10 days', 8, 4, 3, 8, 9, 7, 7, 
     ARRAY[]::TEXT[], 'Feeling great with workout progress'),
    (account1, CURRENT_DATE - INTERVAL '7 days', 7, 5, 4, 7, 8, 6, 6,
     ARRAY['mild_headache'], 'Work stress affecting wellness'),
    (account1, CURRENT_DATE - INTERVAL '5 days', 8, 3, 3, 8, 9, 8, 7,
     ARRAY[]::TEXT[], 'Much better after rest day'),
    (account1, CURRENT_DATE - INTERVAL '3 days', 9, 3, 2, 9, 9, 8, 8,
     ARRAY[]::TEXT[], 'Excellent day overall'),
    (account1, CURRENT_DATE - INTERVAL '1 day', 8, 4, 3, 8, 8, 7, 7,
     ARRAY['muscle_soreness'], 'Good but sore from workout'),
    (account1, CURRENT_DATE - INTERVAL '6 days', 8, 4, 3, 8, 8, 7, 7,
     ARRAY[]::TEXT[], 'Steady progress continuing'),
    (account1, CURRENT_DATE - INTERVAL '4 days', 8, 3, 3, 8, 9, 8, 7,
     ARRAY[]::TEXT[], 'Energy levels excellent'),
    (account1, CURRENT_DATE - INTERVAL '2 days', 8, 4, 4, 8, 8, 7, 7,
     ARRAY['mild_fatigue'], 'Slight fatigue from training'),
    (account1, CURRENT_DATE, 9, 3, 2, 9, 9, 8, 8,
     ARRAY[]::TEXT[], 'Feeling fantastic today'),

    (account2, CURRENT_DATE - INTERVAL '8 days', 7, 5, 5, 7, 7, 6, 5,
     ARRAY['fatigue'], 'Bulking making me tired'),
    (account2, CURRENT_DATE - INTERVAL '7 days', 7, 5, 4, 7, 8, 6, 6,
     ARRAY[]::TEXT[], 'Getting used to training volume'),
    (account2, CURRENT_DATE - INTERVAL '6 days', 8, 4, 4, 8, 8, 7, 6,
     ARRAY['muscle_soreness'], 'DOMS from pull day'),
    (account2, CURRENT_DATE - INTERVAL '4 days', 8, 4, 4, 8, 8, 7, 6,
     ARRAY[]::TEXT[], 'Recovering well'),
    (account2, CURRENT_DATE - INTERVAL '2 days', 8, 4, 3, 8, 9, 7, 7,
     ARRAY['muscle_soreness'], 'Back DOMS'),
    (account2, CURRENT_DATE - INTERVAL '5 days', 8, 4, 4, 8, 8, 7, 6,
     ARRAY[]::TEXT[], 'Energy improving with better sleep'),
    (account2, CURRENT_DATE - INTERVAL '3 days', 8, 4, 3, 8, 9, 7, 6,
     ARRAY['muscle_soreness'], 'Leg day DOMS'),
    (account2, CURRENT_DATE - INTERVAL '1 day', 9, 3, 3, 9, 9, 8, 7,
     ARRAY[]::TEXT[], 'Feeling strong and healthy'),
    (account2, CURRENT_DATE, 9, 3, 2, 9, 9, 8, 8,
     ARRAY[]::TEXT[], 'Peak performance today'),

    (account3, CURRENT_DATE - INTERVAL '14 days', 6, 6, 6, 6, 5, 5, 5,
     ARRAY['fatigue', 'brain_fog'], 'Starting point - room to improve'),
    (account3, CURRENT_DATE - INTERVAL '10 days', 7, 5, 5, 7, 6, 6, 6,
     ARRAY['fatigue'], 'Slowly improving with exercise'),
    (account3, CURRENT_DATE - INTERVAL '7 days', 7, 5, 4, 7, 7, 6, 6,
     ARRAY[]::TEXT[], 'Exercise helping mood'),
    (account3, CURRENT_DATE - INTERVAL '4 days', 8, 4, 4, 8, 8, 7, 7,
     ARRAY[]::TEXT[], 'Significant improvement'),
    (account3, CURRENT_DATE - INTERVAL '6 days', 7, 5, 4, 7, 7, 7, 6,
     ARRAY[]::TEXT[], 'Consistent progress'),
    (account3, CURRENT_DATE - INTERVAL '5 days', 8, 4, 4, 8, 8, 7, 7,
     ARRAY[]::TEXT[], 'Energy levels improving'),
    (account3, CURRENT_DATE - INTERVAL '3 days', 8, 4, 3, 8, 8, 7, 7,
     ARRAY[]::TEXT[], 'Workout routine becoming easier'),
    (account3, CURRENT_DATE - INTERVAL '1 day', 8, 3, 3, 8, 9, 8, 7,
     ARRAY[]::TEXT[], 'Great momentum'),
    (account3, CURRENT_DATE - INTERVAL '2 days', 8, 4, 3, 8, 8, 7, 7,
     ARRAY['mild_muscle_soreness'], 'Feeling healthier than ever'),
    (account3, CURRENT_DATE, 9, 3, 3, 9, 9, 8, 8,
     ARRAY[]::TEXT[], 'Amazing transformation in 2 weeks!')
    ON CONFLICT (account_id, log_date) DO NOTHING;
    
    -- ==========================================
    -- MEDICAL CONDITIONS (Sample data)
    -- ==========================================
    INSERT INTO health_fitness.medical_conditions 
    (account_id, condition_name, diagnosis_date, severity, status, medication, doctor_name, notes)
    VALUES
    (account1, 'Mild Hypertension', CURRENT_DATE - INTERVAL '180 days', 'mild', 'managed',
     ARRAY['Lifestyle modifications'], 'Dr. Smith', 'Controlled through diet and exercise'),
    
    (account3, 'Pre-diabetes', CURRENT_DATE - INTERVAL '100 days', 'mild', 'managed',
     ARRAY['Metformin 500mg'], 'Dr. Johnson', 'Improving with lifestyle changes');
    
    -- ==========================================
    -- MEDICATIONS (Current medications)
    -- ==========================================
    INSERT INTO health_fitness.medications 
    (account_id, medication_name, dosage, frequency, start_date, prescribing_doctor, purpose, is_active)
    VALUES
    (account3, 'Metformin', '500mg', 'Twice daily', CURRENT_DATE - INTERVAL '100 days',
     'Dr. Johnson', 'Blood sugar control', true),
    
    (account1, 'Ibuprofen', '400mg', 'As needed', CURRENT_DATE - INTERVAL '10 days',
     'Self', 'Muscle soreness', true);
    
    -- ==========================================
    -- INJURIES (Sample injury tracking)
    -- ==========================================
    INSERT INTO health_fitness.injuries 
    (account_id, injury_name, body_part, injury_date, injury_type, severity, cause, 
     treatment, recovery_time_days, status, affects_exercise, restricted_activities, notes)
    VALUES
    (account2, 'Lower back strain', 'Lower back', CURRENT_DATE - INTERVAL '45 days',
     'strain', 'minor', 'Deadlift with poor form',
     'Rest, ice, gentle stretching, physiotherapy',
     14, 'healed', true, ARRAY['heavy_deadlifts', 'heavy_squats'],
     'Fully recovered, focusing on form now'),
    
    (account1, 'Tennis elbow', 'Right elbow', CURRENT_DATE - INTERVAL '20 days',
     'tendinitis', 'minor', 'Overuse from pull-ups',
     'Rest, ice, compression, modified exercises',
     21, 'recovering', true, ARRAY['pull_ups', 'heavy_curls'],
     'Improving, using straps for pulling movements');
    
    -- ==========================================
    -- DAILY SUMMARIES (Extended to cover last 7 days for calorie balance widget)
    -- ==========================================
    INSERT INTO health_fitness.daily_summaries
    (account_id, summary_date, total_calories_consumed, total_calories_burned, net_calories,
     total_protein_g, total_carbs_g, total_fat_g, total_fiber_g, total_water_ml,
     workout_duration_minutes, steps_count, active_minutes, sleep_hours, sleep_quality, weight_kg)
    VALUES
    -- User 1 - 7 days
    (account1, CURRENT_DATE - INTERVAL '7 days', 2050, 2400, -350,
     162, 215, 63, 34, 2500, 60, 11500, 85, 7.6, 8, 80.2),
    (account1, CURRENT_DATE - INTERVAL '6 days', 2100, 2450, -350,
     165, 220, 65, 35, 2500, 60, 12000, 90, 7.5, 8, 80.0),
    (account1, CURRENT_DATE - INTERVAL '5 days', 2050, 2400, -350,
     163, 218, 64, 33, 2450, 45, 11000, 75, 7.7, 9, 79.9),
    (account1, CURRENT_DATE - INTERVAL '4 days', 2100, 2420, -320,
     166, 222, 66, 36, 2500, 30, 10500, 70, 7.4, 8, 79.8),
    (account1, CURRENT_DATE - INTERVAL '3 days', 2080, 2430, -350,
     164, 219, 65, 35, 2500, 60, 11800, 85, 7.5, 8, 79.7),
    (account1, CURRENT_DATE - INTERVAL '2 days', 2100, 2450, -350,
     165, 220, 65, 35, 2500, 60, 12000, 90, 7.5, 8, 79.8),
    (account1, CURRENT_DATE - INTERVAL '1 day', 2000, 2200, -200,
     160, 200, 60, 32, 2450, 0, 8000, 45, 7.5, 8, 79.6),

    -- User 2 - 7 days
    (account2, CURRENT_DATE - INTERVAL '7 days', 3150, 2750, 400,
     198, 395, 98, 39, 3200, 90, 6000, 100, 7.0, 7, 76.8),
    (account2, CURRENT_DATE - INTERVAL '6 days', 3180, 2780, 400,
     199, 398, 99, 40, 3200, 90, 6200, 105, 7.1, 7, 77.0),
    (account2, CURRENT_DATE - INTERVAL '5 days', 3200, 2800, 400,
     200, 400, 100, 40, 3200, 105, 6000, 110, 7.2, 8, 77.2),
    (account2, CURRENT_DATE - INTERVAL '4 days', 3150, 2750, 400,
     198, 395, 98, 39, 3200, 90, 5800, 100, 7.1, 7, 77.3),
    (account2, CURRENT_DATE - INTERVAL '3 days', 3180, 2780, 400,
     199, 398, 99, 40, 3200, 75, 6100, 95, 6.9, 7, 77.4),
    (account2, CURRENT_DATE - INTERVAL '2 days', 3200, 2800, 400,
     200, 400, 100, 40, 3200, 80, 6000, 100, 7.1, 7, 77.5),
    (account2, CURRENT_DATE - INTERVAL '1 day', 3200, 2800, 400,
     200, 400, 100, 40, 3200, 90, 6000, 100, 7.0, 7, 77.5),

    -- User 3 - 7 days
    (account3, CURRENT_DATE - INTERVAL '7 days', 1780, 1850, -70,
     88, 198, 68, 27, 2000, 45, 6800, 55, 7.0, 7, 69.8),
    (account3, CURRENT_DATE - INTERVAL '6 days', 1800, 1900, -100,
     90, 200, 70, 28, 2000, 45, 7000, 60, 7.1, 7, 69.7),
    (account3, CURRENT_DATE - INTERVAL '5 days', 1820, 1920, -100,
     91, 202, 71, 29, 2000, 50, 7200, 65, 7.2, 8, 69.6),
    (account3, CURRENT_DATE - INTERVAL '4 days', 1800, 1900, -100,
     90, 200, 70, 28, 2000, 45, 7000, 60, 7.1, 7, 69.6),
    (account3, CURRENT_DATE - INTERVAL '3 days', 1810, 1910, -100,
     90, 201, 70, 28, 2000, 45, 7100, 62, 7.3, 8, 69.5),
    (account3, CURRENT_DATE - INTERVAL '2 days', 1800, 1900, -100,
     90, 200, 70, 28, 2000, 30, 7000, 50, 7.4, 8, 69.5),
    (account3, CURRENT_DATE - INTERVAL '1 day', 1790, 1890, -100,
     89, 199, 69, 27, 2000, 45, 7000, 60, 7.3, 8, 69.5),
    (account3, CURRENT_DATE, 1800, 1900, -100,
     90, 200, 70, 28, 2000, 45, 7000, 60, 7.5, 9, 69.5)
    ON CONFLICT (account_id, summary_date) DO NOTHING;

END $$;

-- Verify the seeding worked
DO $$
BEGIN
    RAISE NOTICE 'Health & Fitness seeding completed successfully!';
    RAISE NOTICE 'Summary of seeded data:';
    RAISE NOTICE '- Exercises: %', (SELECT COUNT(*) FROM health_fitness.exercises);
    RAISE NOTICE '- Body measurements: %', (SELECT COUNT(*) FROM health_fitness.body_measurements);
    RAISE NOTICE '- Health metrics: %', (SELECT COUNT(*) FROM health_fitness.health_metrics);
    RAISE NOTICE '- Sleep records: %', (SELECT COUNT(*) FROM health_fitness.sleep_records);
    RAISE NOTICE '- Workout plans: %', (SELECT COUNT(*) FROM health_fitness.workout_plans);
    RAISE NOTICE '- Workout sessions: %', (SELECT COUNT(*) FROM health_fitness.workout_sessions);
    RAISE NOTICE '- Exercise sets: %', (SELECT COUNT(*) FROM health_fitness.exercise_sets);
    RAISE NOTICE '- Cardio activities: %', (SELECT COUNT(*) FROM health_fitness.cardio_activities);
    RAISE NOTICE '- Meals: %', (SELECT COUNT(*) FROM health_fitness.meals);
    RAISE NOTICE '- Meal foods: %', (SELECT COUNT(*) FROM health_fitness.meal_foods);
    RAISE NOTICE '- Water intake: %', (SELECT COUNT(*) FROM health_fitness.water_intake);
    RAISE NOTICE '- Supplement intake: %', (SELECT COUNT(*) FROM health_fitness.supplement_intake);
    RAISE NOTICE '- Health goals: %', (SELECT COUNT(*) FROM health_fitness.health_goals);
    RAISE NOTICE '- Wellness logs: %', (SELECT COUNT(*) FROM health_fitness.wellness_logs);
    RAISE NOTICE '- Medical conditions: %', (SELECT COUNT(*) FROM health_fitness.medical_conditions);
    RAISE NOTICE '- Medications: %', (SELECT COUNT(*) FROM health_fitness.medications);
    RAISE NOTICE '- Injuries: %', (SELECT COUNT(*) FROM health_fitness.injuries);
    RAISE NOTICE '- Daily summaries: %', (SELECT COUNT(*) FROM health_fitness.daily_summaries);
END $$;