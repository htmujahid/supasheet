-- Personal Health and Fitness Database Schema
-- PostgreSQL implementation for comprehensive health and fitness tracking

-- Create database (uncomment if needed)
-- CREATE DATABASE personal_health_fitness;

-- Use the database
-- \c personal_health_fitness;
create schema if not exists health_fitness;

grant usage on schema health_fitness to authenticated;

-- Body Measurements & Weight Tracking
CREATE TABLE health_fitness.body_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,2),
    muscle_mass_kg DECIMAL(5,2),
    water_percentage DECIMAL(4,2),
    bone_mass_kg DECIMAL(4,2),
    visceral_fat INTEGER,
    metabolic_age INTEGER,
    bmr_calories INTEGER, -- Basal Metabolic Rate
    waist_cm DECIMAL(5,2),
    chest_cm DECIMAL(5,2),
    hips_cm DECIMAL(5,2),
    thigh_cm DECIMAL(5,2),
    bicep_cm DECIMAL(5,2),
    neck_cm DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.body_measurements from anon, authenticated, service_role;
grant select on table health_fitness.body_measurements to authenticated;

alter table health_fitness.body_measurements enable row level security;

create policy "Allow authenticated read access" on health_fitness.body_measurements
    for select
    to authenticated
    using (true);

-- Health Metrics (Blood Pressure, Heart Rate, etc.)
CREATE TABLE health_fitness.health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    measurement_time TIME DEFAULT CURRENT_TIME,
    systolic_bp INTEGER, -- Systolic blood pressure
    diastolic_bp INTEGER, -- Diastolic blood pressure
    resting_heart_rate INTEGER,
    max_heart_rate INTEGER,
    blood_sugar_mg_dl INTEGER,
    cholesterol_total INTEGER,
    cholesterol_hdl INTEGER,
    cholesterol_ldl INTEGER,
    triglycerides INTEGER,
    body_temperature_c DECIMAL(4,2),
    oxygen_saturation DECIMAL(4,2),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.health_metrics from anon, authenticated, service_role;
grant select on table health_fitness.health_metrics to authenticated;

alter table health_fitness.health_metrics enable row level security;

create policy "Allow authenticated read access" on health_fitness.health_metrics
    for select
    to authenticated
    using (true);

-- Sleep Tracking
CREATE TABLE health_fitness.sleep_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    sleep_date DATE NOT NULL DEFAULT CURRENT_DATE,
    bedtime TIME,
    wake_time TIME,
    total_sleep_hours DECIMAL(4,2),
    deep_sleep_hours DECIMAL(4,2),
    light_sleep_hours DECIMAL(4,2),
    rem_sleep_hours DECIMAL(4,2),
    awake_time_hours DECIMAL(4,2),
    sleep_efficiency DECIMAL(4,2), -- Percentage
    times_awakened INTEGER,
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    sleep_latency_minutes INTEGER, -- Time to fall asleep
    nap_duration_minutes INTEGER,
    caffeine_before_bed BOOLEAN DEFAULT FALSE,
    alcohol_before_bed BOOLEAN DEFAULT FALSE,
    screen_time_before_bed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, sleep_date)
);

revoke all on table health_fitness.sleep_records from anon, authenticated, service_role;
grant select on table health_fitness.sleep_records to authenticated;

alter table health_fitness.sleep_records enable row level security;

create policy "Allow authenticated read access" on health_fitness.sleep_records
    for select
    to authenticated
    using (true);

-- Exercise Categories and Types
CREATE TABLE health_fitness.exercise_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    muscle_groups TEXT[], -- Array of muscle groups
    equipment_needed TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.exercise_categories from anon, authenticated, service_role;
grant select on table health_fitness.exercise_categories to authenticated;

alter table health_fitness.exercise_categories enable row level security;

create policy "Allow authenticated read access" on health_fitness.exercise_categories
    for select
    to authenticated
    using (true);

CREATE TABLE health_fitness.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    category_id INTEGER REFERENCES health_fitness.exercise_categories(id),
    description TEXT,
    instructions TEXT,
    primary_muscles TEXT[],
    secondary_muscles TEXT[],
    equipment TEXT[],
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    is_compound BOOLEAN DEFAULT FALSE, -- Compound vs isolation exercise
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.exercises from anon, authenticated, service_role;
grant select on table health_fitness.exercises to authenticated;

