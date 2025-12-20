-- Personal Health and Fitness Database Schema
-- PostgreSQL implementation for comprehensive health and fitness tracking

-- Create database (uncomment if needed)
-- CREATE DATABASE personal_health_fitness;

-- Use the database
-- \c personal_health_fitness;
create schema if not exists health_fitness;

grant usage on schema health_fitness to authenticated;

begin;
-- Define enum types for health_fitness schema
create type health_fitness.difficulty_level as enum ('beginner', 'intermediate', 'advanced');
create type health_fitness.exercise_set_type as enum ('normal', 'warmup', 'drop', 'super', 'failure');
create type health_fitness.meal_type as enum ('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout');
create type health_fitness.health_goal_status as enum ('not_started', 'in_progress', 'completed', 'paused', 'cancelled');
create type health_fitness.health_goal_priority as enum ('low', 'medium', 'high');
create type health_fitness.medical_condition_severity as enum ('mild', 'moderate', 'severe');
create type health_fitness.medical_condition_status as enum ('active', 'resolved', 'managed');
create type health_fitness.injury_severity as enum ('minor', 'moderate', 'major');
create type health_fitness.injury_status as enum ('active', 'recovering', 'healed');

-- Add health_fitness permissions to app_permission enum
alter type supasheet.app_permission add value 'health_fitness.body_measurements:select';
alter type supasheet.app_permission add value 'health_fitness.body_measurements:insert';
alter type supasheet.app_permission add value 'health_fitness.body_measurements:update';
alter type supasheet.app_permission add value 'health_fitness.body_measurements:delete';

alter type supasheet.app_permission add value 'health_fitness.health_metrics:select';
alter type supasheet.app_permission add value 'health_fitness.health_metrics:insert';
alter type supasheet.app_permission add value 'health_fitness.health_metrics:update';
alter type supasheet.app_permission add value 'health_fitness.health_metrics:delete';

alter type supasheet.app_permission add value 'health_fitness.sleep_records:select';
alter type supasheet.app_permission add value 'health_fitness.sleep_records:insert';
alter type supasheet.app_permission add value 'health_fitness.sleep_records:update';
alter type supasheet.app_permission add value 'health_fitness.sleep_records:delete';

alter type supasheet.app_permission add value 'health_fitness.exercise_categories:select';
alter type supasheet.app_permission add value 'health_fitness.exercise_categories:insert';
alter type supasheet.app_permission add value 'health_fitness.exercise_categories:update';
alter type supasheet.app_permission add value 'health_fitness.exercise_categories:delete';

alter type supasheet.app_permission add value 'health_fitness.exercises:select';
alter type supasheet.app_permission add value 'health_fitness.exercises:insert';
alter type supasheet.app_permission add value 'health_fitness.exercises:update';
alter type supasheet.app_permission add value 'health_fitness.exercises:delete';

alter type supasheet.app_permission add value 'health_fitness.workout_plans:select';
alter type supasheet.app_permission add value 'health_fitness.workout_plans:insert';
alter type supasheet.app_permission add value 'health_fitness.workout_plans:update';
alter type supasheet.app_permission add value 'health_fitness.workout_plans:delete';

alter type supasheet.app_permission add value 'health_fitness.workout_sessions:select';
alter type supasheet.app_permission add value 'health_fitness.workout_sessions:insert';
alter type supasheet.app_permission add value 'health_fitness.workout_sessions:update';
alter type supasheet.app_permission add value 'health_fitness.workout_sessions:delete';

alter type supasheet.app_permission add value 'health_fitness.exercise_sets:select';
alter type supasheet.app_permission add value 'health_fitness.exercise_sets:insert';
alter type supasheet.app_permission add value 'health_fitness.exercise_sets:update';
alter type supasheet.app_permission add value 'health_fitness.exercise_sets:delete';

alter type supasheet.app_permission add value 'health_fitness.cardio_activities:select';
alter type supasheet.app_permission add value 'health_fitness.cardio_activities:insert';
alter type supasheet.app_permission add value 'health_fitness.cardio_activities:update';
alter type supasheet.app_permission add value 'health_fitness.cardio_activities:delete';

alter type supasheet.app_permission add value 'health_fitness.foods:select';
alter type supasheet.app_permission add value 'health_fitness.foods:insert';
alter type supasheet.app_permission add value 'health_fitness.foods:update';
alter type supasheet.app_permission add value 'health_fitness.foods:delete';

alter type supasheet.app_permission add value 'health_fitness.meals:select';
alter type supasheet.app_permission add value 'health_fitness.meals:insert';
alter type supasheet.app_permission add value 'health_fitness.meals:update';
alter type supasheet.app_permission add value 'health_fitness.meals:delete';

alter type supasheet.app_permission add value 'health_fitness.meal_foods:select';
alter type supasheet.app_permission add value 'health_fitness.meal_foods:insert';
alter type supasheet.app_permission add value 'health_fitness.meal_foods:update';
alter type supasheet.app_permission add value 'health_fitness.meal_foods:delete';

alter type supasheet.app_permission add value 'health_fitness.water_intake:select';
alter type supasheet.app_permission add value 'health_fitness.water_intake:insert';
alter type supasheet.app_permission add value 'health_fitness.water_intake:update';
alter type supasheet.app_permission add value 'health_fitness.water_intake:delete';

alter type supasheet.app_permission add value 'health_fitness.supplements:select';
alter type supasheet.app_permission add value 'health_fitness.supplements:insert';
alter type supasheet.app_permission add value 'health_fitness.supplements:update';
alter type supasheet.app_permission add value 'health_fitness.supplements:delete';

alter type supasheet.app_permission add value 'health_fitness.supplement_intake:select';
alter type supasheet.app_permission add value 'health_fitness.supplement_intake:insert';
alter type supasheet.app_permission add value 'health_fitness.supplement_intake:update';
alter type supasheet.app_permission add value 'health_fitness.supplement_intake:delete';

alter type supasheet.app_permission add value 'health_fitness.health_goals:select';
alter type supasheet.app_permission add value 'health_fitness.health_goals:insert';
alter type supasheet.app_permission add value 'health_fitness.health_goals:update';
alter type supasheet.app_permission add value 'health_fitness.health_goals:delete';

