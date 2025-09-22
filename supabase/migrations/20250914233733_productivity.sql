-- Personal Productivity Database Schema
-- PostgreSQL implementation for Todo Lists, Habits, Goals, and Planning

-- Create database (uncomment if needed)
-- CREATE DATABASE personal_productivity;

-- Use the database
-- \c personal_productivity;
create schema if not exists productivity;

grant usage on schema productivity to authenticated;

-- Projects/Areas Table
CREATE TABLE productivity.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.projects from anon, authenticated, service_role;
grant select on table productivity.projects to authenticated;

alter table productivity.projects enable row level security;

create policy "Allow authenticated read access" on productivity.projects
    for select
    to authenticated
    using (true);

-- Task Priority Levels
CREATE TABLE productivity.task_priorities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    level INTEGER NOT NULL UNIQUE,
    color VARCHAR(7)
);

revoke all on table productivity.task_priorities from anon, authenticated, service_role;
grant select on table productivity.task_priorities to authenticated;

alter table productivity.task_priorities enable row level security;

create policy "Allow authenticated read access" on productivity.task_priorities
    for select
    to authenticated
    using (true);

-- Tasks/Todo Items Table
CREATE TABLE productivity.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    project_id UUID REFERENCES productivity.projects(id) ON DELETE SET NULL,
    parent_task_id UUID REFERENCES productivity.tasks(id) ON DELETE CASCADE, -- For subtasks
    title VARCHAR(500) NOT NULL,
    description TEXT,
    priority_id INTEGER REFERENCES productivity.task_priorities(id) DEFAULT 2,
    status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'waiting')) DEFAULT 'pending',
    due_date DATE,
    due_time TIME,
    estimated_duration INTEGER, -- in minutes
    actual_duration INTEGER, -- in minutes
    completion_date TIMESTAMP,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_pattern JSONB, -- Store recurring rules as JSON
    tags TEXT[], -- Array of tags
    energy_level VARCHAR(10) CHECK (energy_level IN ('low', 'medium', 'high')),
    context VARCHAR(100), -- @home, @work, @computer, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.tasks from anon, authenticated, service_role;
grant select on table productivity.tasks to authenticated;

alter table productivity.tasks enable row level security;

create policy "Allow authenticated read access" on productivity.tasks
    for select
    to authenticated
    using (true);

-- Task Dependencies
CREATE TABLE productivity.task_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES productivity.tasks(id) ON DELETE CASCADE,
    depends_on_task_id UUID REFERENCES productivity.tasks(id) ON DELETE CASCADE,
    dependency_type VARCHAR(20) CHECK (dependency_type IN ('finish_to_start', 'start_to_start', 'finish_to_finish')) DEFAULT 'finish_to_start',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, depends_on_task_id)
);

revoke all on table productivity.task_dependencies from anon, authenticated, service_role;
grant select on table productivity.task_dependencies to authenticated;

alter table productivity.task_dependencies enable row level security;

create policy "Allow authenticated read access" on productivity.task_dependencies
    for select
    to authenticated
    using (true);

-- Habits Table
CREATE TABLE productivity.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    frequency_type VARCHAR(20) CHECK (frequency_type IN ('daily', 'weekly', 'monthly', 'custom')) DEFAULT 'daily',
    frequency_value INTEGER DEFAULT 1, -- How many times per frequency_type
    target_value DECIMAL(10,2), -- For measurable habits (e.g., 8 glasses of water)
    unit VARCHAR(50), -- Unit of measurement (glasses, minutes, pages, etc.)
    color VARCHAR(7),
    icon VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    streak_count INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    reminder_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.habits from anon, authenticated, service_role;
grant select on table productivity.habits to authenticated;

alter table productivity.habits enable row level security;

create policy "Allow authenticated read access" on productivity.habits
    for select
    to authenticated
    using (true);