alter table health_fitness.exercises enable row level security;

create policy "Allow authenticated read access" on health_fitness.exercises
    for select
    to authenticated
    using (true);

-- Workout Plans/Templates
CREATE TABLE health_fitness.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    plan_type VARCHAR(50), -- strength, cardio, hiit, yoga, etc.
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    duration_weeks INTEGER,
    days_per_week INTEGER,
    estimated_duration_minutes INTEGER,
    goal VARCHAR(100), -- weight_loss, muscle_gain, endurance, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100), -- trainer, app, user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.workout_plans from anon, authenticated, service_role;
grant select on table health_fitness.workout_plans to authenticated;

alter table health_fitness.workout_plans enable row level security;

create policy "Allow authenticated read access" on health_fitness.workout_plans
    for select
    to authenticated
    using (true);

-- Workout Sessions
CREATE TABLE health_fitness.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES health_fitness.workout_plans(id) ON DELETE SET NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_minutes INTEGER,
    session_type VARCHAR(50), -- strength, cardio, hiit, yoga, stretching, etc.
    intensity_level INTEGER CHECK (intensity_level >= 1 AND intensity_level <= 10),
    calories_burned INTEGER,
    average_heart_rate INTEGER,
    max_heart_rate INTEGER,
    perceived_exertion INTEGER CHECK (perceived_exertion >= 1 AND perceived_exertion <= 10), -- RPE scale
    workout_quality INTEGER CHECK (workout_quality >= 1 AND workout_quality <= 10),
    location VARCHAR(100), -- gym, home, outdoor, etc.
    weather_conditions VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.workout_sessions from anon, authenticated, service_role;
grant select on table health_fitness.workout_sessions to authenticated;

alter table health_fitness.workout_sessions enable row level security;

create policy "Allow authenticated read access" on health_fitness.workout_sessions
    for select
    to authenticated
    using (true);

-- Exercise Sets within Workouts
CREATE TABLE health_fitness.exercise_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_session_id UUID REFERENCES health_fitness.workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES health_fitness.exercises(id),
    set_order INTEGER NOT NULL,
    set_type VARCHAR(20) CHECK (set_type IN ('normal', 'warmup', 'drop', 'super', 'failure')) DEFAULT 'normal',
    repetitions INTEGER,
    weight_kg DECIMAL(6,2),
    distance_km DECIMAL(8,3), -- For cardio exercises
    duration_seconds INTEGER,
    rest_seconds INTEGER,
    calories_burned INTEGER,
    average_heart_rate INTEGER,
    max_heart_rate INTEGER,
    perceived_exertion INTEGER CHECK (perceived_exertion >= 1 AND perceived_exertion <= 10),
    notes TEXT,
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.exercise_sets from anon, authenticated, service_role;
grant select on table health_fitness.exercise_sets to authenticated;

alter table health_fitness.exercise_sets enable row level security;

create policy "Allow authenticated read access" on health_fitness.exercise_sets
    for select
    to authenticated
    using (true);

-- Cardio Activities
CREATE TABLE health_fitness.cardio_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    activity_type VARCHAR(100), -- running, cycling, swimming, walking, etc.
    duration_minutes INTEGER,
    distance_km DECIMAL(8,3),
    pace_per_km TIME, -- Average pace
    elevation_gain_m INTEGER,
    calories_burned INTEGER,
    average_heart_rate INTEGER,
    max_heart_rate INTEGER,
    average_power INTEGER, -- For cycling
    average_cadence INTEGER,
    route_name VARCHAR(200),
    weather_conditions VARCHAR(100),
    temperature_c INTEGER,
    perceived_exertion INTEGER CHECK (perceived_exertion >= 1 AND perceived_exertion <= 10),
    enjoyment_rating INTEGER CHECK (enjoyment_rating >= 1 AND enjoyment_rating <= 10),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.cardio_activities from anon, authenticated, service_role;
grant select on table health_fitness.cardio_activities to authenticated;

alter table health_fitness.cardio_activities enable row level security;

create policy "Allow authenticated read access" on health_fitness.cardio_activities
    for select
    to authenticated
    using (true);