alter type supasheet.app_permission add value 'health_fitness.medical_conditions:select';
alter type supasheet.app_permission add value 'health_fitness.medical_conditions:insert';
alter type supasheet.app_permission add value 'health_fitness.medical_conditions:update';
alter type supasheet.app_permission add value 'health_fitness.medical_conditions:delete';

alter type supasheet.app_permission add value 'health_fitness.medications:select';
alter type supasheet.app_permission add value 'health_fitness.medications:insert';
alter type supasheet.app_permission add value 'health_fitness.medications:update';
alter type supasheet.app_permission add value 'health_fitness.medications:delete';

alter type supasheet.app_permission add value 'health_fitness.injuries:select';
alter type supasheet.app_permission add value 'health_fitness.injuries:insert';
alter type supasheet.app_permission add value 'health_fitness.injuries:update';
alter type supasheet.app_permission add value 'health_fitness.injuries:delete';

alter type supasheet.app_permission add value 'health_fitness.wellness_logs:select';
alter type supasheet.app_permission add value 'health_fitness.wellness_logs:insert';
alter type supasheet.app_permission add value 'health_fitness.wellness_logs:update';
alter type supasheet.app_permission add value 'health_fitness.wellness_logs:delete';

alter type supasheet.app_permission add value 'health_fitness.daily_summaries:select';
alter type supasheet.app_permission add value 'health_fitness.daily_summaries:insert';
alter type supasheet.app_permission add value 'health_fitness.daily_summaries:update';
alter type supasheet.app_permission add value 'health_fitness.daily_summaries:delete';

alter type supasheet.app_permission add value 'health_fitness.weekly_workout_summary:select';
alter type supasheet.app_permission add value 'health_fitness.daily_nutrition_summary:select';
alter type supasheet.app_permission add value 'health_fitness.progress_tracking:select';
alter type supasheet.app_permission add value 'health_fitness.exercise_performance:select';

-- Report views
alter type supasheet.app_permission add value 'health_fitness.health_report:select';
alter type supasheet.app_permission add value 'health_fitness.workout_report:select';

-- Dashboard widget views (Card types)
alter type supasheet.app_permission add value 'health_fitness.total_workouts_count:select';
alter type supasheet.app_permission add value 'health_fitness.weight_progress_comparison:select';
alter type supasheet.app_permission add value 'health_fitness.workout_streak:select';
alter type supasheet.app_permission add value 'health_fitness.calorie_balance:select';

-- Dashboard widget views (Table types)
alter type supasheet.app_permission add value 'health_fitness.recent_workouts_simple:select';
alter type supasheet.app_permission add value 'health_fitness.active_goals_simple:select';
alter type supasheet.app_permission add value 'health_fitness.workout_overview_detailed:select';
alter type supasheet.app_permission add value 'health_fitness.nutrition_log_detailed:select';

-- Chart views
alter type supasheet.app_permission add value 'health_fitness.weight_trend_area:select';
alter type supasheet.app_permission add value 'health_fitness.workout_type_distribution_bar:select';
alter type supasheet.app_permission add value 'health_fitness.workout_frequency_line:select';
alter type supasheet.app_permission add value 'health_fitness.muscle_group_distribution_pie:select';
alter type supasheet.app_permission add value 'health_fitness.wellness_metrics_radar:select';


commit;