-- Habit Tracking/Logs
CREATE TABLE productivity.habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID REFERENCES productivity.habits(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    value DECIMAL(10,2), -- Actual value achieved (for measurable habits)
    notes TEXT,
    mood INTEGER CHECK (mood >= 1 AND mood <= 5), -- 1-5 scale
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, log_date)
);

revoke all on table productivity.habit_logs from anon, authenticated, service_role;
grant select on table productivity.habit_logs to authenticated;

alter table productivity.habit_logs enable row level security;

create policy "Allow authenticated read access" on productivity.habit_logs
    for select
    to authenticated
    using (true);

-- Goals Table
CREATE TABLE productivity.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    type VARCHAR(20) CHECK (type IN ('outcome', 'process', 'learning')) DEFAULT 'outcome',
    status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold', 'cancelled')) DEFAULT 'not_started',
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    target_value DECIMAL(15,2),
    current_value DECIMAL(15,2) DEFAULT 0,
    unit VARCHAR(50),
    start_date DATE,
    target_date DATE,
    completion_date DATE,
    parent_goal_id UUID REFERENCES productivity.goals(id), -- For sub-goals
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.goals from anon, authenticated, service_role;
grant select on table productivity.goals to authenticated;

alter table productivity.goals enable row level security;

create policy "Allow authenticated read access" on productivity.goals
    for select
    to authenticated
    using (true);