-- Nutrition - Food Database
CREATE TABLE health_fitness.foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    barcode VARCHAR(50),
    serving_size_g DECIMAL(8,3),
    serving_description VARCHAR(100), -- 1 cup, 1 slice, etc.
    calories_per_100g DECIMAL(8,3),
    protein_g_per_100g DECIMAL(6,3),
    carbs_g_per_100g DECIMAL(6,3),
    fiber_g_per_100g DECIMAL(6,3),
    sugar_g_per_100g DECIMAL(6,3),
    fat_g_per_100g DECIMAL(6,3),
    saturated_fat_g_per_100g DECIMAL(6,3),
    sodium_mg_per_100g DECIMAL(8,3),
    potassium_mg_per_100g DECIMAL(8,3),
    vitamin_c_mg_per_100g DECIMAL(6,3),
    calcium_mg_per_100g DECIMAL(6,3),
    iron_mg_per_100g DECIMAL(6,3),
    food_category VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.foods from anon, authenticated, service_role;
grant select on table health_fitness.foods to authenticated;

alter table health_fitness.foods enable row level security;

create policy "Allow authenticated read access" on health_fitness.foods
    for select
    to authenticated
    using (true);

-- Meals and Food Intake
CREATE TABLE health_fitness.meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout')) NOT NULL,
    meal_time TIME,
    location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.meals from anon, authenticated, service_role;
grant select on table health_fitness.meals to authenticated;

alter table health_fitness.meals enable row level security;

create policy "Allow authenticated read access" on health_fitness.meals
    for select
    to authenticated
    using (true);

CREATE TABLE health_fitness.meal_foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_id UUID REFERENCES health_fitness.meals(id) ON DELETE CASCADE,
    food_id UUID REFERENCES health_fitness.foods(id),
    quantity_g DECIMAL(8,3) NOT NULL,
    calories DECIMAL(8,3),
    protein_g DECIMAL(6,3),
    carbs_g DECIMAL(6,3),
    fat_g DECIMAL(6,3),
    fiber_g DECIMAL(6,3),
    sugar_g DECIMAL(6,3),
    sodium_mg DECIMAL(8,3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.meal_foods from anon, authenticated, service_role;
grant select on table health_fitness.meal_foods to authenticated;

alter table health_fitness.meal_foods enable row level security;

create policy "Allow authenticated read access" on health_fitness.meal_foods
    for select
    to authenticated
    using (true);

-- Water Intake Tracking
CREATE TABLE health_fitness.water_intake (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    intake_date DATE NOT NULL DEFAULT CURRENT_DATE,
    intake_time TIME DEFAULT CURRENT_TIME,
    amount_ml INTEGER NOT NULL,
    source_type VARCHAR(50) DEFAULT 'water', -- water, tea, coffee, juice, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.water_intake from anon, authenticated, service_role;
grant select on table health_fitness.water_intake to authenticated;

alter table health_fitness.water_intake enable row level security;

create policy "Allow authenticated read access" on health_fitness.water_intake
    for select
    to authenticated
    using (true);

-- Supplements
CREATE TABLE health_fitness.supplements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    supplement_type VARCHAR(100), -- vitamin, mineral, protein, etc.
    serving_size VARCHAR(100),
    serving_unit VARCHAR(50),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.supplements from anon, authenticated, service_role;
grant select on table health_fitness.supplements to authenticated;

alter table health_fitness.supplements enable row level security;

create policy "Allow authenticated read access" on health_fitness.supplements
    for select
    to authenticated
    using (true);

CREATE TABLE health_fitness.supplement_intake (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    supplement_id UUID REFERENCES health_fitness.supplements(id),
    intake_date DATE NOT NULL DEFAULT CURRENT_DATE,
    intake_time TIME DEFAULT CURRENT_TIME,
    quantity DECIMAL(8,3),
    unit VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.supplement_intake from anon, authenticated, service_role;
grant select on table health_fitness.supplement_intake to authenticated;

alter table health_fitness.supplement_intake enable row level security;

create policy "Allow authenticated read access" on health_fitness.supplement_intake
    for select
    to authenticated
    using (true);

-- Health Goals
CREATE TABLE health_fitness.health_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    goal_type VARCHAR(50), -- weight_loss, muscle_gain, strength, endurance, etc.
    title VARCHAR(300) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,3),
    current_value DECIMAL(10,3) DEFAULT 0,
    unit VARCHAR(50),
    start_date DATE NOT NULL,
    target_date DATE,
    status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused', 'cancelled')) DEFAULT 'not_started',
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.health_goals from anon, authenticated, service_role;
grant select on table health_fitness.health_goals to authenticated;

alter table health_fitness.health_goals enable row level security;

create policy "Allow authenticated read access" on health_fitness.health_goals
    for select
    to authenticated
    using (true);

-- Medical Information
CREATE TABLE health_fitness.medical_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    condition_name VARCHAR(200) NOT NULL,
    diagnosis_date DATE,
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),
    status VARCHAR(20) CHECK (status IN ('active', 'resolved', 'managed')) DEFAULT 'active',
    medication TEXT[],
    notes TEXT,
    doctor_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.medical_conditions from anon, authenticated, service_role;
grant select on table health_fitness.medical_conditions to authenticated;

alter table health_fitness.medical_conditions enable row level security;

create policy "Allow authenticated read access" on health_fitness.medical_conditions
    for select
    to authenticated
    using (true);

CREATE TABLE health_fitness.medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    medication_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100), -- once daily, twice daily, as needed, etc.
    start_date DATE,
    end_date DATE,
    prescribing_doctor VARCHAR(100),
    purpose TEXT,
    side_effects TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.medications from anon, authenticated, service_role;
