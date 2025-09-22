-- Productivity Schema Seed Data
-- This file contains seed data for the productivity schema tables

DO $$
DECLARE
    -- Hardcoded account ID
    test_account_id UUID := 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4';
    
    -- Project IDs
    personal_dev_id UUID;
    work_project_id UUID;
    home_project_id UUID;
    learning_project_id UUID;
    health_project_id UUID;
    
    -- Priority IDs
    low_priority_id INTEGER;
    medium_priority_id INTEGER;
    high_priority_id INTEGER;
    critical_priority_id INTEGER;
    
    -- Task IDs for dependencies and subtasks
    task1_id UUID;
    task2_id UUID;
    task3_id UUID;
    task4_id UUID;
    
    -- Habit IDs
    water_habit_id UUID;
    exercise_habit_id UUID;
    reading_habit_id UUID;
    meditation_habit_id UUID;
    
    -- Goal IDs
    fitness_goal_id UUID;
    learning_goal_id UUID;
    career_goal_id UUID;
BEGIN
    -- Account ID is already hardcoded above

    -- Get priority IDs
    SELECT id INTO low_priority_id FROM productivity.task_priorities WHERE name = 'Low';
    SELECT id INTO medium_priority_id FROM productivity.task_priorities WHERE name = 'Medium';
    SELECT id INTO high_priority_id FROM productivity.task_priorities WHERE name = 'High';
    SELECT id INTO critical_priority_id FROM productivity.task_priorities WHERE name = 'Critical';

    -- Seed Projects
    INSERT INTO productivity.projects (account_id, name, description, color, icon, is_active, start_date, end_date) VALUES
    (test_account_id, 'Personal Development', 'Self-improvement and personal growth initiatives', '#4A90E2', 'user', TRUE, CURRENT_DATE - INTERVAL '90 days', NULL)
    RETURNING id INTO personal_dev_id;
    
    INSERT INTO productivity.projects (account_id, name, description, color, icon, is_active, start_date, end_date) VALUES
    (test_account_id, 'Work Projects', 'Professional work and career development', '#F5A623', 'briefcase', TRUE, CURRENT_DATE - INTERVAL '180 days', NULL)
    RETURNING id INTO work_project_id;
    
    INSERT INTO productivity.projects (account_id, name, description, color, icon, is_active, start_date, end_date) VALUES
    (test_account_id, 'Home Improvement', 'House maintenance and improvement tasks', '#7ED321', 'home', TRUE, CURRENT_DATE - INTERVAL '60 days', NULL)
    RETURNING id INTO home_project_id;
    
    INSERT INTO productivity.projects (account_id, name, description, color, icon, is_active, start_date, end_date) VALUES
    (test_account_id, 'Learning & Education', 'Courses, certifications, and skill development', '#9013FE', 'book', TRUE, CURRENT_DATE - INTERVAL '120 days', NULL)
    RETURNING id INTO learning_project_id;
    
    INSERT INTO productivity.projects (account_id, name, description, color, icon, is_active, start_date, end_date) VALUES
    (test_account_id, 'Health & Fitness', 'Exercise, nutrition, and wellness goals', '#50E3C2', 'heart', TRUE, CURRENT_DATE - INTERVAL '150 days', NULL)
    RETURNING id INTO health_project_id;
    
    INSERT INTO productivity.projects (account_id, name, description, color, icon, is_active, start_date, end_date) VALUES
    (test_account_id, 'Side Projects', 'Personal projects and hobbies', '#BD10E0', 'star', TRUE, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '60 days'),
    (test_account_id, 'Financial Planning', 'Budget and investment planning', '#B8E986', 'dollar-sign', TRUE, CURRENT_DATE - INTERVAL '200 days', NULL);

    -- Seed Tasks (various statuses, priorities, and dates)
    -- Current and upcoming tasks
    INSERT INTO productivity.tasks (account_id, project_id, title, description, priority_id, status, due_date, due_time, estimated_duration, tags, energy_level, context) VALUES
    (test_account_id, personal_dev_id, 'Complete morning routine', 'Meditation, journaling, and planning', medium_priority_id, 'completed', CURRENT_DATE, '08:00:00', 45, ARRAY['daily', 'routine', 'morning'], 'low', '@home'),
    (test_account_id, work_project_id, 'Prepare quarterly presentation', 'Q1 2024 results and Q2 planning', critical_priority_id, 'in_progress', CURRENT_DATE + INTERVAL '2 days', '14:00:00', 120, ARRAY['presentation', 'quarterly', 'important'], 'high', '@work'),
    (test_account_id, work_project_id, 'Review code pull requests', 'Review team PRs and provide feedback', high_priority_id, 'pending', CURRENT_DATE, '11:00:00', 60, ARRAY['code-review', 'team'], 'medium', '@computer'),
    (test_account_id, learning_project_id, 'Complete React course module', 'Advanced hooks and state management', medium_priority_id, 'pending', CURRENT_DATE + INTERVAL '1 day', '19:00:00', 90, ARRAY['learning', 'react', 'programming'], 'high', '@computer'),
    (test_account_id, home_project_id, 'Fix kitchen cabinet door', 'Tighten hinges and adjust alignment', low_priority_id, 'pending', CURRENT_DATE + INTERVAL '3 days', NULL, 30, ARRAY['repair', 'kitchen'], 'medium', '@home'),
    (test_account_id, health_project_id, 'Weekly meal prep', 'Prepare healthy meals for the week', medium_priority_id, 'pending', CURRENT_DATE + INTERVAL '2 days', '10:00:00', 180, ARRAY['nutrition', 'meal-prep', 'weekly'], 'medium', '@home'),
    (test_account_id, personal_dev_id, 'Journal reflection', 'Weekly reflection and planning', medium_priority_id, 'pending', CURRENT_DATE, '20:00:00', 30, ARRAY['journal', 'reflection', 'weekly'], 'low', '@home'),
    (test_account_id, work_project_id, 'Team meeting', 'Weekly sync with development team', high_priority_id, 'pending', CURRENT_DATE + INTERVAL '1 day', '10:00:00', 60, ARRAY['meeting', 'team', 'weekly'], 'medium', '@work'),
    (test_account_id, NULL, 'Buy groceries', 'Weekly grocery shopping', low_priority_id, 'pending', CURRENT_DATE + INTERVAL '1 day', '17:00:00', 45, ARRAY['shopping', 'errands'], 'low', '@errand'),
    (test_account_id, learning_project_id, 'Read "Atomic Habits"', 'Complete chapter 5-7', medium_priority_id, 'in_progress', CURRENT_DATE, '21:00:00', 60, ARRAY['reading', 'self-improvement'], 'low', '@home');

    -- Completed tasks (history)
    INSERT INTO productivity.tasks (account_id, project_id, title, description, priority_id, status, due_date, completion_date, actual_duration, tags, energy_level, context) VALUES
    (test_account_id, work_project_id, 'Deploy feature branch', 'Deploy new user dashboard to staging', high_priority_id, 'completed', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day', 45, ARRAY['deployment', 'feature'], 'high', '@computer'),
    (test_account_id, personal_dev_id, 'Morning workout', '30 min cardio + 20 min strength', medium_priority_id, 'completed', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day', 50, ARRAY['exercise', 'daily'], 'high', '@gym'),
    (test_account_id, home_project_id, 'Pay monthly bills', 'Utilities, internet, insurance', high_priority_id, 'completed', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days', 20, ARRAY['bills', 'monthly'], 'low', '@computer'),
    (test_account_id, learning_project_id, 'Complete Python tutorial', 'Data structures and algorithms', medium_priority_id, 'completed', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days', 120, ARRAY['learning', 'python'], 'high', '@computer'),
    (test_account_id, work_project_id, 'Client meeting', 'Project requirements discussion', critical_priority_id, 'completed', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days', 90, ARRAY['meeting', 'client'], 'medium', '@work');

    -- Recurring tasks
    INSERT INTO productivity.tasks (account_id, project_id, title, description, priority_id, status, due_date, is_recurring, recurring_pattern, tags, energy_level, context) VALUES
    (test_account_id, personal_dev_id, 'Weekly review', 'Review goals and plan next week', high_priority_id, 'pending', CURRENT_DATE + INTERVAL '3 days', TRUE, '{"frequency": "weekly", "interval": 1, "daysOfWeek": [0]}'::JSONB, ARRAY['review', 'planning', 'weekly'], 'medium', '@home'),
    (test_account_id, health_project_id, 'Gym workout', 'Strength training routine', medium_priority_id, 'pending', CURRENT_DATE + INTERVAL '1 day', TRUE, '{"frequency": "daily", "interval": 2}'::JSONB, ARRAY['exercise', 'gym', 'recurring'], 'high', '@gym'),
    (test_account_id, work_project_id, 'Daily standup', 'Team sync meeting', medium_priority_id, 'pending', CURRENT_DATE + INTERVAL '1 day', TRUE, '{"frequency": "daily", "interval": 1, "daysOfWeek": [1,2,3,4,5]}'::JSONB, ARRAY['meeting', 'daily', 'team'], 'low', '@work');

    -- Get some task IDs for subtasks and dependencies
    SELECT id INTO task1_id FROM productivity.tasks WHERE title = 'Prepare quarterly presentation' LIMIT 1;
    SELECT id INTO task2_id FROM productivity.tasks WHERE title = 'Review code pull requests' LIMIT 1;
    SELECT id INTO task3_id FROM productivity.tasks WHERE title = 'Team meeting' LIMIT 1;
    SELECT id INTO task4_id FROM productivity.tasks WHERE title = 'Weekly meal prep' LIMIT 1;

    -- Subtasks
    INSERT INTO productivity.tasks (account_id, parent_task_id, title, description, priority_id, status, due_date, estimated_duration, tags, energy_level, context) VALUES
    (test_account_id, task1_id, 'Gather Q1 metrics', 'Collect performance data from all departments', high_priority_id, 'completed', CURRENT_DATE, 60, ARRAY['data', 'metrics'], 'medium', '@computer'),
    (test_account_id, task1_id, 'Create presentation slides', 'Design and populate slide deck', high_priority_id, 'in_progress', CURRENT_DATE + INTERVAL '1 day', 90, ARRAY['presentation', 'design'], 'medium', '@computer'),
    (test_account_id, task1_id, 'Practice presentation', 'Rehearse and time the presentation', medium_priority_id, 'pending', CURRENT_DATE + INTERVAL '2 days', 30, ARRAY['practice', 'presentation'], 'low', '@office'),
    (test_account_id, task4_id, 'Plan meal menu', 'Choose recipes for the week', medium_priority_id, 'pending', CURRENT_DATE + INTERVAL '1 day', 30, ARRAY['planning', 'meals'], 'low', '@home'),
    (test_account_id, task4_id, 'Shop for ingredients', 'Buy all required ingredients', medium_priority_id, 'pending', CURRENT_DATE + INTERVAL '1 day', 60, ARRAY['shopping', 'groceries'], 'low', '@errand'),
    (test_account_id, task4_id, 'Cook and portion meals', 'Prepare and package all meals', medium_priority_id, 'pending', CURRENT_DATE + INTERVAL '2 days', 120, ARRAY['cooking', 'meal-prep'], 'medium', '@home');

    -- Task Dependencies
    INSERT INTO productivity.task_dependencies (task_id, depends_on_task_id, dependency_type) VALUES
    (task3_id, task2_id, 'finish_to_start'),  -- Team meeting depends on code review
    (task1_id, task3_id, 'finish_to_start');  -- Presentation depends on team meeting

    -- Seed Habits
    INSERT INTO productivity.habits (account_id, name, description, category, frequency_type, frequency_value, target_value, unit, color, icon, start_date, is_active, streak_count, best_streak, reminder_time) VALUES
    (test_account_id, 'Drink Water', 'Stay hydrated throughout the day', 'Health', 'daily', 1, 8, 'glasses', '#4A90E2', 'droplet', CURRENT_DATE - INTERVAL '30 days', TRUE, 12, 15, '08:00:00')
    RETURNING id INTO water_habit_id;
    
    INSERT INTO productivity.habits (account_id, name, description, category, frequency_type, frequency_value, target_value, unit, color, icon, start_date, is_active, streak_count, best_streak, reminder_time) VALUES
    (test_account_id, 'Morning Exercise', 'Physical activity to start the day', 'Fitness', 'daily', 1, 30, 'minutes', '#50E3C2', 'activity', CURRENT_DATE - INTERVAL '60 days', TRUE, 8, 22, '06:30:00')
    RETURNING id INTO exercise_habit_id;
    
    INSERT INTO productivity.habits (account_id, name, description, category, frequency_type, frequency_value, target_value, unit, color, icon, start_date, is_active, streak_count, best_streak, reminder_time) VALUES
    (test_account_id, 'Read Books', 'Reading for personal growth', 'Learning', 'daily', 1, 30, 'minutes', '#9013FE', 'book', CURRENT_DATE - INTERVAL '45 days', TRUE, 15, 18, '21:00:00')
    RETURNING id INTO reading_habit_id;
    
    INSERT INTO productivity.habits (account_id, name, description, category, frequency_type, frequency_value, target_value, unit, color, icon, start_date, is_active, streak_count, best_streak, reminder_time) VALUES
    (test_account_id, 'Meditation', 'Mindfulness and stress reduction', 'Wellness', 'daily', 1, 10, 'minutes', '#F5A623', 'sun', CURRENT_DATE - INTERVAL '90 days', TRUE, 25, 31, '07:00:00')
    RETURNING id INTO meditation_habit_id;
    
    INSERT INTO productivity.habits (account_id, name, description, category, frequency_type, frequency_value, target_value, unit, color, icon, start_date, is_active, streak_count, best_streak, reminder_time) VALUES
    (test_account_id, 'Journal Writing', 'Daily reflection and gratitude', 'Personal', 'daily', 1, 1, 'entry', '#BD10E0', 'edit', CURRENT_DATE - INTERVAL '20 days', TRUE, 5, 10, '22:00:00'),
    (test_account_id, 'Learn Spanish', 'Language learning practice', 'Learning', 'daily', 1, 15, 'minutes', '#7ED321', 'globe', CURRENT_DATE - INTERVAL '15 days', TRUE, 10, 10, '12:30:00'),
    (test_account_id, 'Protein Intake', 'Track daily protein consumption', 'Nutrition', 'daily', 1, 100, 'grams', '#FF6B6B', 'target', CURRENT_DATE - INTERVAL '25 days', TRUE, 7, 12, '20:00:00'),
    (test_account_id, 'Sleep 8 Hours', 'Maintain consistent sleep schedule', 'Health', 'daily', 1, 8, 'hours', '#4ECDC4', 'moon', CURRENT_DATE - INTERVAL '40 days', TRUE, 20, 24, '22:30:00'),
    (test_account_id, 'No Social Media', 'Limit social media usage', 'Productivity', 'daily', 1, 0, 'hours', '#95E1D3', 'x-circle', CURRENT_DATE - INTERVAL '10 days', TRUE, 3, 6, '09:00:00'),
    (test_account_id, 'Weekly Planning', 'Plan the upcoming week', 'Productivity', 'weekly', 1, 1, 'session', '#F38181', 'calendar', CURRENT_DATE - INTERVAL '100 days', TRUE, 14, 14, '18:00:00');

    -- Seed Habit Logs (last 30 days of tracking)
    -- Water habit logs
    INSERT INTO productivity.habit_logs (habit_id, log_date, completed, value, mood, notes)
    SELECT 
        water_habit_id,
        CURRENT_DATE - (n || ' days')::INTERVAL,
        CASE WHEN RANDOM() > 0.2 THEN TRUE ELSE FALSE END,
        CASE WHEN RANDOM() > 0.2 THEN 6 + FLOOR(RANDOM() * 4)::DECIMAL ELSE 4 + FLOOR(RANDOM() * 3)::DECIMAL END,
        1 + FLOOR(RANDOM() * 5)::INTEGER,
        CASE WHEN RANDOM() > 0.7 THEN 'Good hydration day!' ELSE NULL END
    FROM generate_series(0, 29) AS n;

    -- Exercise habit logs
    INSERT INTO productivity.habit_logs (habit_id, log_date, completed, value, mood, notes)
    SELECT 
        exercise_habit_id,
        CURRENT_DATE - (n || ' days')::INTERVAL,
        CASE WHEN RANDOM() > 0.3 THEN TRUE ELSE FALSE END,
        CASE WHEN RANDOM() > 0.3 THEN 20 + FLOOR(RANDOM() * 40)::DECIMAL ELSE 10 + FLOOR(RANDOM() * 15)::DECIMAL END,
        2 + FLOOR(RANDOM() * 4)::INTEGER,
        CASE WHEN RANDOM() > 0.8 THEN 'Great workout!' WHEN RANDOM() > 0.6 THEN 'Feeling strong' ELSE NULL END
    FROM generate_series(0, 29) AS n;

    -- Reading habit logs
    INSERT INTO productivity.habit_logs (habit_id, log_date, completed, value, mood, notes)
    SELECT 
        reading_habit_id,
        CURRENT_DATE - (n || ' days')::INTERVAL,
        CASE WHEN RANDOM() > 0.25 THEN TRUE ELSE FALSE END,
        CASE WHEN RANDOM() > 0.25 THEN 20 + FLOOR(RANDOM() * 40)::DECIMAL ELSE 10 + FLOOR(RANDOM() * 20)::DECIMAL END,
        2 + FLOOR(RANDOM() * 4)::INTEGER,
        CASE WHEN RANDOM() > 0.85 THEN 'Finished a chapter!' ELSE NULL END
    FROM generate_series(0, 29) AS n;

    -- Meditation habit logs
    INSERT INTO productivity.habit_logs (habit_id, log_date, completed, value, mood, notes)
    SELECT 
        meditation_habit_id,
        CURRENT_DATE - (n || ' days')::INTERVAL,
        CASE WHEN RANDOM() > 0.15 THEN TRUE ELSE FALSE END,
        CASE WHEN RANDOM() > 0.15 THEN 10 + FLOOR(RANDOM() * 10)::DECIMAL ELSE 5 + FLOOR(RANDOM() * 5)::DECIMAL END,
        3 + FLOOR(RANDOM() * 3)::INTEGER,
        CASE WHEN RANDOM() > 0.9 THEN 'Very peaceful session' ELSE NULL END
    FROM generate_series(0, 29) AS n;

    -- Seed Goals
    INSERT INTO productivity.goals (account_id, title, description, category, type, status, priority, target_value, current_value, unit, start_date, target_date, parent_goal_id, progress_percentage) VALUES
    (test_account_id, 'Lose 10kg Weight', 'Achieve target weight through diet and exercise', 'Health', 'outcome', 'in_progress', 'high', 10, 3.5, 'kg', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '120 days', NULL, 35)
    RETURNING id INTO fitness_goal_id;
    
    INSERT INTO productivity.goals (account_id, title, description, category, type, status, priority, target_value, current_value, unit, start_date, target_date, parent_goal_id, progress_percentage) VALUES
    (test_account_id, 'Complete AWS Certification', 'Get AWS Solutions Architect certification', 'Career', 'outcome', 'in_progress', 'critical', 100, 65, 'percent', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days', NULL, 65)
    RETURNING id INTO learning_goal_id;
    
    INSERT INTO productivity.goals (account_id, title, description, category, type, status, priority, target_value, current_value, unit, start_date, target_date, parent_goal_id, progress_percentage) VALUES
    (test_account_id, 'Read 52 Books', 'Read one book per week for a year', 'Learning', 'process', 'in_progress', 'medium', 52, 18, 'books', CURRENT_DATE - INTERVAL '120 days', CURRENT_DATE + INTERVAL '245 days', NULL, 35)
    RETURNING id INTO career_goal_id;
    
    INSERT INTO productivity.goals (account_id, title, description, category, type, status, priority, target_value, current_value, unit, start_date, target_date, parent_goal_id, progress_percentage) VALUES
    (test_account_id, 'Build Emergency Fund', 'Save 6 months of expenses', 'Financial', 'outcome', 'in_progress', 'critical', 30000, 12000, 'dollars', CURRENT_DATE - INTERVAL '180 days', CURRENT_DATE + INTERVAL '180 days', NULL, 40),
    (test_account_id, 'Learn Spanish', 'Achieve B2 level proficiency', 'Learning', 'learning', 'in_progress', 'medium', 100, 30, 'percent', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '270 days', NULL, 30),
    (test_account_id, 'Run a Marathon', 'Complete first full marathon', 'Fitness', 'outcome', 'not_started', 'high', 42.2, 0, 'km', CURRENT_DATE, CURRENT_DATE + INTERVAL '180 days', NULL, 0),
    (test_account_id, 'Launch Side Project', 'Build and launch SaaS product', 'Business', 'outcome', 'in_progress', 'high', 100, 45, 'percent', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '75 days', NULL, 45),
    (test_account_id, 'Master React Framework', 'Complete advanced React course and build 3 projects', 'Technical', 'learning', 'in_progress', 'medium', 3, 1, 'projects', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '70 days', NULL, 33),
    (test_account_id, 'Improve Sleep Quality', 'Consistent 8 hours sleep with 85%+ sleep score', 'Health', 'process', 'in_progress', 'high', 85, 72, 'percent', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '60 days', NULL, 85),
    (test_account_id, 'Network Growth', 'Build professional network to 500+ connections', 'Career', 'outcome', 'on_hold', 'low', 500, 234, 'connections', CURRENT_DATE - INTERVAL '100 days', CURRENT_DATE + INTERVAL '200 days', NULL, 47);

    -- Seed Goal Milestones
    INSERT INTO productivity.goal_milestones (goal_id, title, description, target_value, target_date, completed, completion_date, order_index) VALUES
    -- Weight loss milestones
    (fitness_goal_id, 'Lose first 2kg', 'Initial weight loss target', 2, CURRENT_DATE - INTERVAL '30 days', TRUE, CURRENT_DATE - INTERVAL '25 days', 1),
    (fitness_goal_id, 'Reach 5kg loss', 'Halfway milestone', 5, CURRENT_DATE + INTERVAL '30 days', FALSE, NULL, 2),
    (fitness_goal_id, 'Final goal - 10kg', 'Reach target weight', 10, CURRENT_DATE + INTERVAL '120 days', FALSE, NULL, 3),
    
    -- AWS Certification milestones
    (learning_goal_id, 'Complete course modules', 'Finish all video lessons', 100, CURRENT_DATE - INTERVAL '10 days', TRUE, CURRENT_DATE - INTERVAL '5 days', 1),
    (learning_goal_id, 'Pass practice exams', 'Score 80%+ on 3 practice exams', 3, CURRENT_DATE + INTERVAL '10 days', FALSE, NULL, 2),
    (learning_goal_id, 'Take certification exam', 'Pass the actual AWS exam', 1, CURRENT_DATE + INTERVAL '30 days', FALSE, NULL, 3),
    
    -- Career goal milestones
    (career_goal_id, 'Update resume and LinkedIn', 'Professional profile refresh', 100, CURRENT_DATE - INTERVAL '60 days', TRUE, CURRENT_DATE - INTERVAL '55 days', 1),
    (career_goal_id, 'Complete 5 interviews', 'Practice interview skills', 5, CURRENT_DATE + INTERVAL '30 days', FALSE, NULL, 2),
    (career_goal_id, 'Get job offer', 'Receive and accept offer', 1, CURRENT_DATE + INTERVAL '90 days', FALSE, NULL, 3);

    -- Seed Calendar Events
    INSERT INTO productivity.calendar_events (account_id, title, description, location, start_datetime, end_datetime, is_all_day, event_type, color, reminder_minutes, status) VALUES
    -- Today's events
    (test_account_id, 'Team Standup', 'Daily sync meeting', 'Conference Room A', CURRENT_DATE + TIME '09:00:00', CURRENT_DATE + TIME '09:30:00', FALSE, 'meeting', '#4A90E2', ARRAY[15, 5], 'confirmed'),
    (test_account_id, 'Lunch with Client', 'Discuss project requirements', 'Downtown Restaurant', CURRENT_DATE + TIME '12:30:00', CURRENT_DATE + TIME '14:00:00', FALSE, 'meeting', '#F5A623', ARRAY[60, 30], 'confirmed'),
    (test_account_id, 'Gym Session', 'Leg day workout', 'Local Gym', CURRENT_DATE + TIME '18:00:00', CURRENT_DATE + TIME '19:30:00', FALSE, 'personal', '#50E3C2', ARRAY[30], 'confirmed'),
    
    -- Tomorrow's events
    (test_account_id, 'Project Deadline', 'Submit final deliverables', NULL, CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '1 day', TRUE, 'deadline', '#DC3545', ARRAY[1440, 120], 'confirmed'),
    (test_account_id, 'Doctor Appointment', 'Annual checkup', 'Medical Center', (CURRENT_DATE + INTERVAL '1 day') + TIME '10:00:00', (CURRENT_DATE + INTERVAL '1 day') + TIME '11:00:00', FALSE, 'appointment', '#7ED321', ARRAY[60], 'confirmed'),
    
    -- Next week events
    (test_account_id, 'Team Building Event', 'Quarterly team outing', 'Adventure Park', (CURRENT_DATE + INTERVAL '7 days') + TIME '09:00:00', (CURRENT_DATE + INTERVAL '7 days') + TIME '17:00:00', FALSE, 'event', '#9013FE', ARRAY[1440], 'tentative'),
    (test_account_id, 'Birthday Party', 'Friend''s birthday celebration', 'Their House', (CURRENT_DATE + INTERVAL '5 days') + TIME '19:00:00', (CURRENT_DATE + INTERVAL '5 days') + TIME '23:00:00', FALSE, 'personal', '#BD10E0', ARRAY[120], 'confirmed'),
    (test_account_id, 'Webinar: AI Trends', 'Latest developments in AI', 'Online', (CURRENT_DATE + INTERVAL '3 days') + TIME '14:00:00', (CURRENT_DATE + INTERVAL '3 days') + TIME '16:00:00', FALSE, 'learning', '#4ECDC4', ARRAY[30, 10], 'confirmed'),
    
    -- Past events
    (test_account_id, 'Quarterly Review', 'Q1 performance review', 'Office', (CURRENT_DATE - INTERVAL '3 days') + TIME '10:00:00', (CURRENT_DATE - INTERVAL '3 days') + TIME '12:00:00', FALSE, 'meeting', '#FF6B6B', ARRAY[60], 'confirmed'),
    (test_account_id, 'Conference Day 1', 'Tech conference attendance', 'Convention Center', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '10 days', TRUE, 'conference', '#95E1D3', ARRAY[1440], 'confirmed');

    -- Seed Time Blocks
    INSERT INTO productivity.time_blocks (account_id, title, description, block_date, start_time, end_time, activity_type, task_id, goal_id, color, is_flexible, energy_required) VALUES
    -- Today's time blocks
    (test_account_id, 'Deep Work', 'Focus on coding tasks', CURRENT_DATE, '09:30:00', '11:30:00', 'work', task2_id, NULL, '#4A90E2', FALSE, 'high'),
    (test_account_id, 'Email & Admin', 'Process emails and admin tasks', CURRENT_DATE, '11:30:00', '12:00:00', 'work', NULL, NULL, '#FFC107', TRUE, 'low'),
    (test_account_id, 'Lunch Break', 'Lunch and rest', CURRENT_DATE, '12:00:00', '13:00:00', 'break', NULL, NULL, '#28A745', FALSE, 'low'),
    (test_account_id, 'Project Work', 'Continue main project', CURRENT_DATE, '13:00:00', '16:00:00', 'work', task1_id, career_goal_id, '#DC3545', FALSE, 'high'),
    (test_account_id, 'Learning Time', 'Study React course', CURRENT_DATE, '16:00:00', '17:00:00', 'personal', NULL, learning_goal_id, '#9013FE', TRUE, 'medium'),
    
    -- Tomorrow's time blocks
    (test_account_id, 'Morning Routine', 'Exercise and meditation', CURRENT_DATE + INTERVAL '1 day', '06:00:00', '07:30:00', 'personal', NULL, fitness_goal_id, '#50E3C2', FALSE, 'medium'),
    (test_account_id, 'Focus Block', 'Complete important tasks', CURRENT_DATE + INTERVAL '1 day', '08:00:00', '10:00:00', 'work', NULL, NULL, '#4A90E2', FALSE, 'high'),
    (test_account_id, 'Meeting Block', 'Team and client meetings', CURRENT_DATE + INTERVAL '1 day', '10:00:00', '12:00:00', 'work', task3_id, NULL, '#F5A623', FALSE, 'medium'),
    (test_account_id, 'Creative Time', 'Brainstorming and planning', CURRENT_DATE + INTERVAL '1 day', '14:00:00', '16:00:00', 'work', NULL, NULL, '#BD10E0', TRUE, 'high'),
    
    -- Past time blocks
    (test_account_id, 'Report Writing', 'Quarterly report preparation', CURRENT_DATE - INTERVAL '2 days', '09:00:00', '12:00:00', 'work', NULL, NULL, '#7ED321', FALSE, 'high'),
    (test_account_id, 'Code Review', 'Review team pull requests', CURRENT_DATE - INTERVAL '1 day', '14:00:00', '16:00:00', 'work', NULL, NULL, '#4A90E2', FALSE, 'medium');

    -- Seed Notes
    INSERT INTO productivity.notes (account_id, title, content, note_type, tags, created_date, mood, weather, task_id, goal_id, is_private) VALUES
    (test_account_id, 'Project Ideas', 'Brainstorming for new features:\n1. User dashboard improvements\n2. Analytics module\n3. Export functionality\n4. Mobile app considerations', 'idea', ARRAY['project', 'brainstorming', 'features'], CURRENT_DATE, 4, 'sunny', NULL, NULL, FALSE),
    (test_account_id, 'Meeting Notes - Client Call', 'Key points:\n- Budget approved for Q2\n- Timeline extended by 2 weeks\n- New feature requests added\n- Follow-up meeting next Tuesday', 'meeting', ARRAY['client', 'project', 'requirements'], CURRENT_DATE - INTERVAL '1 day', 3, 'cloudy', task1_id, NULL, FALSE),
    (test_account_id, 'Daily Journal', 'Today was productive. Completed most of my tasks and had a good workout. Feeling motivated to tackle tomorrow''s challenges. Need to focus more on the React course.', 'journal', ARRAY['daily', 'reflection'], CURRENT_DATE - INTERVAL '1 day', 4, 'partly cloudy', NULL, NULL, TRUE),
    (test_account_id, 'Learning Notes - React Hooks', 'useState vs useReducer:\n- useState for simple state\n- useReducer for complex state logic\n- Custom hooks for reusability\n\nNext: Study useContext and useMemo', 'learning', ARRAY['react', 'programming', 'study'], CURRENT_DATE - INTERVAL '2 days', 3, 'rainy', NULL, learning_goal_id, FALSE),
    (test_account_id, 'Workout Log', 'Legs & Core:\n- Squats: 4x12 @ 60kg\n- Lunges: 3x10 each leg\n- Leg Press: 4x15 @ 100kg\n- Planks: 3x60s\n\nFeeling strong!', 'general', ARRAY['fitness', 'workout', 'progress'], CURRENT_DATE - INTERVAL '3 days', 5, 'sunny', NULL, fitness_goal_id, FALSE),
    (test_account_id, 'Book Notes - Atomic Habits', 'Chapter 3 Key Points:\n1. Small changes compound over time\n2. Focus on systems, not goals\n3. Identity-based habits are more sustainable\n4. The 2-minute rule for starting new habits', 'learning', ARRAY['books', 'self-improvement', 'habits'], CURRENT_DATE - INTERVAL '4 days', 4, 'windy', NULL, NULL, FALSE),
    (test_account_id, 'Weekly Reflection', 'This week''s wins:\n- Completed project milestone\n- Maintained exercise routine\n- Read 2 books\n\nAreas for improvement:\n- Time management\n- Sleep schedule\n- Email organization', 'journal', ARRAY['weekly', 'reflection', 'review'], CURRENT_DATE - INTERVAL '7 days', 3, 'overcast', NULL, NULL, TRUE),
    (test_account_id, 'Recipe - Meal Prep', 'Chicken & Rice Bowls:\n- 500g chicken breast\n- 2 cups brown rice\n- Mixed vegetables\n- Teriyaki sauce\n\nPrep time: 30 min\nCook time: 45 min\nMakes: 5 meals', 'general', ARRAY['cooking', 'meal-prep', 'recipes'], CURRENT_DATE - INTERVAL '5 days', 4, 'sunny', task4_id, NULL, FALSE);

    -- Seed Reviews/Reflections
    INSERT INTO productivity.reviews (account_id, review_type, review_date, achievements, challenges, lessons_learned, gratitude, energy_level, productivity_rating, mood_rating, next_period_focus) VALUES
    -- Daily reviews
    (test_account_id, 'daily', CURRENT_DATE - INTERVAL '1 day', 
     'Completed all high-priority tasks. Had productive meetings. Good workout session.', 
     'Struggled with focus in the afternoon. Email backlog growing.', 
     'Morning deep work sessions are most productive. Need to batch email processing.',
     'Grateful for supportive team and good health.',
     7, 8, 7,
     'Focus on presentation preparation and code review.'),
    
    (test_account_id, 'daily', CURRENT_DATE - INTERVAL '2 days',
     'Finished major project milestone. Great team collaboration.',
     'Technical issues with deployment. Skipped workout.',
     'Always have a backup plan for deployments. Exercise is non-negotiable.',
     'Thankful for patient clients and skilled colleagues.',
     6, 7, 6,
     'Catch up on exercise and tackle technical debt.'),
    
    -- Weekly reviews
    (test_account_id, 'weekly', CURRENT_DATE - INTERVAL '7 days',
     'Hit all weekly goals. Read 2 books. Maintained workout streak. Project on track.',
     'Work-life balance needs improvement. Too many late nights.',
     'Setting boundaries is important. Quality sleep improves everything.',
     'Grateful for progress made and lessons learned.',
     7, 8, 7,
     'Implement better evening routine. Start delegation. Focus on high-impact tasks.'),
    
    (test_account_id, 'weekly', CURRENT_DATE - INTERVAL '14 days',
     'Launched new feature successfully. Great client feedback. Personal best in running.',
     'Missed several morning routines. Diet consistency lacking.',
     'Consistency beats perfection. Small wins compound.',
     'Thankful for opportunities to grow and improve.',
     6, 7, 7,
     'Re-establish morning routine. Meal prep on Sundays.'),
    
    -- Monthly review
    (test_account_id, 'monthly', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'),
     'Completed 3 major projects. Read 8 books. Lost 2kg. Improved React skills significantly.',
     'Burnout risk from overcommitment. Social life neglected.',
     'Balance is key to sustainability. Quality over quantity in commitments.',
     'Grateful for health, growth, and supportive environment.',
     6, 8, 7,
     'Reduce commitments. Schedule social time. Focus on fewer, deeper projects.');

    -- Seed Focus Sessions
    INSERT INTO productivity.focus_sessions (account_id, task_id, session_type, planned_duration, actual_duration, start_time, end_time, completed, interruptions, productivity_rating, notes) VALUES
    -- Completed sessions
    (test_account_id, task1_id, 'deep_work', 90, 85, CURRENT_DATE - INTERVAL '1 day' + TIME '09:00:00', CURRENT_DATE - INTERVAL '1 day' + TIME '10:25:00', TRUE, 1, 4, 'Good focus, one phone interruption'),
    (test_account_id, task2_id, 'pomodoro', 25, 25, CURRENT_DATE - INTERVAL '1 day' + TIME '14:00:00', CURRENT_DATE - INTERVAL '1 day' + TIME '14:25:00', TRUE, 0, 5, 'Perfect focus session'),
    (test_account_id, NULL, 'break', 10, 10, CURRENT_DATE - INTERVAL '1 day' + TIME '14:25:00', CURRENT_DATE - INTERVAL '1 day' + TIME '14:35:00', TRUE, 0, NULL, 'Quick walk and water'),
    (test_account_id, task2_id, 'pomodoro', 25, 25, CURRENT_DATE - INTERVAL '1 day' + TIME '14:35:00', CURRENT_DATE - INTERVAL '1 day' + TIME '15:00:00', TRUE, 0, 5, 'Continued momentum'),
    (test_account_id, NULL, 'custom', 60, 55, CURRENT_DATE - INTERVAL '2 days' + TIME '10:00:00', CURRENT_DATE - INTERVAL '2 days' + TIME '10:55:00', TRUE, 2, 3, 'Learning session with some distractions'),
    (test_account_id, task3_id, 'deep_work', 120, 110, CURRENT_DATE - INTERVAL '3 days' + TIME '08:00:00', CURRENT_DATE - INTERVAL '3 days' + TIME '09:50:00', TRUE, 3, 3, 'Morning session, multiple interruptions'),
    
    -- Today's sessions
    (test_account_id, task1_id, 'pomodoro', 25, 25, CURRENT_DATE + TIME '09:00:00', CURRENT_DATE + TIME '09:25:00', TRUE, 0, 5, 'Great start to the day'),
    (test_account_id, NULL, 'break', 5, 5, CURRENT_DATE + TIME '09:25:00', CURRENT_DATE + TIME '09:30:00', TRUE, 0, NULL, 'Quick stretch'),
    (test_account_id, task1_id, 'pomodoro', 25, 20, CURRENT_DATE + TIME '09:30:00', CURRENT_DATE + TIME '09:50:00', TRUE, 1, 4, 'Meeting interrupt, but recovered well'),
    
    -- Incomplete session
    (test_account_id, task2_id, 'deep_work', 60, NULL, CURRENT_DATE + TIME '14:00:00', NULL, FALSE, 0, NULL, 'In progress');

    RAISE NOTICE 'Productivity schema seed data inserted successfully';
END $$;