-- Goal Milestones
CREATE TABLE productivity.goal_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES productivity.goals(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_value DECIMAL(15,2),
    target_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    completion_date DATE,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.goal_milestones from anon, authenticated, service_role;
grant select on table productivity.goal_milestones to authenticated;

alter table productivity.goal_milestones enable row level security;

create policy "Allow authenticated read access" on productivity.goal_milestones
    for select
    to authenticated
    using (true);

-- Calendar Events/Appointments
CREATE TABLE productivity.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    is_all_day BOOLEAN DEFAULT FALSE,
    event_type VARCHAR(50) DEFAULT 'appointment',
    color VARCHAR(7),
    reminder_minutes INTEGER[], -- Array of reminder times in minutes
    recurrence_rule TEXT, -- RRULE for recurring events
    status VARCHAR(20) CHECK (status IN ('tentative', 'confirmed', 'cancelled')) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.calendar_events from anon, authenticated, service_role;
grant select on table productivity.calendar_events to authenticated;

alter table productivity.calendar_events enable row level security;

create policy "Allow authenticated read access" on productivity.calendar_events
    for select
    to authenticated
    using (true);

-- Time Blocks/Time Blocking
CREATE TABLE productivity.time_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    block_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    activity_type VARCHAR(50), -- work, personal, break, etc.
    task_id UUID REFERENCES productivity.tasks(id) ON DELETE SET NULL,
    goal_id UUID REFERENCES productivity.goals(id) ON DELETE SET NULL,
    color VARCHAR(7),
    is_flexible BOOLEAN DEFAULT FALSE,
    energy_required VARCHAR(10) CHECK (energy_required IN ('low', 'medium', 'high')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.time_blocks from anon, authenticated, service_role;
grant select on table productivity.time_blocks to authenticated;

alter table productivity.time_blocks enable row level security;

create policy "Allow authenticated read access" on productivity.time_blocks
    for select
    to authenticated
    using (true);

-- Notes/Journal Entries
CREATE TABLE productivity.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    title VARCHAR(300),
    content TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'general', -- journal, meeting, idea, etc.
    tags TEXT[],
    created_date DATE DEFAULT CURRENT_DATE,
    mood INTEGER CHECK (mood >= 1 AND mood <= 5),
    weather VARCHAR(50),
    task_id UUID REFERENCES productivity.tasks(id) ON DELETE SET NULL,
    goal_id UUID REFERENCES productivity.goals(id) ON DELETE SET NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.notes from anon, authenticated, service_role;
grant select on table productivity.notes to authenticated;

alter table productivity.notes enable row level security;

create policy "Allow authenticated read access" on productivity.notes
    for select
    to authenticated
    using (true);

-- Reviews/Reflections (Daily, Weekly, Monthly, Quarterly)
CREATE TABLE productivity.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    review_type VARCHAR(20) CHECK (review_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')) NOT NULL,
    review_date DATE NOT NULL,
    achievements TEXT,
    challenges TEXT,
    lessons_learned TEXT,
    gratitude TEXT,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    productivity_rating INTEGER CHECK (productivity_rating >= 1 AND productivity_rating <= 10),
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
    next_period_focus TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, review_type, review_date)
);

revoke all on table productivity.reviews from anon, authenticated, service_role;
grant select on table productivity.reviews to authenticated;

alter table productivity.reviews enable row level security;

create policy "Allow authenticated read access" on productivity.reviews
    for select
    to authenticated
    using (true);

-- Focus Sessions/Pomodoros
CREATE TABLE productivity.focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    task_id UUID REFERENCES productivity.tasks(id) ON DELETE SET NULL,
    session_type VARCHAR(20) CHECK (session_type IN ('pomodoro', 'deep_work', 'break', 'custom')) DEFAULT 'pomodoro',
    planned_duration INTEGER NOT NULL, -- in minutes
    actual_duration INTEGER, -- in minutes
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    interruptions INTEGER DEFAULT 0,
    productivity_rating INTEGER CHECK (productivity_rating >= 1 AND productivity_rating <= 5),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.focus_sessions from anon, authenticated, service_role;
grant select on table productivity.focus_sessions to authenticated;

alter table productivity.focus_sessions enable row level security;

create policy "Allow authenticated read access" on productivity.focus_sessions
    for select
    to authenticated
    using (true);

-- Indexes for better performance
CREATE INDEX idx_tasks_account_id ON productivity.tasks(account_id);
CREATE INDEX idx_tasks_project_id ON productivity.tasks(project_id);
CREATE INDEX idx_tasks_status ON productivity.tasks(status);
CREATE INDEX idx_tasks_due_date ON productivity.tasks(due_date);
CREATE INDEX idx_tasks_priority ON productivity.tasks(priority_id);
CREATE INDEX idx_habits_account_id ON productivity.habits(account_id);
CREATE INDEX idx_habit_logs_habit_date ON productivity.habit_logs(habit_id, log_date);
CREATE INDEX idx_goals_account_id ON productivity.goals(account_id);
CREATE INDEX idx_goals_status ON productivity.goals(status);
CREATE INDEX idx_calendar_events_account_id ON productivity.calendar_events(account_id);
CREATE INDEX idx_calendar_events_datetime ON productivity.calendar_events(start_datetime, end_datetime);
CREATE INDEX idx_time_blocks_user_date ON productivity.time_blocks(account_id, block_date);
CREATE INDEX idx_notes_account_id ON productivity.notes(account_id);
CREATE INDEX idx_notes_created_date ON productivity.notes(created_date);
CREATE INDEX idx_focus_sessions_account_id ON productivity.focus_sessions(account_id);

-- Insert default task priorities
INSERT INTO productivity.task_priorities (name, level, color) VALUES
('Low', 1, '#28a745'),
('Medium', 2, '#ffc107'),
('High', 3, '#fd7e14'),
('Critical', 4, '#dc3545');

-- Note: Default user not needed as we're using supasheet.accounts

-- Views for common queries

-- Active tasks view
CREATE VIEW productivity.active_tasks AS
SELECT 
    t.id,
    t.title,
    t.description,
    p.name as project_name,
    tp.name as priority,
    t.status,
    t.due_date,
    t.due_time,
    t.estimated_duration,
    t.context,
    t.energy_level,
    t.created_at
FROM productivity.tasks t
LEFT JOIN productivity.projects p ON t.project_id = p.id
LEFT JOIN productivity.task_priorities tp ON t.priority_id = tp.id
WHERE t.status NOT IN ('completed', 'cancelled')
ORDER BY tp.level DESC, t.due_date ASC;

-- Today's tasks view
CREATE VIEW productivity.todays_tasks AS
SELECT 
    t.id,
    t.title,
    t.description,
    p.name as project_name,
    tp.name as priority,
    t.status,
    t.due_date,
    t.due_time,
    t.context,
    t.energy_level
FROM productivity.tasks t
LEFT JOIN productivity.projects p ON t.project_id = p.id
LEFT JOIN productivity.task_priorities tp ON t.priority_id = tp.id
WHERE t.due_date = CURRENT_DATE
   OR (t.due_date IS NULL AND t.status = 'pending')
ORDER BY tp.level DESC, t.due_time ASC;

-- Active habits view
CREATE VIEW productivity.active_habits AS
SELECT 
    h.id,
    h.name,
    h.description,
    h.frequency_type,
    h.frequency_value,
    h.target_value,
    h.unit,
    h.streak_count,
    h.best_streak,
    h.reminder_time
FROM productivity.habits h
WHERE h.is_active = TRUE
  AND (h.end_date IS NULL OR h.end_date >= CURRENT_DATE)
ORDER BY h.reminder_time;

-- Goals progress view
CREATE VIEW productivity.goals_progress AS
SELECT 
    g.id,
    g.title,
    g.category,
    g.type,
    g.status,
    g.priority,
    g.target_value,
    g.current_value,
    g.unit,
    g.progress_percentage,
    g.target_date,
    CASE 
        WHEN g.target_date < CURRENT_DATE AND g.status NOT IN ('completed', 'cancelled') THEN 'overdue'
        WHEN g.target_date <= CURRENT_DATE + INTERVAL '7 days' AND g.status NOT IN ('completed', 'cancelled') THEN 'due_soon'
        ELSE 'on_track'
    END as timeline_status
FROM productivity.goals g
WHERE g.status NOT IN ('cancelled')
ORDER BY g.priority DESC, g.target_date ASC;

-- Weekly habit completion view
CREATE VIEW productivity.weekly_habit_completion AS
SELECT 
    h.id as habit_id,
    h.name as habit_name,
    DATE_TRUNC('week', hl.log_date) as week_start,
    COUNT(*) as days_logged,
    COUNT(CASE WHEN hl.completed THEN 1 END) as days_completed,
    ROUND(COUNT(CASE WHEN hl.completed THEN 1 END) * 100.0 / COUNT(*), 2) as completion_percentage
FROM productivity.habits h
LEFT JOIN productivity.habit_logs hl ON h.id = hl.habit_id
WHERE hl.log_date >= CURRENT_DATE - INTERVAL '4 weeks'
GROUP BY h.id, h.name, DATE_TRUNC('week', hl.log_date)
ORDER BY week_start DESC, h.name;

-- Functions

-- Function to update task completion
CREATE OR REPLACE FUNCTION productivity.complete_task(task_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE productivity.tasks 
    SET status = 'completed', 
        completion_date = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = task_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate habit streak
CREATE OR REPLACE FUNCTION productivity.update_habit_streak(habit_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    current_streak INTEGER := 0;
    log_date DATE;
    completed BOOLEAN;
BEGIN
    -- Get consecutive completed days from most recent
    FOR log_date, completed IN
        SELECT hl.log_date, hl.completed
        FROM productivity.habit_logs hl
        WHERE hl.habit_id = habit_uuid
        ORDER BY hl.log_date DESC
    LOOP
        IF completed THEN
            current_streak := current_streak + 1;
        ELSE
            EXIT;
        END IF;
    END LOOP;
    
    -- Update habit with current streak and best streak
    UPDATE productivity.habits 
    SET streak_count = current_streak,
        best_streak = GREATEST(best_streak, current_streak),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = habit_uuid;
    
    RETURN current_streak;
END;
$$ LANGUAGE plpgsql;

-- Function to get productivity stats for a date range
CREATE OR REPLACE FUNCTION productivity.get_productivity_stats(
    user_uuid UUID,
    start_date DATE,
    end_date DATE
)
RETURNS TABLE(
    total_tasks INTEGER,
    completed_tasks INTEGER,
    completion_rate DECIMAL,
    total_focus_time INTEGER,
    habits_tracked INTEGER,
    avg_mood DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(t.id)::INTEGER as total_tasks,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::INTEGER as completed_tasks,
        ROUND(
            COUNT(CASE WHEN t.status = 'completed' THEN 1 END) * 100.0 / 
            NULLIF(COUNT(t.id), 0), 2
        ) as completion_rate,
        COALESCE(SUM(fs.actual_duration), 0)::INTEGER as total_focus_time,
        COUNT(DISTINCT hl.habit_id)::INTEGER as habits_tracked,
        ROUND(AVG(hl.mood), 2) as avg_mood
    FROM productivity.tasks t
    LEFT JOIN productivity.focus_sessions fs ON t.id = fs.task_id 
        AND fs.start_time::DATE BETWEEN start_date AND end_date
    LEFT JOIN productivity.habit_logs hl ON hl.log_date BETWEEN start_date AND end_date
    WHERE t.account_id = user_uuid
      AND t.created_at::DATE BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- Triggers

-- Update timestamps
CREATE OR REPLACE FUNCTION productivity.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_tasks_timestamp BEFORE UPDATE ON productivity.tasks
    FOR EACH ROW EXECUTE FUNCTION productivity.update_timestamp();

CREATE TRIGGER update_habits_timestamp BEFORE UPDATE ON productivity.habits
    FOR EACH ROW EXECUTE FUNCTION productivity.update_timestamp();

CREATE TRIGGER update_goals_timestamp BEFORE UPDATE ON productivity.goals
    FOR EACH ROW EXECUTE FUNCTION productivity.update_timestamp();

CREATE TRIGGER update_projects_timestamp BEFORE UPDATE ON productivity.projects
    FOR EACH ROW EXECUTE FUNCTION productivity.update_timestamp();

-- Sample data (uncomment to insert)
/*
-- Get default user ID
DO $$
DECLARE
    default_account_id UUID;
BEGIN
    -- Use an existing account from supasheet.accounts
    SELECT id INTO default_account_id FROM supasheet.accounts LIMIT 1;
    
    -- Insert sample project
    INSERT INTO productivity.projects (account_id, name, description, color) VALUES
    (default_account_id, 'Personal Development', 'Self-improvement goals and tasks', '#4A90E2');
    
    -- Insert sample tasks
    INSERT INTO productivity.tasks (account_id, title, description, priority_id, due_date) VALUES
    (default_account_id, 'Read 30 minutes daily', 'Daily reading habit for personal growth', 2, CURRENT_DATE),
    (default_account_id, 'Plan weekly goals', 'Review and set goals for the upcoming week', 3, CURRENT_DATE + 1),
    (default_account_id, 'Exercise routine', 'Complete morning workout', 2, CURRENT_DATE);
    
    -- Insert sample habits
    INSERT INTO productivity.habits (account_id, name, description, frequency_type, target_value, unit) VALUES
    (default_account_id, 'Drink Water', 'Stay hydrated throughout the day', 'daily', 8, 'glasses'),
    (default_account_id, 'Meditation', 'Daily mindfulness practice', 'daily', 10, 'minutes'),
    (default_account_id, 'Exercise', 'Physical activity', 'daily', 30, 'minutes');
    
    -- Insert sample goal
    INSERT INTO productivity.goals (account_id, title, description, type, target_value, unit, target_date) VALUES
    (default_account_id, 'Read 24 Books This Year', 'Complete reading challenge', 'outcome', 24, 'books', DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day');
END $$;
*/