grant select on table health_fitness.medications to authenticated;

alter table health_fitness.medications enable row level security;

create policy "Allow authenticated read access" on health_fitness.medications
    for select
    to authenticated
    using (true);

-- Injury and Recovery Tracking
CREATE TABLE health_fitness.injuries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    injury_name VARCHAR(200) NOT NULL,
    body_part VARCHAR(100),
    injury_date DATE NOT NULL,
    injury_type VARCHAR(100), -- strain, sprain, fracture, etc.
    severity VARCHAR(20) CHECK (severity IN ('minor', 'moderate', 'major')),
    cause TEXT,
    treatment TEXT,
    recovery_time_days INTEGER,
    status VARCHAR(20) CHECK (status IN ('active', 'recovering', 'healed')) DEFAULT 'active',
    affects_exercise BOOLEAN DEFAULT TRUE,
    restricted_activities TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.injuries from anon, authenticated, service_role;
grant select on table health_fitness.injuries to authenticated;

alter table health_fitness.injuries enable row level security;

create policy "Allow authenticated read access" on health_fitness.injuries
    for select
    to authenticated
    using (true);

-- Wellness and Mood Tracking
CREATE TABLE health_fitness.wellness_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    overall_wellness INTEGER CHECK (overall_wellness >= 1 AND overall_wellness <= 10),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
    motivation_level INTEGER CHECK (motivation_level >= 1 AND motivation_level <= 10),
    social_connection INTEGER CHECK (social_connection >= 1 AND social_connection <= 10),
    work_life_balance INTEGER CHECK (work_life_balance >= 1 AND work_life_balance <= 10),
    symptoms TEXT[], -- headache, fatigue, muscle_soreness, etc.
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, log_date)
);

revoke all on table health_fitness.wellness_logs from anon, authenticated, service_role;
grant select on table health_fitness.wellness_logs to authenticated;

alter table health_fitness.wellness_logs enable row level security;

create policy "Allow authenticated read access" on health_fitness.wellness_logs
    for select
    to authenticated
    using (true);

-- Health and Fitness Statistics
CREATE TABLE health_fitness.daily_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    summary_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_calories_consumed INTEGER,
    total_calories_burned INTEGER,
    net_calories INTEGER,
    total_protein_g DECIMAL(8,3),
    total_carbs_g DECIMAL(8,3),
    total_fat_g DECIMAL(8,3),
    total_fiber_g DECIMAL(8,3),
    total_water_ml INTEGER,
    workout_duration_minutes INTEGER,
    steps_count INTEGER,
    active_minutes INTEGER,
    sleep_hours DECIMAL(4,2),
    sleep_quality INTEGER,
    weight_kg DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, summary_date)
);

revoke all on table health_fitness.daily_summaries from anon, authenticated, service_role;
grant select on table health_fitness.daily_summaries to authenticated;

alter table health_fitness.daily_summaries enable row level security;

create policy "Allow authenticated read access" on health_fitness.daily_summaries
    for select
    to authenticated
    using (true);