-- Body Measurements & Weight Tracking
CREATE TABLE health_fitness.body_measurements (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table health_fitness.body_measurements to authenticated;

alter table health_fitness.body_measurements enable row level security;

create policy "Allow user select" on health_fitness.body_measurements
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.body_measurements:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.body_measurements
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.body_measurements:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.body_measurements
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.body_measurements:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.body_measurements
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.body_measurements:delete') and account_id = auth.uid());

-- Health Metrics (Blood Pressure, Heart Rate, etc.)
CREATE TABLE health_fitness.health_metrics (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table health_fitness.health_metrics to authenticated;

alter table health_fitness.health_metrics enable row level security;

create policy "Allow user select" on health_fitness.health_metrics
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.health_metrics:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.health_metrics
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.health_metrics:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.health_metrics
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.health_metrics:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.health_metrics
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.health_metrics:delete') and account_id = auth.uid());

-- Sleep Tracking
CREATE TABLE health_fitness.sleep_records (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table health_fitness.sleep_records to authenticated;

alter table health_fitness.sleep_records enable row level security;

create policy "Allow user select" on health_fitness.sleep_records
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.sleep_records:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.sleep_records
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.sleep_records:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.sleep_records
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.sleep_records:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.sleep_records
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.sleep_records:delete') and account_id = auth.uid());

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
grant select, insert, update, delete on table health_fitness.exercise_categories to authenticated;

alter table health_fitness.exercise_categories enable row level security;

create policy "Allow user select" on health_fitness.exercise_categories
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.exercise_categories:select'));

create policy "Allow user insert" on health_fitness.exercise_categories
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.exercise_categories:insert'));

create policy "Allow user update" on health_fitness.exercise_categories
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.exercise_categories:update'));

create policy "Allow user delete" on health_fitness.exercise_categories
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.exercise_categories:delete'));

CREATE TABLE health_fitness.exercises (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    category_id INTEGER REFERENCES health_fitness.exercise_categories(id),
    description TEXT,
    instructions TEXT,
    primary_muscles TEXT[],
    secondary_muscles TEXT[],
    equipment TEXT[],
    difficulty_level health_fitness.difficulty_level DEFAULT 'beginner',
    is_compound BOOLEAN DEFAULT FALSE, -- Compound vs isolation exercise
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.exercises from anon, authenticated, service_role;
grant select, insert, update, delete on table health_fitness.exercises to authenticated;

alter table health_fitness.exercises enable row level security;

create policy "Allow user select" on health_fitness.exercises
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.exercises:select'));

create policy "Allow user insert" on health_fitness.exercises
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.exercises:insert'));

create policy "Allow user update" on health_fitness.exercises
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.exercises:update'));

create policy "Allow user delete" on health_fitness.exercises
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.exercises:delete'));

-- Workout Plans/Templates
CREATE TABLE health_fitness.workout_plans (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    plan_type VARCHAR(50), -- strength, cardio, hiit, yoga, etc.
    difficulty_level health_fitness.difficulty_level,
    duration_weeks INTEGER,
    days_per_week INTEGER,
    estimated_duration_minutes INTEGER,
    goal VARCHAR(100), -- weight_loss, muscle_gain, endurance, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100), -- trainer, app, user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.workout_plans from anon, authenticated, service_role;
grant select, insert, update, delete on table health_fitness.workout_plans to authenticated;

alter table health_fitness.workout_plans enable row level security;

create policy "Allow user select" on health_fitness.workout_plans
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.workout_plans:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.workout_plans
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.workout_plans:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.workout_plans
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.workout_plans:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.workout_plans
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.workout_plans:delete') and account_id = auth.uid());

-- Workout Sessions
CREATE TABLE health_fitness.workout_sessions (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table health_fitness.workout_sessions to authenticated;

alter table health_fitness.workout_sessions enable row level security;

create policy "Allow user select" on health_fitness.workout_sessions
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.workout_sessions:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.workout_sessions
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.workout_sessions:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.workout_sessions
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.workout_sessions:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.workout_sessions
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.workout_sessions:delete') and account_id = auth.uid());

-- Exercise Sets within Workouts
CREATE TABLE health_fitness.exercise_sets (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    workout_session_id UUID REFERENCES health_fitness.workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES health_fitness.exercises(id),
    set_order INTEGER NOT NULL,
    set_type health_fitness.exercise_set_type DEFAULT 'normal',
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
grant select, insert, update, delete on table health_fitness.exercise_sets to authenticated;

alter table health_fitness.exercise_sets enable row level security;

create policy "Allow user select" on health_fitness.exercise_sets
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.exercise_sets:select') and exists (select 1 from health_fitness.workout_sessions where id = exercise_sets.workout_session_id and account_id = auth.uid()));

create policy "Allow user insert" on health_fitness.exercise_sets
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.exercise_sets:insert') and exists (select 1 from health_fitness.workout_sessions where id = exercise_sets.workout_session_id and account_id = auth.uid()));

create policy "Allow user update" on health_fitness.exercise_sets
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.exercise_sets:update') and exists (select 1 from health_fitness.workout_sessions where id = exercise_sets.workout_session_id and account_id = auth.uid()));

create policy "Allow user delete" on health_fitness.exercise_sets
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.exercise_sets:delete') and exists (select 1 from health_fitness.workout_sessions where id = exercise_sets.workout_session_id and account_id = auth.uid()));

-- Cardio Activities
CREATE TABLE health_fitness.cardio_activities (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table health_fitness.cardio_activities to authenticated;

alter table health_fitness.cardio_activities enable row level security;

create policy "Allow user select" on health_fitness.cardio_activities
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.cardio_activities:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.cardio_activities
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.cardio_activities:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.cardio_activities
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.cardio_activities:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.cardio_activities
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.cardio_activities:delete') and account_id = auth.uid());

-- Nutrition - Food Database
CREATE TABLE health_fitness.foods (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table health_fitness.foods to authenticated;

alter table health_fitness.foods enable row level security;

create policy "Allow user select" on health_fitness.foods
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.foods:select'));

create policy "Allow user insert" on health_fitness.foods
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.foods:insert'));

create policy "Allow user update" on health_fitness.foods
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.foods:update'));

create policy "Allow user delete" on health_fitness.foods
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.foods:delete'));

-- Meals and Food Intake
CREATE TABLE health_fitness.meals (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type health_fitness.meal_type NOT NULL,
    meal_time TIME,
    location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.meals from anon, authenticated, service_role;
grant select, insert, update, delete on table health_fitness.meals to authenticated;

alter table health_fitness.meals enable row level security;

create policy "Allow user select" on health_fitness.meals
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.meals:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.meals
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.meals:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.meals
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.meals:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.meals
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.meals:delete') and account_id = auth.uid());

CREATE TABLE health_fitness.meal_foods (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table health_fitness.meal_foods to authenticated;

alter table health_fitness.meal_foods enable row level security;

create policy "Allow user select" on health_fitness.meal_foods
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.meal_foods:select') and exists (select 1 from health_fitness.meals where id = meal_foods.meal_id and account_id = auth.uid()));

create policy "Allow user insert" on health_fitness.meal_foods
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.meal_foods:insert') and exists (select 1 from health_fitness.meals where id = meal_foods.meal_id and account_id = auth.uid()));

create policy "Allow user update" on health_fitness.meal_foods
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.meal_foods:update') and exists (select 1 from health_fitness.meals where id = meal_foods.meal_id and account_id = auth.uid()));

create policy "Allow user delete" on health_fitness.meal_foods
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.meal_foods:delete') and exists (select 1 from health_fitness.meals where id = meal_foods.meal_id and account_id = auth.uid()));

-- Water Intake Tracking
CREATE TABLE health_fitness.water_intake (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    intake_date DATE NOT NULL DEFAULT CURRENT_DATE,
    intake_time TIME DEFAULT CURRENT_TIME,
    amount_ml INTEGER NOT NULL,
    source_type VARCHAR(50) DEFAULT 'water', -- water, tea, coffee, juice, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.water_intake from anon, authenticated, service_role;
grant select, insert, update, delete on table health_fitness.water_intake to authenticated;

alter table health_fitness.water_intake enable row level security;

create policy "Allow user select" on health_fitness.water_intake
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.water_intake:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.water_intake
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.water_intake:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.water_intake
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.water_intake:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.water_intake
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.water_intake:delete') and account_id = auth.uid());

-- Supplements
CREATE TABLE health_fitness.supplements (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    supplement_type VARCHAR(100), -- vitamin, mineral, protein, etc.
    serving_size VARCHAR(100),
    serving_unit VARCHAR(50),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.supplements from anon, authenticated, service_role;
grant select, insert, update, delete on table health_fitness.supplements to authenticated;

alter table health_fitness.supplements enable row level security;

create policy "Allow user select" on health_fitness.supplements
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.supplements:select'));

create policy "Allow user insert" on health_fitness.supplements
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.supplements:insert'));

create policy "Allow user update" on health_fitness.supplements
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.supplements:update'));

create policy "Allow user delete" on health_fitness.supplements
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.supplements:delete'));

CREATE TABLE health_fitness.supplement_intake (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table health_fitness.supplement_intake to authenticated;

alter table health_fitness.supplement_intake enable row level security;

create policy "Allow user select" on health_fitness.supplement_intake
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.supplement_intake:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.supplement_intake
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.supplement_intake:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.supplement_intake
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.supplement_intake:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.supplement_intake
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.supplement_intake:delete') and account_id = auth.uid());

-- Health Goals
CREATE TABLE health_fitness.health_goals (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    goal_type VARCHAR(50), -- weight_loss, muscle_gain, strength, endurance, etc.
    title VARCHAR(300) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,3),
    current_value DECIMAL(10,3) DEFAULT 0,
    unit VARCHAR(50),
    start_date DATE NOT NULL,
    target_date DATE,
    status health_fitness.health_goal_status DEFAULT 'not_started',
    priority health_fitness.health_goal_priority DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.health_goals from anon, authenticated, service_role;
grant select, insert, update, delete on table health_fitness.health_goals to authenticated;

alter table health_fitness.health_goals enable row level security;

create policy "Allow user select" on health_fitness.health_goals
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.health_goals:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.health_goals
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.health_goals:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.health_goals
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.health_goals:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.health_goals
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.health_goals:delete') and account_id = auth.uid());

-- Medical Information
CREATE TABLE health_fitness.medical_conditions (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    condition_name VARCHAR(200) NOT NULL,
    diagnosis_date DATE,
    severity health_fitness.medical_condition_severity,
    status health_fitness.medical_condition_status DEFAULT 'active',
    medication TEXT[],
    notes TEXT,
    doctor_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.medical_conditions from anon, authenticated, service_role;
grant select, insert, update, delete on table health_fitness.medical_conditions to authenticated;

alter table health_fitness.medical_conditions enable row level security;

create policy "Allow user select" on health_fitness.medical_conditions
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.medical_conditions:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.medical_conditions
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.medical_conditions:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.medical_conditions
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.medical_conditions:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.medical_conditions
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.medical_conditions:delete') and account_id = auth.uid());

CREATE TABLE health_fitness.medications (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table health_fitness.medications to authenticated;

alter table health_fitness.medications enable row level security;

create policy "Allow user select" on health_fitness.medications
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.medications:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.medications
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.medications:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.medications
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.medications:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.medications
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.medications:delete') and account_id = auth.uid());

-- Injury and Recovery Tracking
CREATE TABLE health_fitness.injuries (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    injury_name VARCHAR(200) NOT NULL,
    body_part VARCHAR(100),
    injury_date DATE NOT NULL,
    injury_type VARCHAR(100), -- strain, sprain, fracture, etc.
    severity health_fitness.injury_severity,
    cause TEXT,
    treatment TEXT,
    recovery_time_days INTEGER,
    status health_fitness.injury_status DEFAULT 'active',
    affects_exercise BOOLEAN DEFAULT TRUE,
    restricted_activities TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table health_fitness.injuries from anon, authenticated, service_role;
grant select, insert, update, delete on table health_fitness.injuries to authenticated;

alter table health_fitness.injuries enable row level security;

create policy "Allow user select" on health_fitness.injuries
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.injuries:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.injuries
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.injuries:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.injuries
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.injuries:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.injuries
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.injuries:delete') and account_id = auth.uid());

-- Wellness and Mood Tracking
CREATE TABLE health_fitness.wellness_logs (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table health_fitness.wellness_logs to authenticated;

alter table health_fitness.wellness_logs enable row level security;

create policy "Allow user select" on health_fitness.wellness_logs
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.wellness_logs:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.wellness_logs
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.wellness_logs:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.wellness_logs
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.wellness_logs:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.wellness_logs
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.wellness_logs:delete') and account_id = auth.uid());

-- Health and Fitness Statistics
CREATE TABLE health_fitness.daily_summaries (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table health_fitness.daily_summaries to authenticated;

alter table health_fitness.daily_summaries enable row level security;

create policy "Allow user select" on health_fitness.daily_summaries
    for select
    to authenticated
    using (supasheet.has_permission('health_fitness.daily_summaries:select') and account_id = auth.uid());

create policy "Allow user insert" on health_fitness.daily_summaries
    for insert
    to authenticated
    with check (supasheet.has_permission('health_fitness.daily_summaries:insert') and account_id = auth.uid());

create policy "Allow user update" on health_fitness.daily_summaries
    for update
    to authenticated
    using (supasheet.has_permission('health_fitness.daily_summaries:update') and account_id = auth.uid());

create policy "Allow user delete" on health_fitness.daily_summaries
    for delete
    to authenticated
    using (supasheet.has_permission('health_fitness.daily_summaries:delete') and account_id = auth.uid());

-- Table Metadata Comments

comment on table health_fitness.body_measurements is
'{
    "icon": "Scale",
    "display": "block",
    "query": {
        "sort": [{"id":"measurement_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"measurement_date","startDate":"measurement_date","endDate":"measurement_date","badge":"weight_kg"}
    ]
}';

comment on table health_fitness.health_metrics is
'{
    "icon": "Activity",
    "display": "block",
    "query": {
        "sort": [{"id":"measurement_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"measurement_date","startDate":"measurement_date","endDate":"measurement_date","badge":"resting_heart_rate"}
    ]
}';

comment on table health_fitness.sleep_records is
'{
    "icon": "Moon",
    "display": "block",
    "query": {
        "sort": [{"id":"sleep_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"sleep_date","startDate":"sleep_date","endDate":"sleep_date","badge":"sleep_quality"}
    ]
}';

comment on table health_fitness.exercise_categories is
'{
    "icon": "Grid2x2",
    "display": "block",
    "query": {
        "sort": [{"id":"name","desc":false}],
        "filter": [],
        "join": []
    }
}';

comment on table health_fitness.exercises is
'{
    "icon": "Dumbbell",
    "display": "block",
    "query": {
        "sort": [{"id":"name","desc":false}],
        "filter": [],
        "join": [
            {"table":"exercise_categories","on":"category_id","columns":["name"]}
        ]
    },
    "items": [
        {"id":"category","name":"Exercises By Category","type":"kanban","group":"category_id","title":"name","description":"description","badge":"difficulty_level"}
    ]
}';

comment on table health_fitness.workout_plans is
'{
    "icon": "Calendar",
    "display": "block",
    "query": {
        "sort": [{"id":"created_at","desc":true}],
        "filter": [],
        "join": []
    }
}';

comment on table health_fitness.workout_sessions is
'{
    "icon": "Flame",
    "display": "block",
    "query": {
        "sort": [{"id":"session_date","desc":true}],
        "filter": [],
        "join": [
            {"table":"workout_plans","on":"workout_plan_id","columns":["name"]}
        ]
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"session_type","startDate":"session_date","endDate":"session_date","badge":"intensity_level"},
        {"id":"type","name":"Workouts By Type","type":"kanban","group":"session_type","title":"session_date","description":"notes","date":"session_date","badge":"intensity_level"}
    ]
}';

comment on table health_fitness.exercise_sets is
'{
    "icon": "ChartBar",
    "display": "block",
    "query": {
        "sort": [{"id":"set_number","desc":false}],
        "filter": [],
        "join": [
            {"table":"exercises","on":"exercise_id","columns":["name"]},
            {"table":"workout_sessions","on":"workout_session_id","columns":["session_date","session_type"]}
        ]
    },
    "items": [
        {"id":"type","name":"Sets By Type","type":"kanban","group":"set_type","title":"exercise_id","description":"notes","badge":"completed"}
    ]
}';

comment on table health_fitness.cardio_activities is
'{
    "icon": "Heart",
    "display": "block",
    "query": {
        "sort": [{"id":"activity_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"activity_type","startDate":"activity_date","endDate":"activity_date","badge":"avg_heart_rate"},
        {"id":"type","name":"Activities By Type","type":"kanban","group":"activity_type","title":"activity_date","date":"activity_date","badge":"distance_km"}
    ]
}';

comment on table health_fitness.foods is
'{
    "icon": "Apple",
    "display": "block",
    "query": {
        "sort": [{"id":"name","desc":false}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"category","name":"Foods By Category","type":"kanban","group":"food_category","title":"name","description":"serving_size_g","badge":"calories_per_100g"}
    ]
}';

comment on table health_fitness.meals is
'{
    "icon": "Utensils",
    "display": "block",
    "query": {
        "sort": [{"id":"meal_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"meal_type","startDate":"meal_date","endDate":"meal_date","badge":"meal_type"},
        {"id":"type","name":"Meals By Type","type":"kanban","group":"meal_type","title":"meal_date","date":"meal_date","badge":"meal_time"}
    ]
}';

comment on table health_fitness.meal_foods is
'{
    "icon": "List",
    "display": "block",
    "query": {
        "sort": [{"id":"created_at","desc":true}],
        "filter": [],
        "join": [
            {"table":"meals","on":"meal_id","columns":["meal_date","meal_type"]},
            {"table":"foods","on":"food_id","columns":["name","food_category"]}
        ]
    }
}';

comment on table health_fitness.water_intake is
'{
    "icon": "Droplet",
    "display": "block",
    "query": {
        "sort": [{"id":"intake_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"amount_ml","startDate":"intake_date","endDate":"intake_date","badge":"amount_ml"}
    ]
}';

comment on table health_fitness.supplements is
'{
    "icon": "Pill",
    "display": "block",
    "query": {
        "sort": [{"id":"name","desc":false}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"type","name":"Supplements By Type","type":"kanban","group":"supplement_type","title":"name","description":"serving_size","badge":"serving_unit"}
    ]
}';

comment on table health_fitness.supplement_intake is
'{
    "icon": "Tablets",
    "display": "block",
    "query": {
        "sort": [{"id":"intake_date","desc":true}],
        "filter": [],
        "join": [
            {"table":"supplements","on":"supplement_id","columns":["name","supplement_type"]}
        ]
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"supplement_id","startDate":"intake_date","endDate":"intake_date","badge":"amount"}
    ]
}';

comment on table health_fitness.health_goals is
'{
    "icon": "Target",
    "display": "block",
    "query": {
        "sort": [{"id":"target_date","desc":false}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"status","name":"Goals By Status","type":"kanban","group":"status","title":"title","description":"description","date":"target_date","badge":"priority"},
        {"id":"priority","name":"Goals By Priority","type":"kanban","group":"priority","title":"title","description":"description","date":"target_date","badge":"status"}
    ]
}';

comment on table health_fitness.medical_conditions is
'{
    "icon": "CircleAlert",
    "display": "block",
    "query": {
        "sort": [{"id":"diagnosis_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"status","name":"Conditions By Status","type":"kanban","group":"status","title":"condition_name","description":"description","date":"diagnosis_date","badge":"severity"},
        {"id":"severity","name":"Conditions By Severity","type":"kanban","group":"severity","title":"condition_name","description":"description","date":"diagnosis_date","badge":"status"}
    ]
}';

comment on table health_fitness.medications is
'{
    "icon": "Cross",
    "display": "block",
    "query": {
        "sort": [{"id":"start_date","desc":true}],
        "filter": [],
        "join": []
    }
}';

comment on table health_fitness.injuries is
'{
    "icon": "Bandage",
    "display": "block",
    "query": {
        "sort": [{"id":"injury_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"status","name":"Injuries By Status","type":"kanban","group":"status","title":"injury_type","description":"description","date":"injury_date","badge":"severity"},
        {"id":"severity","name":"Injuries By Severity","type":"kanban","group":"severity","title":"injury_type","description":"description","date":"injury_date","badge":"status"}
    ]
}';

comment on table health_fitness.wellness_logs is
'{
    "icon": "Smile",
    "display": "block",
    "query": {
        "sort": [{"id":"log_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"log_date","startDate":"log_date","endDate":"log_date","badge":"overall_wellness"}
    ]
}';

comment on table health_fitness.daily_summaries is
'{
    "icon": "TrendingUp",
    "display": "block",
    "query": {
        "sort": [{"id":"summary_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"summary_date","startDate":"summary_date","endDate":"summary_date","badge":"steps_count"}
    ]
}';

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
CREATE VIEW health_fitness.weekly_workout_summary
with (security_invoker = true)
AS
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

revoke all on health_fitness.weekly_workout_summary from anon, authenticated, service_role;
grant select on health_fitness.weekly_workout_summary to authenticated;

-- Daily nutrition summary
CREATE VIEW health_fitness.daily_nutrition_summary
with (security_invoker = true)
AS
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

revoke all on health_fitness.daily_nutrition_summary from anon, authenticated, service_role;
grant select on health_fitness.daily_nutrition_summary to authenticated;

-- Progress tracking view
CREATE VIEW health_fitness.progress_tracking
with (security_invoker = true)
AS
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

revoke all on health_fitness.progress_tracking from anon, authenticated, service_role;
grant select on health_fitness.progress_tracking to authenticated;

-- Exercise performance tracking
CREATE VIEW health_fitness.exercise_performance
with (security_invoker = true)
AS
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

revoke all on health_fitness.exercise_performance from anon, authenticated, service_role;
grant select on health_fitness.exercise_performance to authenticated;

-- Report views
CREATE VIEW health_fitness.health_report
with (security_invoker = true)
AS
SELECT
    bm.account_id,
    bm.measurement_date,
    bm.weight_kg,
    bm.body_fat_percentage,
    bm.muscle_mass_kg,
    hm.resting_heart_rate,
    hm.blood_sugar_mg_dl,
    sr.total_sleep_hours,
    sr.sleep_quality,
    ds.total_calories_consumed,
    ds.total_calories_burned,
    ds.steps_count
FROM health_fitness.body_measurements bm
LEFT JOIN health_fitness.health_metrics hm ON bm.account_id = hm.account_id AND bm.measurement_date = hm.measurement_date
LEFT JOIN health_fitness.sleep_records sr ON bm.account_id = sr.account_id AND bm.measurement_date = sr.sleep_date
LEFT JOIN health_fitness.daily_summaries ds ON bm.account_id = ds.account_id AND bm.measurement_date = ds.summary_date
ORDER BY bm.account_id, bm.measurement_date DESC;

revoke all on health_fitness.health_report from anon, authenticated, service_role;
grant select on health_fitness.health_report to authenticated;

comment on view health_fitness.health_report is '{"type": "report", "name": "Health Report", "description": "Comprehensive health report with body measurements, metrics, sleep, and daily activity data"}';

CREATE VIEW health_fitness.workout_report
with (security_invoker = true)
AS
SELECT
    ws.account_id,
    ws.session_date,
    ws.session_type,
    ws.duration_minutes,
    ws.intensity_level,
    ws.calories_burned,
    COUNT(DISTINCT es.exercise_id) as exercises_performed,
    SUM(es.repetitions * es.weight_kg) as total_volume,
    AVG(es.perceived_exertion) as avg_effort,
    ws.notes
FROM health_fitness.workout_sessions ws
LEFT JOIN health_fitness.exercise_sets es ON ws.id = es.workout_session_id
GROUP BY ws.account_id, ws.id, ws.session_date, ws.session_type, ws.duration_minutes, ws.intensity_level, ws.calories_burned, ws.notes
ORDER BY ws.account_id, ws.session_date DESC;

revoke all on health_fitness.workout_report from anon, authenticated, service_role;
grant select on health_fitness.workout_report to authenticated;

comment on view health_fitness.workout_report is '{"type": "report", "name": "Workout Report", "description": "Detailed workout report with exercises performed, volume, and effort metrics"}';

-- Dashboard widget views (Card types)
CREATE VIEW health_fitness.total_workouts_count
with (security_invoker = true)
AS
SELECT
    COUNT(*) as value,
    'list-ordered' as icon,
    'Workout count' as label
FROM health_fitness.workout_sessions
WHERE session_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY account_id;

revoke all on health_fitness.total_workouts_count from anon, authenticated, service_role;
grant select on health_fitness.total_workouts_count to authenticated;

comment on view health_fitness.total_workouts_count is '{"type": "dashboard_widget", "name": "Total Workouts", "description": "Total workout count and metrics for last 30 days", "widget_type": "card_1"}';

CREATE VIEW health_fitness.weight_progress_comparison
with (security_invoker = true)
AS
SELECT
    (SELECT weight_kg FROM health_fitness.body_measurements WHERE measurement_date >= CURRENT_DATE - INTERVAL '90 days' ORDER BY measurement_date DESC LIMIT 1) as primary,
    (SELECT weight_kg FROM health_fitness.body_measurements WHERE measurement_date >= CURRENT_DATE - INTERVAL '90 days' ORDER BY measurement_date DESC LIMIT 1 OFFSET 1) as secondary,
    'Current Weight' as primary_label,
    'Previous Weight' as secondary_label;

revoke all on health_fitness.weight_progress_comparison from anon, authenticated, service_role;
grant select on health_fitness.weight_progress_comparison to authenticated;

comment on view health_fitness.weight_progress_comparison is '{"type": "dashboard_widget", "name": "Weight Progress", "description": "Weight change comparison over time", "widget_type": "card_2"}';

CREATE VIEW health_fitness.workout_streak
with (security_invoker = true)
AS
SELECT
    COUNT(DISTINCT session_date)::integer as value,
    round((COUNT(DISTINCT session_date)::numeric / 30) * 100, 1) as percent
FROM health_fitness.workout_sessions
WHERE session_date >= CURRENT_DATE - INTERVAL '30 days';

revoke all on health_fitness.workout_streak from anon, authenticated, service_role;
grant select on health_fitness.workout_streak to authenticated;

comment on view health_fitness.workout_streak is '{"type": "dashboard_widget", "name": "Workout Streak", "description": "Active workout days in the last 30 days", "widget_type": "card_3"}';

CREATE VIEW health_fitness.calorie_balance
with (security_invoker = true)
AS
SELECT
    SUM(total_calories_consumed)::integer as current,
    SUM(total_calories_burned)::integer as total,
    json_build_array(
        json_build_object('label', 'Consumed', 'value', SUM(total_calories_consumed)::integer),
        json_build_object('label', 'Burned', 'value', SUM(total_calories_burned)::integer),
        json_build_object('label', 'Net', 'value', SUM(net_calories)::integer)
    ) as segments
FROM health_fitness.daily_summaries
WHERE summary_date >= CURRENT_DATE - INTERVAL '7 days';

revoke all on health_fitness.calorie_balance from anon, authenticated, service_role;
grant select on health_fitness.calorie_balance to authenticated;

comment on view health_fitness.calorie_balance is '{"type": "dashboard_widget", "name": "Calorie Balance", "description": "Weekly calorie intake vs expenditure summary", "widget_type": "card_4"}';

-- Dashboard widget views (Table types)
CREATE VIEW health_fitness.recent_workouts_simple
with (security_invoker = true)
AS
SELECT
    account_id,
    session_date,
    session_type,
    duration_minutes
FROM health_fitness.workout_sessions
WHERE session_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY account_id, session_date DESC
LIMIT 10;

revoke all on health_fitness.recent_workouts_simple from anon, authenticated, service_role;
grant select on health_fitness.recent_workouts_simple to authenticated;

comment on view health_fitness.recent_workouts_simple is '{"type": "dashboard_widget", "name": "Recent Workouts", "description": "Last 10 workout sessions in past week", "widget_type": "table_1"}';

CREATE VIEW health_fitness.active_goals_simple
with (security_invoker = true)
AS
SELECT
    account_id,
    title,
    target_date,
    status
FROM health_fitness.health_goals
WHERE status IN ('in_progress', 'not_started')
ORDER BY account_id, target_date
LIMIT 10;

revoke all on health_fitness.active_goals_simple from anon, authenticated, service_role;
grant select on health_fitness.active_goals_simple to authenticated;

comment on view health_fitness.active_goals_simple is '{"type": "dashboard_widget", "name": "Active Goals", "description": "Current active health and fitness goals", "widget_type": "table_1"}';

CREATE VIEW health_fitness.workout_overview_detailed
with (security_invoker = true)
AS
SELECT
    ws.account_id,
    ws.session_date,
    ws.session_type,
    ws.duration_minutes,
    ws.calories_burned,
    ws.intensity_level,
    COUNT(es.id) as total_sets
FROM health_fitness.workout_sessions ws
LEFT JOIN health_fitness.exercise_sets es ON ws.id = es.workout_session_id
WHERE ws.session_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ws.account_id, ws.id, ws.session_date, ws.session_type, ws.duration_minutes, ws.calories_burned, ws.intensity_level
ORDER BY ws.account_id, ws.session_date DESC
LIMIT 20;

revoke all on health_fitness.workout_overview_detailed from anon, authenticated, service_role;
grant select on health_fitness.workout_overview_detailed to authenticated;

comment on view health_fitness.workout_overview_detailed is '{"type": "dashboard_widget", "name": "Workout Overview", "description": "Detailed workout overview for last 30 days", "widget_type": "table_2"}';

CREATE VIEW health_fitness.nutrition_log_detailed
with (security_invoker = true)
AS
SELECT
    m.account_id,
    m.meal_date,
    m.meal_type,
    SUM(mf.calories) as total_calories,
    SUM(mf.protein_g) as total_protein,
    SUM(mf.carbs_g) as total_carbs,
    SUM(mf.fat_g) as total_fat
FROM health_fitness.meals m
JOIN health_fitness.meal_foods mf ON m.id = mf.meal_id
WHERE m.meal_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY m.account_id, m.id, m.meal_date, m.meal_type
ORDER BY m.account_id, m.meal_date DESC, m.meal_type
LIMIT 20;

revoke all on health_fitness.nutrition_log_detailed from anon, authenticated, service_role;
grant select on health_fitness.nutrition_log_detailed to authenticated;

comment on view health_fitness.nutrition_log_detailed is '{"type": "dashboard_widget", "name": "Nutrition Log", "description": "Detailed nutrition log for last 7 days", "widget_type": "table_2"}';

-- Chart views
CREATE VIEW health_fitness.weight_trend_area
with (security_invoker = true)
AS
SELECT
    account_id,
    measurement_date as date,
    weight_kg as value,
    'Weight (kg)' as metric
FROM health_fitness.body_measurements
WHERE measurement_date >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY account_id, measurement_date;

revoke all on health_fitness.weight_trend_area from anon, authenticated, service_role;
grant select on health_fitness.weight_trend_area to authenticated;

comment on view health_fitness.weight_trend_area is '{"type": "chart", "name": "Weight Trend", "description": "Weight progression over last 90 days", "chart_type": "area"}';

CREATE VIEW health_fitness.workout_type_distribution_bar
with (security_invoker = true)
AS
SELECT
    account_id,
    session_type as category,
    COUNT(*) as count,
    SUM(duration_minutes) as total_minutes
FROM health_fitness.workout_sessions
WHERE session_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY account_id, session_type
ORDER BY account_id, count DESC;

revoke all on health_fitness.workout_type_distribution_bar from anon, authenticated, service_role;
grant select on health_fitness.workout_type_distribution_bar to authenticated;

comment on view health_fitness.workout_type_distribution_bar is '{"type": "chart", "name": "Workout Type Distribution", "description": "Distribution of workout types in last 30 days", "chart_type": "bar"}';

CREATE VIEW health_fitness.workout_frequency_line
with (security_invoker = true)
AS
SELECT
    account_id,
    DATE_TRUNC('week', session_date)::date as week,
    COUNT(*) as workouts_per_week
FROM health_fitness.workout_sessions
WHERE session_date >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY account_id, DATE_TRUNC('week', session_date)
ORDER BY account_id, week;

revoke all on health_fitness.workout_frequency_line from anon, authenticated, service_role;
grant select on health_fitness.workout_frequency_line to authenticated;

comment on view health_fitness.workout_frequency_line is '{"type": "chart", "name": "Workout Frequency", "description": "Weekly workout frequency over last 12 weeks", "chart_type": "line"}';

CREATE VIEW health_fitness.muscle_group_distribution_pie
with (security_invoker = true)
AS
SELECT
    ws.account_id,
    ec.name as muscle_group,
    COUNT(es.id) as total_sets
FROM health_fitness.exercise_sets es
JOIN health_fitness.exercises e ON es.exercise_id = e.id
JOIN health_fitness.exercise_categories ec ON e.category_id = ec.id
JOIN health_fitness.workout_sessions ws ON es.workout_session_id = ws.id
WHERE ws.session_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ws.account_id, ec.name
ORDER BY ws.account_id, total_sets DESC;

revoke all on health_fitness.muscle_group_distribution_pie from anon, authenticated, service_role;
grant select on health_fitness.muscle_group_distribution_pie to authenticated;

comment on view health_fitness.muscle_group_distribution_pie is '{"type": "chart", "name": "Muscle Group Distribution", "description": "Distribution of exercises by muscle group in last 30 days", "chart_type": "pie"}';

CREATE VIEW health_fitness.wellness_metrics_radar
with (security_invoker = true)
AS
SELECT
    account_id,
    'Overall Wellness' as metric,
    AVG(overall_wellness) as score
FROM health_fitness.wellness_logs
WHERE log_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY account_id
UNION ALL
SELECT
    account_id,
    'Stress Level' as metric,
    10 - AVG(stress_level) as score  -- Inverted so higher is better
FROM health_fitness.wellness_logs
WHERE log_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY account_id
UNION ALL
SELECT
    account_id,
    'Mood Rating' as metric,
    AVG(mood_rating) as score
FROM health_fitness.wellness_logs
WHERE log_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY account_id
UNION ALL
SELECT
    account_id,
    'Motivation' as metric,
    AVG(motivation_level) as score
FROM health_fitness.wellness_logs
WHERE log_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY account_id
UNION ALL
SELECT
    account_id,
    'Sleep Quality' as metric,
    AVG(sleep_quality) as score
FROM health_fitness.sleep_records
WHERE sleep_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY account_id;

revoke all on health_fitness.wellness_metrics_radar from anon, authenticated, service_role;
grant select on health_fitness.wellness_metrics_radar to authenticated;

comment on view health_fitness.wellness_metrics_radar is '{"type": "chart", "name": "Wellness Metrics", "description": "Multi-dimensional wellness metrics for last 7 days", "chart_type": "radar"}';

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

-- Audit triggers
CREATE TRIGGER audit_body_measurements
    AFTER INSERT OR UPDATE OR DELETE ON health_fitness.body_measurements
    FOR EACH ROW EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_health_metrics
    AFTER INSERT OR UPDATE OR DELETE ON health_fitness.health_metrics
    FOR EACH ROW EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_sleep_records
    AFTER INSERT OR UPDATE OR DELETE ON health_fitness.sleep_records
    FOR EACH ROW EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_workout_sessions
    AFTER INSERT OR UPDATE OR DELETE ON health_fitness.workout_sessions
    FOR EACH ROW EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_meals
    AFTER INSERT OR UPDATE OR DELETE ON health_fitness.meals
    FOR EACH ROW EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_health_goals
    AFTER INSERT OR UPDATE OR DELETE ON health_fitness.health_goals
    FOR EACH ROW EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_wellness_logs
    AFTER INSERT OR UPDATE OR DELETE ON health_fitness.wellness_logs
    FOR EACH ROW EXECUTE FUNCTION supasheet.audit_trigger_function();


-- Grant permissions to user role
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.body_measurements:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.body_measurements:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.body_measurements:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.body_measurements:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.health_metrics:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.health_metrics:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.health_metrics:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.health_metrics:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.sleep_records:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.sleep_records:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.sleep_records:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.sleep_records:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercise_categories:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercise_categories:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercise_categories:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercise_categories:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercises:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercises:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercises:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercises:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_plans:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_plans:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_plans:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_plans:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_sessions:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_sessions:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_sessions:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_sessions:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercise_sets:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercise_sets:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercise_sets:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercise_sets:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.cardio_activities:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.cardio_activities:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.cardio_activities:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.cardio_activities:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.foods:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.foods:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.foods:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.foods:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.meals:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.meals:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.meals:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.meals:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.meal_foods:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.meal_foods:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.meal_foods:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.meal_foods:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.water_intake:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.water_intake:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.water_intake:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.water_intake:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.supplements:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.supplements:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.supplements:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.supplements:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.supplement_intake:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.supplement_intake:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.supplement_intake:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.supplement_intake:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.health_goals:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.health_goals:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.health_goals:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.health_goals:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.medical_conditions:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.medical_conditions:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.medical_conditions:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.medical_conditions:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.medications:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.medications:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.medications:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.medications:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.injuries:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.injuries:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.injuries:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.injuries:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.wellness_logs:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.wellness_logs:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.wellness_logs:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.wellness_logs:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.daily_summaries:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.daily_summaries:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.daily_summaries:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.daily_summaries:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.weekly_workout_summary:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.daily_nutrition_summary:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.progress_tracking:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.exercise_performance:select');

-- Grant permissions for report views
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.health_report:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_report:select');

-- Grant permissions for dashboard widget views
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.total_workouts_count:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.weight_progress_comparison:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_streak:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.calorie_balance:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.recent_workouts_simple:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.active_goals_simple:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_overview_detailed:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.nutrition_log_detailed:select');

-- Grant permissions for chart views
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.weight_trend_area:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_type_distribution_bar:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.workout_frequency_line:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.muscle_group_distribution_pie:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'health_fitness.wellness_metrics_radar:select');

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