-- Indexes for better performance
CREATE INDEX idx_body_measurements_user_date ON health_fitness.body_measurements(account_id, measurement_date);
CREATE INDEX idx_health_metrics_user_date ON health_fitness.health_metrics(account_id, measurement_date);
CREATE INDEX idx_sleep_records_user_date ON health_fitness.sleep_records(account_id, sleep_date);
CREATE INDEX idx_workout_sessions_user_date ON health_fitness.workout_sessions(account_id, session_date);
CREATE INDEX idx_exercise_sets_workout ON health_fitness.exercise_sets(workout_session_id);
CREATE INDEX idx_cardio_activities_user_date ON health_fitness.cardio_activities(account_id, activity_date);
CREATE INDEX idx_meals_user_date_type ON health_fitness.meals(account_id, meal_date, meal_type);
CREATE INDEX idx_meal_foods_meal ON health_fitness.meal_foods(meal_id);
CREATE INDEX idx_water_intake_user_date ON health_fitness.water_intake(account_id, intake_date);
CREATE INDEX idx_supplement_intake_user_date ON health_fitness.supplement_intake(account_id, intake_date);
CREATE INDEX idx_wellness_logs_user_date ON health_fitness.wellness_logs(account_id, log_date);
CREATE INDEX idx_foods_name ON health_fitness.foods(name);
CREATE INDEX idx_exercises_category ON health_fitness.exercises(category_id);

-- Insert default exercise categories
INSERT INTO health_fitness.exercise_categories (name, description, muscle_groups) VALUES
('Chest', 'Exercises targeting chest muscles', ARRAY['pectorals', 'anterior_deltoids', 'triceps']),
('Back', 'Exercises targeting back muscles', ARRAY['latissimus_dorsi', 'rhomboids', 'middle_trapezius', 'biceps']),
('Shoulders', 'Exercises targeting shoulder muscles', ARRAY['deltoids', 'trapezius', 'rotator_cuff']),
('Arms', 'Exercises targeting arm muscles', ARRAY['biceps', 'triceps', 'forearms']),
('Legs', 'Exercises targeting leg muscles', ARRAY['quadriceps', 'hamstrings', 'glutes', 'calves']),
('Core', 'Exercises targeting core muscles', ARRAY['abs', 'obliques', 'lower_back']),
('Cardio', 'Cardiovascular exercises', ARRAY['heart', 'lungs', 'full_body']),
('Full Body', 'Compound exercises targeting multiple muscle groups', ARRAY['full_body']),
('Flexibility', 'Stretching and mobility exercises', ARRAY['full_body']),
('Functional', 'Functional movement exercises', ARRAY['full_body']);

-- Insert common exercises
-- INSERT INTO health_fitness.exercises (name, category_id, description, primary_muscles, secondary_muscles, equipment, difficulty_level, is_compound) VALUES
-- ('Push-ups', 1, 'Classic bodyweight chest exercise', ARRAY['pectorals'], ARRAY['triceps', 'anterior_deltoids'], ARRAY['bodyweight'], 'beginner', TRUE),
-- ('Bench Press', 1, 'Barbell chest press', ARRAY['pectorals'], ARRAY['triceps', 'anterior_deltoids'], ARRAY['barbell', 'bench'], 'intermediate', TRUE),
-- ('Pull-ups', 2, 'Bodyweight back exercise', ARRAY['latissimus_dorsi'], ARRAY['biceps', 'rear_deltoids'], ARRAY['pull_up_bar'], 'intermediate', TRUE),
-- ('Squats', 5, 'Fundamental leg exercise', ARRAY['quadriceps', 'glutes'], ARRAY['hamstrings', 'calves'], ARRAY['bodyweight'], 'beginner', TRUE),
-- ('Deadlifts', 5, 'Full body compound exercise', ARRAY['hamstrings', 'glutes'], ARRAY['lower_back', 'traps', 'forearms'], ARRAY['barbell'], 'advanced', TRUE),
-- ('Plank', 6, 'Core stability exercise', ARRAY['abs', 'core'], ARRAY['shoulders', 'glutes'], ARRAY['bodyweight'], 'beginner', FALSE),
-- ('Running', 7, 'Cardiovascular exercise', ARRAY['legs'], ARRAY['core', 'arms'], ARRAY['none'], 'beginner', TRUE),
-- ('Burpees', 8, 'Full body conditioning exercise', ARRAY['full_body'], ARRAY[], ARRAY['bodyweight'], 'intermediate', TRUE);

-- Note: Default user not needed as we're using supasheet.accounts

-- Insert common supplements
INSERT INTO health_fitness.supplements (name, supplement_type, serving_size, serving_unit) VALUES
('Whey Protein Powder', 'protein', '30', 'grams'),
('Creatine Monohydrate', 'performance', '5', 'grams'),
('Multivitamin', 'vitamin', '1', 'tablet'),
('Omega-3 Fish Oil', 'essential_fatty_acid', '1', 'capsule'),
('Vitamin D3', 'vitamin', '1000', 'IU'),
('Magnesium', 'mineral', '400', 'mg'),
('Probiotics', 'digestive_health', '1', 'capsule');

-- Insert common foods
INSERT INTO health_fitness.foods (name, serving_size_g, calories_per_100g, protein_g_per_100g, carbs_g_per_100g, fat_g_per_100g, fiber_g_per_100g, food_category) VALUES
('Chicken Breast (skinless)', 100, 165, 31.0, 0, 3.6, 0, 'meat'),
('Brown Rice (cooked)', 100, 111, 2.6, 23.0, 0.9, 1.8, 'grains'),
('Broccoli', 100, 34, 2.8, 7.0, 0.4, 2.6, 'vegetables'),
('Banana', 100, 89, 1.1, 23.0, 0.3, 2.6, 'fruits'),
('Almonds', 100, 579, 21.2, 21.6, 49.9, 12.5, 'nuts'),
('Greek Yogurt (plain)', 100, 59, 10.0, 3.6, 0.4, 0, 'dairy'),
('Oats', 100, 389, 16.9, 66.3, 6.9, 10.6, 'grains'),
('Salmon', 100, 208, 25.4, 0, 12.4, 0, 'fish'),
('Sweet Potato', 100, 86, 1.6, 20.1, 0.1, 3.0, 'vegetables'),
('Eggs', 100, 155, 13.0, 1.1, 11.0, 0, 'protein');

-- Views for common queries

-- Weekly workout summary
CREATE VIEW health_fitness.weekly_workout_summary AS
SELECT 
    account_id,
    DATE_TRUNC('week', session_date) as week_start,
    COUNT(*) as total_workouts,
    SUM(duration_minutes) as total_minutes,
    AVG(intensity_level) as avg_intensity,
    SUM(calories_burned) as total_calories_burned,
    string_agg(DISTINCT session_type, ', ') as workout_types
FROM health_fitness.workout_sessions
WHERE session_date >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY account_id, DATE_TRUNC('week', session_date)
ORDER BY week_start DESC;

-- Daily nutrition summary
CREATE VIEW health_fitness.daily_nutrition_summary AS
SELECT 
    m.account_id,
    m.meal_date,
    SUM(mf.calories) as total_calories,
    SUM(mf.protein_g) as total_protein,
    SUM(mf.carbs_g) as total_carbs,
    SUM(mf.fat_g) as total_fat,
    SUM(mf.fiber_g) as total_fiber,
    COUNT(DISTINCT m.id) as meals_logged
FROM health_fitness.meals m
JOIN health_fitness.meal_foods mf ON m.id = mf.meal_id
GROUP BY m.account_id, m.meal_date
ORDER BY m.meal_date DESC;

-- Progress tracking view
CREATE VIEW health_fitness.progress_tracking AS
SELECT 
    account_id,
    measurement_date,
    weight_kg,
    body_fat_percentage,
    muscle_mass_kg,
    LAG(weight_kg) OVER (PARTITION BY account_id ORDER BY measurement_date) as previous_weight,
    weight_kg - LAG(weight_kg) OVER (PARTITION BY account_id ORDER BY measurement_date) as weight_change,
    LAG(body_fat_percentage) OVER (PARTITION BY account_id ORDER BY measurement_date) as previous_body_fat,
    body_fat_percentage - LAG(body_fat_percentage) OVER (PARTITION BY account_id ORDER BY measurement_date) as body_fat_change
FROM health_fitness.body_measurements
ORDER BY account_id, measurement_date;

-- Exercise performance tracking
CREATE VIEW health_fitness.exercise_performance AS
SELECT 
    es.exercise_id,
    e.name as exercise_name,
    ws.account_id,
    ws.session_date,
    MAX(es.weight_kg) as max_weight,
    MAX(es.repetitions) as max_reps,
    SUM(es.repetitions * es.weight_kg) as total_volume,
    AVG(es.perceived_exertion) as avg_effort
FROM health_fitness.exercise_sets es
JOIN health_fitness.workout_sessions ws ON es.workout_session_id = ws.id
JOIN health_fitness.exercises e ON es.exercise_id = e.id
WHERE es.completed = TRUE
GROUP BY es.exercise_id, e.name, ws.account_id, ws.session_date
ORDER BY ws.account_id, es.exercise_id, ws.session_date;

-- Functions

-- Calculate BMI
CREATE OR REPLACE FUNCTION health_fitness.calculate_bmi(height_cm DECIMAL, weight_kg DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    IF height_cm IS NULL OR weight_kg IS NULL OR height_cm <= 0 OR weight_kg <= 0 THEN
        RETURN NULL;
    END IF;
    
    RETURN ROUND((weight_kg / POWER(height_cm / 100.0, 2))::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql;

-- Calculate BMR using Mifflin-St Jeor Equation
CREATE OR REPLACE FUNCTION health_fitness.calculate_bmr(
    weight_kg DECIMAL, 
    height_cm DECIMAL, 
    age_years INTEGER, 
    gender VARCHAR
)
RETURNS INTEGER AS $$
DECLARE
    bmr DECIMAL;
BEGIN
    IF weight_kg IS NULL OR height_cm IS NULL OR age_years IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Mifflin-St Jeor Equation
    bmr := (10 * weight_kg) + (6.25 * height_cm) - (5 * age_years);
    
    IF gender = 'male' THEN
        bmr := bmr + 5;
    ELSIF gender = 'female' THEN
        bmr := bmr - 161;
    ELSE
        bmr := bmr - 78; -- Average for other genders
    END IF;
    
    RETURN ROUND(bmr);
END;
$$ LANGUAGE plpgsql;

-- Calculate macronutrient values for meal foods
CREATE OR REPLACE FUNCTION health_fitness.calculate_meal_nutrition()
RETURNS TRIGGER AS $$
DECLARE
    food_record RECORD;
    quantity_ratio DECIMAL;
BEGIN
    -- Get food nutrition data
    SELECT * INTO food_record FROM health_fitness.foods WHERE id = NEW.food_id;
    
    IF NOT FOUND THEN
        RETURN NEW;
    END IF;
    
    -- Calculate ratio based on quantity
    quantity_ratio := NEW.quantity_g / 100.0;
    
    -- Calculate nutrition values
    NEW.calories := ROUND((food_record.calories_per_100g * quantity_ratio)::NUMERIC, 2);
    NEW.protein_g := ROUND((food_record.protein_g_per_100g * quantity_ratio)::NUMERIC, 3);
    NEW.carbs_g := ROUND((food_record.carbs_g_per_100g * quantity_ratio)::NUMERIC, 3);
    NEW.fat_g := ROUND((food_record.fat_g_per_100g * quantity_ratio)::NUMERIC, 3);
    NEW.fiber_g := ROUND((food_record.fiber_g_per_100g * quantity_ratio)::NUMERIC, 3);
    NEW.sugar_g := ROUND((food_record.sugar_g_per_100g * quantity_ratio)::NUMERIC, 3);
    NEW.sodium_mg := ROUND((food_record.sodium_mg_per_100g * quantity_ratio)::NUMERIC, 3);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get fitness summary for date range
CREATE OR REPLACE FUNCTION health_fitness.get_fitness_summary(
    user_uuid UUID,
    start_date DATE,
    end_date DATE
)
RETURNS TABLE(
    total_workouts INTEGER,
    total_workout_time INTEGER,
    avg_workout_intensity DECIMAL,
    total_calories_burned INTEGER,
    avg_sleep_hours DECIMAL,
    avg_sleep_quality DECIMAL,
    weight_change_kg DECIMAL,
    avg_wellness_score DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH workout_stats AS (
        SELECT 
            COUNT(*)::INTEGER as workouts,
            SUM(duration_minutes)::INTEGER as total_minutes,
            AVG(intensity_level) as avg_intensity,
            SUM(calories_burned)::INTEGER as total_calories
        FROM health_fitness.workout_sessions
        WHERE account_id = user_uuid 
          AND session_date BETWEEN start_date AND end_date
    ),
    sleep_stats AS (
        SELECT 
            AVG(total_sleep_hours) as avg_sleep,
            AVG(sleep_quality) as avg_quality
        FROM health_fitness.sleep_records
        WHERE account_id = user_uuid 
          AND sleep_date BETWEEN start_date AND end_date
    ),
    weight_stats AS (
        SELECT 
            (MAX(weight_kg) - MIN(weight_kg)) as weight_diff
        FROM health_fitness.body_measurements
        WHERE account_id = user_uuid 
          AND measurement_date BETWEEN start_date AND end_date
    ),
    wellness_stats AS (
        SELECT 
            AVG(overall_wellness) as avg_wellness
        FROM health_fitness.wellness_logs
        WHERE account_id = user_uuid 
          AND log_date BETWEEN start_date AND end_date
    )
    SELECT 
        COALESCE(ws.workouts, 0),
        COALESCE(ws.total_minutes, 0),
        ROUND(ws.avg_intensity, 2),
        COALESCE(ws.total_calories, 0),
        ROUND(ss.avg_sleep, 2),
        ROUND(ss.avg_quality, 2),
        ROUND(wts.weight_diff, 2),
        ROUND(wls.avg_wellness, 2)
    FROM workout_stats ws
    CROSS JOIN sleep_stats ss
    CROSS JOIN weight_stats wts
    CROSS JOIN wellness_stats wls;
END;
$$ LANGUAGE plpgsql;

-- Triggers

-- Auto-calculate nutrition for meal foods
CREATE TRIGGER trigger_calculate_meal_nutrition
    BEFORE INSERT OR UPDATE ON health_fitness.meal_foods
    FOR EACH ROW
    EXECUTE FUNCTION health_fitness.calculate_meal_nutrition();

-- Update timestamps
CREATE OR REPLACE FUNCTION health_fitness.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: Users timestamp trigger not needed as we're using supasheet.accounts

CREATE TRIGGER update_health_goals_timestamp BEFORE UPDATE ON health_fitness.health_goals
    FOR EACH ROW EXECUTE FUNCTION health_fitness.update_timestamp();

CREATE TRIGGER update_medical_conditions_timestamp BEFORE UPDATE ON health_fitness.medical_conditions
    FOR EACH ROW EXECUTE FUNCTION health_fitness.update_timestamp();

CREATE TRIGGER update_injuries_timestamp BEFORE UPDATE ON health_fitness.injuries
    FOR EACH ROW EXECUTE FUNCTION health_fitness.update_timestamp();

-- Sample data (uncomment to insert)
/*
-- Get default user ID
DO $$
DECLARE
    default_account_id UUID;
    chest_category_id INTEGER;
    back_category_id INTEGER;
BEGIN
    -- Use an existing account from supasheet.accounts
    SELECT id INTO default_account_id FROM supasheet.accounts LIMIT 1;
    SELECT id INTO chest_category_id FROM health_fitness.exercise_categories WHERE name = 'Chest';
    SELECT id INTO back_category_id FROM health_fitness.exercise_categories WHERE name = 'Back';
    
    -- Insert sample body measurements
    INSERT INTO health_fitness.body_measurements (account_id, weight_kg, body_fat_percentage, muscle_mass_kg) VALUES
    (default_account_id, 75.5, 15.2, 58.3),
    (default_account_id, 75.8, 15.0, 58.6);
    
    -- Insert sample workout session
    INSERT INTO health_fitness.workout_sessions (account_id, session_type, duration_minutes, intensity_level, calories_burned) VALUES
    (default_account_id, 'strength', 45, 8, 250);
    
    -- Insert sample health goal
    INSERT INTO health_fitness.health_goals (account_id, goal_type, title, target_value, unit, start_date, target_date) VALUES
    (default_account_id, 'weight_loss', 'Lose 5kg', 5, 'kg', CURRENT_DATE, CURRENT_DATE + INTERVAL '3 months');
    
    -- Insert sample sleep record
    INSERT INTO health_fitness.sleep_records (account_id, total_sleep_hours, sleep_quality) VALUES
    (default_account_id, 7.5, 8);
    
    -- Insert sample wellness log
    INSERT INTO health_fitness.wellness_logs (account_id, overall_wellness, stress_level, mood_rating, motivation_level) VALUES
    (default_account_id, 8, 4, 7, 8);
END $$;
*/