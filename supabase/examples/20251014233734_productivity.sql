-- Personal Productivity Database Schema
-- PostgreSQL implementation for Todo Lists, Habits, Goals, and Planning

-- Create database (uncomment if needed)
-- CREATE DATABASE personal_productivity;

-- Use the database
-- \c personal_productivity;
create schema if not exists productivity;

grant usage on schema productivity to authenticated;

begin;
-- Define enum types for productivity schema
create type productivity.task_status as enum ('pending', 'in_progress', 'completed', 'cancelled', 'waiting');
create type productivity.energy_level as enum ('low', 'medium', 'high');
create type productivity.dependency_type as enum ('finish_to_start', 'start_to_start', 'finish_to_finish');
create type productivity.habit_frequency_type as enum ('daily', 'weekly', 'monthly', 'custom');
create type productivity.goal_type as enum ('outcome', 'process', 'learning');
create type productivity.goal_status as enum ('not_started', 'in_progress', 'completed', 'on_hold', 'cancelled');
create type productivity.goal_priority as enum ('low', 'medium', 'high', 'critical');
create type productivity.event_status as enum ('tentative', 'confirmed', 'cancelled');
create type productivity.review_type as enum ('daily', 'weekly', 'monthly', 'quarterly', 'yearly');
create type productivity.focus_session_type as enum ('pomodoro', 'deep_work', 'break', 'custom');

alter type supasheet.app_permission add value 'productivity.projects:select';
alter type supasheet.app_permission add value 'productivity.projects:insert';
alter type supasheet.app_permission add value 'productivity.projects:update';
alter type supasheet.app_permission add value 'productivity.projects:delete';

alter type supasheet.app_permission add value 'productivity.task_priorities:select';
alter type supasheet.app_permission add value 'productivity.task_priorities:insert';
alter type supasheet.app_permission add value 'productivity.task_priorities:update';
alter type supasheet.app_permission add value 'productivity.task_priorities:delete';

alter type supasheet.app_permission add value 'productivity.tasks:select';
alter type supasheet.app_permission add value 'productivity.tasks:insert';
alter type supasheet.app_permission add value 'productivity.tasks:update';
alter type supasheet.app_permission add value 'productivity.tasks:delete';

alter type supasheet.app_permission add value 'productivity.task_dependencies:select';
alter type supasheet.app_permission add value 'productivity.task_dependencies:insert';
alter type supasheet.app_permission add value 'productivity.task_dependencies:update';
alter type supasheet.app_permission add value 'productivity.task_dependencies:delete';

alter type supasheet.app_permission add value 'productivity.habits:select';
alter type supasheet.app_permission add value 'productivity.habits:insert';
alter type supasheet.app_permission add value 'productivity.habits:update';
alter type supasheet.app_permission add value 'productivity.habits:delete';

alter type supasheet.app_permission add value 'productivity.habit_logs:select';
alter type supasheet.app_permission add value 'productivity.habit_logs:insert';
alter type supasheet.app_permission add value 'productivity.habit_logs:update';
alter type supasheet.app_permission add value 'productivity.habit_logs:delete';

alter type supasheet.app_permission add value 'productivity.goals:select';
alter type supasheet.app_permission add value 'productivity.goals:insert';
alter type supasheet.app_permission add value 'productivity.goals:update';
alter type supasheet.app_permission add value 'productivity.goals:delete';

alter type supasheet.app_permission add value 'productivity.goal_milestones:select';
alter type supasheet.app_permission add value 'productivity.goal_milestones:insert';
alter type supasheet.app_permission add value 'productivity.goal_milestones:update';
alter type supasheet.app_permission add value 'productivity.goal_milestones:delete';

alter type supasheet.app_permission add value 'productivity.calendar_events:select';
alter type supasheet.app_permission add value 'productivity.calendar_events:insert';
alter type supasheet.app_permission add value 'productivity.calendar_events:update';
alter type supasheet.app_permission add value 'productivity.calendar_events:delete';

alter type supasheet.app_permission add value 'productivity.time_blocks:select';
alter type supasheet.app_permission add value 'productivity.time_blocks:insert';
alter type supasheet.app_permission add value 'productivity.time_blocks:update';
alter type supasheet.app_permission add value 'productivity.time_blocks:delete';

alter type supasheet.app_permission add value 'productivity.notes:select';
alter type supasheet.app_permission add value 'productivity.notes:insert';
alter type supasheet.app_permission add value 'productivity.notes:update';
alter type supasheet.app_permission add value 'productivity.notes:delete';

alter type supasheet.app_permission add value 'productivity.reviews:select';
alter type supasheet.app_permission add value 'productivity.reviews:insert';
alter type supasheet.app_permission add value 'productivity.reviews:update';
alter type supasheet.app_permission add value 'productivity.reviews:delete';

alter type supasheet.app_permission add value 'productivity.focus_sessions:select';
alter type supasheet.app_permission add value 'productivity.focus_sessions:insert';
alter type supasheet.app_permission add value 'productivity.focus_sessions:update';
alter type supasheet.app_permission add value 'productivity.focus_sessions:delete';

alter type supasheet.app_permission add value 'productivity.active_tasks:select';

alter type supasheet.app_permission add value 'productivity.todays_tasks:select';

alter type supasheet.app_permission add value 'productivity.active_habits:select';

alter type supasheet.app_permission add value 'productivity.goals_progress:select';

alter type supasheet.app_permission add value 'productivity.weekly_habit_completion:select';

-- Report views
alter type supasheet.app_permission add value 'productivity.productivity_report:select';
alter type supasheet.app_permission add value 'productivity.task_report:select';

-- Dashboard widget views (Card types)
alter type supasheet.app_permission add value 'productivity.active_task_count:select';
alter type supasheet.app_permission add value 'productivity.task_completion_split:select';
alter type supasheet.app_permission add value 'productivity.habit_streak:select';
alter type supasheet.app_permission add value 'productivity.goal_progress_summary:select';

-- Dashboard widget views (Table types)
alter type supasheet.app_permission add value 'productivity.urgent_tasks_simple:select';
alter type supasheet.app_permission add value 'productivity.today_schedule_simple:select';
alter type supasheet.app_permission add value 'productivity.task_overview_detailed:select';
alter type supasheet.app_permission add value 'productivity.habit_tracker_detailed:select';

-- Chart views
alter type supasheet.app_permission add value 'productivity.task_trend_area:select';
alter type supasheet.app_permission add value 'productivity.priority_distribution_bar:select';
alter type supasheet.app_permission add value 'productivity.completion_rate_line:select';
alter type supasheet.app_permission add value 'productivity.project_distribution_pie:select';
alter type supasheet.app_permission add value 'productivity.productivity_metrics_radar:select';

commit;

-- Projects/Areas Table
CREATE TABLE productivity.projects (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table productivity.projects to authenticated;

alter table productivity.projects enable row level security;

create policy projects_select on productivity.projects
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.projects:select'));

create policy projects_insert on productivity.projects
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.projects:insert'));

create policy projects_update on productivity.projects
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.projects:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.projects:update'));

create policy projects_delete on productivity.projects
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.projects:delete'));

-- Task Priority Levels
CREATE TABLE productivity.task_priorities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    level INTEGER NOT NULL UNIQUE,
    color VARCHAR(7)
);

revoke all on table productivity.task_priorities from anon, authenticated, service_role;
grant select, insert, update, delete on table productivity.task_priorities to authenticated;

alter table productivity.task_priorities enable row level security;

create policy task_priorities_select on productivity.task_priorities
    for select
    to authenticated
    using (supasheet.has_permission('productivity.task_priorities:select'));

create policy task_priorities_insert on productivity.task_priorities
    for insert
    to authenticated
    with check (supasheet.has_permission('productivity.task_priorities:insert'));

create policy task_priorities_update on productivity.task_priorities
    for update
    to authenticated
    using (supasheet.has_permission('productivity.task_priorities:update'))
    with check (supasheet.has_permission('productivity.task_priorities:update'));

create policy task_priorities_delete on productivity.task_priorities
    for delete
    to authenticated
    using (supasheet.has_permission('productivity.task_priorities:delete'));

-- Tasks/Todo Items Table
CREATE TABLE productivity.tasks (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    project_id UUID REFERENCES productivity.projects(id) ON DELETE SET NULL,
    parent_task_id UUID REFERENCES productivity.tasks(id) ON DELETE CASCADE, -- For subtasks
    title VARCHAR(500) NOT NULL,
    description TEXT,
    priority_id INTEGER REFERENCES productivity.task_priorities(id) DEFAULT 2,
    status productivity.task_status DEFAULT 'pending',
    due_date DATE,
    due_time TIME,
    estimated_duration INTEGER, -- in minutes
    actual_duration INTEGER, -- in minutes
    completion_date TIMESTAMP,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_pattern JSONB, -- Store recurring rules as JSON
    tags TEXT[], -- Array of tags
    energy_level productivity.energy_level,
    context VARCHAR(100), -- @home, @work, @computer, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.tasks from anon, authenticated, service_role;
grant select, insert, update, delete on table productivity.tasks to authenticated;

alter table productivity.tasks enable row level security;

create policy tasks_select on productivity.tasks
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.tasks:select'));

create policy tasks_insert on productivity.tasks
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.tasks:insert'));

create policy tasks_update on productivity.tasks
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.tasks:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.tasks:update'));

create policy tasks_delete on productivity.tasks
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.tasks:delete'));

-- Task Dependencies
CREATE TABLE productivity.task_dependencies (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    task_id UUID REFERENCES productivity.tasks(id) ON DELETE CASCADE,
    depends_on_task_id UUID REFERENCES productivity.tasks(id) ON DELETE CASCADE,
    dependency_type productivity.dependency_type DEFAULT 'finish_to_start',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, depends_on_task_id)
);

revoke all on table productivity.task_dependencies from anon, authenticated, service_role;
grant select, insert, update, delete on table productivity.task_dependencies to authenticated;

alter table productivity.task_dependencies enable row level security;

create policy task_dependencies_select on productivity.task_dependencies
    for select
    to authenticated
    using (
        exists (
            select 1 from productivity.tasks t
            where t.id = task_dependencies.task_id
            and t.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.task_dependencies:select')
    );

create policy task_dependencies_insert on productivity.task_dependencies
    for insert
    to authenticated
    with check (
        exists (
            select 1 from productivity.tasks t
            where t.id = task_dependencies.task_id
            and t.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.task_dependencies:insert')
    );

create policy task_dependencies_update on productivity.task_dependencies
    for update
    to authenticated
    using (
        exists (
            select 1 from productivity.tasks t
            where t.id = task_dependencies.task_id
            and t.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.task_dependencies:update')
    )
    with check (
        exists (
            select 1 from productivity.tasks t
            where t.id = task_dependencies.task_id
            and t.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.task_dependencies:update')
    );

create policy task_dependencies_delete on productivity.task_dependencies
    for delete
    to authenticated
    using (
        exists (
            select 1 from productivity.tasks t
            where t.id = task_dependencies.task_id
            and t.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.task_dependencies:delete')
    );

-- Habits Table
CREATE TABLE productivity.habits (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    frequency_type productivity.habit_frequency_type DEFAULT 'daily',
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
grant select, insert, update, delete on table productivity.habits to authenticated;

alter table productivity.habits enable row level security;

create policy habits_select on productivity.habits
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.habits:select'));

create policy habits_insert on productivity.habits
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.habits:insert'));

create policy habits_update on productivity.habits
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.habits:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.habits:update'));

create policy habits_delete on productivity.habits
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.habits:delete'));

-- Habit Tracking/Logs
CREATE TABLE productivity.habit_logs (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table productivity.habit_logs to authenticated;

alter table productivity.habit_logs enable row level security;

create policy habit_logs_select on productivity.habit_logs
    for select
    to authenticated
    using (
        exists (
            select 1 from productivity.habits h
            where h.id = habit_logs.habit_id
            and h.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.habit_logs:select')
    );

create policy habit_logs_insert on productivity.habit_logs
    for insert
    to authenticated
    with check (
        exists (
            select 1 from productivity.habits h
            where h.id = habit_logs.habit_id
            and h.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.habit_logs:insert')
    );

create policy habit_logs_update on productivity.habit_logs
    for update
    to authenticated
    using (
        exists (
            select 1 from productivity.habits h
            where h.id = habit_logs.habit_id
            and h.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.habit_logs:update')
    )
    with check (
        exists (
            select 1 from productivity.habits h
            where h.id = habit_logs.habit_id
            and h.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.habit_logs:update')
    );

create policy habit_logs_delete on productivity.habit_logs
    for delete
    to authenticated
    using (
        exists (
            select 1 from productivity.habits h
            where h.id = habit_logs.habit_id
            and h.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.habit_logs:delete')
    );

-- Goals Table
CREATE TABLE productivity.goals (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    type productivity.goal_type DEFAULT 'outcome',
    status productivity.goal_status DEFAULT 'not_started',
    priority productivity.goal_priority DEFAULT 'medium',
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
grant select, insert, update, delete on table productivity.goals to authenticated;

alter table productivity.goals enable row level security;

create policy goals_select on productivity.goals
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.goals:select'));

create policy goals_insert on productivity.goals
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.goals:insert'));

create policy goals_update on productivity.goals
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.goals:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.goals:update'));

create policy goals_delete on productivity.goals
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.goals:delete'));

-- Goal Milestones
CREATE TABLE productivity.goal_milestones (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table productivity.goal_milestones to authenticated;

alter table productivity.goal_milestones enable row level security;

create policy goal_milestones_select on productivity.goal_milestones
    for select
    to authenticated
    using (
        exists (
            select 1 from productivity.goals g
            where g.id = goal_milestones.goal_id
            and g.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.goal_milestones:select')
    );

create policy goal_milestones_insert on productivity.goal_milestones
    for insert
    to authenticated
    with check (
        exists (
            select 1 from productivity.goals g
            where g.id = goal_milestones.goal_id
            and g.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.goal_milestones:insert')
    );

create policy goal_milestones_update on productivity.goal_milestones
    for update
    to authenticated
    using (
        exists (
            select 1 from productivity.goals g
            where g.id = goal_milestones.goal_id
            and g.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.goal_milestones:update')
    )
    with check (
        exists (
            select 1 from productivity.goals g
            where g.id = goal_milestones.goal_id
            and g.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.goal_milestones:update')
    );

create policy goal_milestones_delete on productivity.goal_milestones
    for delete
    to authenticated
    using (
        exists (
            select 1 from productivity.goals g
            where g.id = goal_milestones.goal_id
            and g.account_id = auth.uid()
        )
        and supasheet.has_permission('productivity.goal_milestones:delete')
    );

-- Calendar Events/Appointments
CREATE TABLE productivity.calendar_events (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
    status productivity.event_status DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.calendar_events from anon, authenticated, service_role;
grant select, insert, update, delete on table productivity.calendar_events to authenticated;

alter table productivity.calendar_events enable row level security;

create policy calendar_events_select on productivity.calendar_events
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.calendar_events:select'));

create policy calendar_events_insert on productivity.calendar_events
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.calendar_events:insert'));

create policy calendar_events_update on productivity.calendar_events
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.calendar_events:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.calendar_events:update'));

create policy calendar_events_delete on productivity.calendar_events
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.calendar_events:delete'));

-- Time Blocks/Time Blocking
CREATE TABLE productivity.time_blocks (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
    energy_required productivity.energy_level,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table productivity.time_blocks from anon, authenticated, service_role;
grant select, insert, update, delete on table productivity.time_blocks to authenticated;

alter table productivity.time_blocks enable row level security;

create policy time_blocks_select on productivity.time_blocks
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.time_blocks:select'));

create policy time_blocks_insert on productivity.time_blocks
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.time_blocks:insert'));

create policy time_blocks_update on productivity.time_blocks
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.time_blocks:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.time_blocks:update'));

create policy time_blocks_delete on productivity.time_blocks
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.time_blocks:delete'));

-- Notes/Journal Entries
CREATE TABLE productivity.notes (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
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
grant select, insert, update, delete on table productivity.notes to authenticated;

alter table productivity.notes enable row level security;

create policy notes_select on productivity.notes
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.notes:select'));

create policy notes_insert on productivity.notes
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.notes:insert'));

create policy notes_update on productivity.notes
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.notes:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.notes:update'));

create policy notes_delete on productivity.notes
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.notes:delete'));

-- Reviews/Reflections (Daily, Weekly, Monthly, Quarterly)
CREATE TABLE productivity.reviews (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    review_type productivity.review_type NOT NULL,
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
grant select, insert, update, delete on table productivity.reviews to authenticated;

alter table productivity.reviews enable row level security;

create policy reviews_select on productivity.reviews
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.reviews:select'));

create policy reviews_insert on productivity.reviews
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.reviews:insert'));

create policy reviews_update on productivity.reviews
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.reviews:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.reviews:update'));

create policy reviews_delete on productivity.reviews
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.reviews:delete'));

-- Focus Sessions/Pomodoros
CREATE TABLE productivity.focus_sessions (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    task_id UUID REFERENCES productivity.tasks(id) ON DELETE SET NULL,
    session_type productivity.focus_session_type DEFAULT 'pomodoro',
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
grant select, insert, update, delete on table productivity.focus_sessions to authenticated;

alter table productivity.focus_sessions enable row level security;

create policy focus_sessions_select on productivity.focus_sessions
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.focus_sessions:select'));

create policy focus_sessions_insert on productivity.focus_sessions
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.focus_sessions:insert'));

create policy focus_sessions_update on productivity.focus_sessions
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.focus_sessions:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('productivity.focus_sessions:update'));

create policy focus_sessions_delete on productivity.focus_sessions
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('productivity.focus_sessions:delete'));

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

-- Table Metadata Comments

comment on table productivity.projects is
'{
    "icon": "Folder",
    "display": "block",
    "query": {
        "sort": [{"id":"created_at","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"status","name":"Projects By Status","type":"kanban","group":"is_active","title":"name","description":"description","date":"start_date","badge":"color"}
    ]
}';

comment on table productivity.tasks is
'{
    "icon": "CheckSquare",
    "display": "block",
    "query": {
        "sort": [{"id":"due_date","desc":false}],
        "filter": [],
        "join": [
            {"table":"projects","on":"project_id","columns":["name","color"]},
            {"table":"task_priorities","on":"priority_id","columns":["name","level","color"]}
        ]
    },
    "items": [
        {"id":"status","name":"Tasks By Status","type":"kanban","group":"status","title":"title","description":"description","date":"due_date","badge":"priority_id"},
        {"id":"priority","name":"Tasks By Priority","type":"kanban","group":"priority_id","title":"title","description":"description","date":"due_date","badge":"status"},
        {"id":"project","name":"Tasks By Project","type":"kanban","group":"project_id","title":"title","description":"description","date":"due_date","badge":"status"},
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"title","startDate":"due_date","endDate":"due_date","badge":"status"}
    ]
}';

comment on table productivity.habits is
'{
    "icon": "Repeat",
    "display": "block",
    "query": {
        "sort": [{"id":"created_at","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"frequency","name":"Habits By Frequency","type":"kanban","group":"frequency_type","title":"name","description":"description","date":"start_date","badge":"streak_count"},
        {"id":"active","name":"Active Habits","type":"kanban","group":"is_active","title":"name","description":"description","date":"start_date","badge":"streak_count"}
    ]
}';

comment on table productivity.goals is
'{
    "icon": "Target",
    "display": "block",
    "query": {
        "sort": [{"id":"target_date","desc":false}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"status","name":"Goals By Status","type":"kanban","group":"status","title":"title","description":"description","date":"target_date","badge":"progress_percentage"},
        {"id":"priority","name":"Goals By Priority","type":"kanban","group":"priority","title":"title","description":"description","date":"target_date","badge":"status"},
        {"id":"type","name":"Goals By Type","type":"kanban","group":"type","title":"title","description":"description","date":"target_date","badge":"status"}
    ]
}';

comment on table productivity.calendar_events is
'{
    "icon": "Calendar",
    "display": "block",
    "query": {
        "sort": [{"id":"start_datetime","desc":false}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"title","startDate":"start_datetime","endDate":"end_datetime","badge":"event_type"},
        {"id":"type","name":"Events By Type","type":"kanban","group":"event_type","title":"title","description":"description","date":"start_datetime","badge":"status"}
    ]
}';

comment on table productivity.time_blocks is
'{
    "icon": "Clock",
    "display": "block",
    "query": {
        "sort": [{"id":"block_date","desc":false},{"id":"start_time","desc":false}],
        "filter": [],
        "join": [
            {"table":"tasks","on":"task_id","columns":["title","status"]},
            {"table":"goals","on":"goal_id","columns":["title","status"]}
        ]
    },
    "items": [
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"title","startDate":"block_date","endDate":"block_date","badge":"activity_type"},
        {"id":"activity","name":"Blocks By Activity","type":"kanban","group":"activity_type","title":"title","description":"description","date":"block_date","badge":"energy_required"}
    ]
}';

comment on table productivity.notes is
'{
    "icon": "FileText",
    "display": "block",
    "query": {
        "sort": [{"id":"created_date","desc":true}],
        "filter": [],
        "join": [
            {"table":"tasks","on":"task_id","columns":["title"]},
            {"table":"goals","on":"goal_id","columns":["title"]}
        ]
    },
    "items": [
        {"id":"type","name":"Notes By Type","type":"kanban","group":"note_type","title":"title","description":"content","date":"created_date","badge":"mood"},
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"title","startDate":"created_date","endDate":"created_date","badge":"note_type"}
    ]
}';

comment on table productivity.reviews is
'{
    "icon": "Star",
    "display": "block",
    "query": {
        "sort": [{"id":"review_date","desc":true}],
        "filter": [],
        "join": []
    },
    "items": [
        {"id":"type","name":"Reviews By Type","type":"kanban","group":"review_type","title":"review_date","description":"achievements","date":"review_date","badge":"productivity_rating"},
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"review_type","startDate":"review_date","endDate":"review_date","badge":"productivity_rating"}
    ]
}';

comment on table productivity.focus_sessions is
'{
    "icon": "Zap",
    "display": "block",
    "query": {
        "sort": [{"id":"start_time","desc":true}],
        "filter": [],
        "join": [
            {"table":"tasks","on":"task_id","columns":["title","status"]}
        ]
    },
    "items": [
        {"id":"type","name":"Sessions By Type","type":"kanban","group":"session_type","title":"start_time","description":"notes","date":"start_time","badge":"productivity_rating"},
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"session_type","startDate":"start_time","endDate":"end_time","badge":"completed"}
    ]
}';

-- Insert default task priorities
INSERT INTO productivity.task_priorities (name, level, color) VALUES
('Low', 1, '#28a745'),
('Medium', 2, '#ffc107'),
('High', 3, '#fd7e14'),
('Critical', 4, '#dc3545');

-- Note: Default user not needed as we're using supasheet.accounts

-- Views for common queries

-- Active tasks view
create or replace view productivity.active_tasks
with (security_invoker = true) as
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

revoke all on productivity.active_tasks from anon, authenticated, service_role;
grant select on productivity.active_tasks to authenticated;

-- Today's tasks view
create or replace view productivity.todays_tasks
with (security_invoker = true) as
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

revoke all on productivity.todays_tasks from anon, authenticated, service_role;
grant select on productivity.todays_tasks to authenticated;

-- Active habits view
create or replace view productivity.active_habits
with (security_invoker = true) as
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

revoke all on productivity.active_habits from anon, authenticated, service_role;
grant select on productivity.active_habits to authenticated;

-- Goals progress view
create or replace view productivity.goals_progress
with (security_invoker = true) as
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

revoke all on productivity.goals_progress from anon, authenticated, service_role;
grant select on productivity.goals_progress to authenticated;

-- Weekly habit completion view
create or replace view productivity.weekly_habit_completion
with (security_invoker = true) as
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

revoke all on productivity.weekly_habit_completion from anon, authenticated, service_role;
grant select on productivity.weekly_habit_completion to authenticated;

-- Report Views

-- Productivity Report
create or replace view productivity.productivity_report
with (security_invoker = true) as
select
    a.name as account_name,
    t.title as task_title,
    t.description,
    p.name as project_name,
    tp.name as priority,
    t.status,
    t.due_date,
    t.completion_date,
    t.estimated_duration,
    t.actual_duration,
    t.energy_level,
    t.context,
    t.created_at
from productivity.tasks t
join supasheet.accounts a on t.account_id = a.id
left join productivity.projects p on t.project_id = p.id
left join productivity.task_priorities tp on t.priority_id = tp.id
order by t.created_at desc;

revoke all on productivity.productivity_report from anon, authenticated, service_role;
grant select on productivity.productivity_report to authenticated;

comment on view productivity.productivity_report is '{"type": "report", "name": "Productivity Report", "description": "Comprehensive task report with project, priority, and completion details"}';

-- Task Report
create or replace view productivity.task_report
with (security_invoker = true) as
select
    t.title,
    p.name as project,
    tp.name as priority,
    t.status,
    t.due_date,
    t.completion_date,
    case
        when t.status = 'completed' and t.completion_date <= t.due_date then 'On Time'
        when t.status = 'completed' and t.completion_date > t.due_date then 'Late'
        when t.status != 'completed' and t.due_date < current_date then 'Overdue'
        else 'Pending'
    end as completion_status,
    t.estimated_duration,
    t.actual_duration,
    case
        when t.actual_duration is not null and t.estimated_duration is not null
        then t.actual_duration - t.estimated_duration
        else null
    end as duration_variance
from productivity.tasks t
left join productivity.projects p on t.project_id = p.id
left join productivity.task_priorities tp on t.priority_id = tp.id
order by t.due_date desc nulls last;

revoke all on productivity.task_report from anon, authenticated, service_role;
grant select on productivity.task_report to authenticated;

comment on view productivity.task_report is '{"type": "report", "name": "Task Report", "description": "Detailed task analysis with completion status and duration tracking"}';

-- Dashboard Card Widgets

-- Card 1: Active Task Count
create or replace view productivity.active_task_count
with (security_invoker = true) as
select
    count(*)::integer as value,
    'check-square' as icon,
    'Active Tasks' as label
from productivity.tasks
where status not in ('completed', 'cancelled');

revoke all on productivity.active_task_count from anon, authenticated, service_role;
grant select on productivity.active_task_count to authenticated;

comment on view productivity.active_task_count is '{"type": "dashboard_widget", "name": "Active Task Count", "description": "Total number of active tasks (count)", "widget_type": "card_1"}';

-- Card 2: Task Completion Split
create or replace view productivity.task_completion_split
with (security_invoker = true) as
select
    count(*) filter (where status = 'completed' and completion_date >= date_trunc('week', current_date))::integer as primary,
    count(*) filter (where status not in ('completed', 'cancelled'))::integer as secondary,
    'Completed' as primary_label,
    'Active Tasks' as secondary_label
from productivity.tasks;

revoke all on productivity.task_completion_split from anon, authenticated, service_role;
grant select on productivity.task_completion_split to authenticated;

comment on view productivity.task_completion_split is '{"type": "dashboard_widget", "name": "Task Completion Split", "description": "Comparison of completed vs active tasks", "widget_type": "card_2"}';

-- Card 3: Habit Streak
create or replace view productivity.habit_streak
with (security_invoker = true) as
select
    coalesce(max(streak_count), 0)::integer as value,
    round(
        (count(*) filter (where streak_count > 0)::numeric / nullif(count(*), 0)) * 100,
        1
    ) as percent
from productivity.habits
where is_active = true;

revoke all on productivity.habit_streak from anon, authenticated, service_role;
grant select on productivity.habit_streak to authenticated;

comment on view productivity.habit_streak is '{"type": "dashboard_widget", "name": "Habit Streak", "description": "Best habit streak with active habit success rate", "widget_type": "card_3"}';

-- Card 4: Goal Progress Summary
create or replace view productivity.goal_progress_summary
with (security_invoker = true) as
select
    count(*) filter (where status = 'in_progress')::integer as current,
    count(*)::integer as total,
    jsonb_agg(
        jsonb_build_object(
            'label', case
                when status = 'completed' then 'Completed'
                when status = 'in_progress' then 'In Progress'
                when status = 'not_started' then 'Not Started'
                else 'Other'
            end,
            'value', count,
            'color', case
                when status = 'completed' then '#10b981'
                when status = 'in_progress' then '#3b82f6'
                when status = 'not_started' then '#6b7280'
                else '#ef4444'
            end
        )
    ) as segments
from (
    select status, count(*)::integer
    from productivity.goals
    where status not in ('cancelled')
    group by status
) as goal_counts;

revoke all on productivity.goal_progress_summary from anon, authenticated, service_role;
grant select on productivity.goal_progress_summary to authenticated;

comment on view productivity.goal_progress_summary is '{"type": "dashboard_widget", "name": "Goal Progress Summary", "description": "Breakdown of goals by status", "widget_type": "card_4"}';

-- Dashboard Table Widgets

-- Table 1: Urgent Tasks (Simple)
create or replace view productivity.urgent_tasks_simple
with (security_invoker = true) as
select
    substring(title, 1, 40) || case when length(title) > 40 then '...' else '' end as task,
    tp.name as priority,
    to_char(due_date, 'MM/DD') as due
from productivity.tasks t
left join productivity.task_priorities tp on t.priority_id = tp.id
where status not in ('completed', 'cancelled')
  and (due_date <= current_date + interval '3 days' or tp.level >= 3)
order by tp.level desc, due_date asc nulls last
limit 10;

revoke all on productivity.urgent_tasks_simple from anon, authenticated, service_role;
grant select on productivity.urgent_tasks_simple to authenticated;

comment on view productivity.urgent_tasks_simple is '{"type": "dashboard_widget", "name": "Urgent Tasks", "description": "High priority and upcoming tasks", "widget_type": "table_1"}';

-- Table 2: Today Schedule (Simple)
create or replace view productivity.today_schedule_simple
with (security_invoker = true) as
select
    to_char(start_datetime, 'HH24:MI') as time,
    substring(title, 1, 35) || case when length(title) > 35 then '...' else '' end as event,
    event_type as type
from productivity.calendar_events
where start_datetime::date = current_date
  and status = 'confirmed'
order by start_datetime
limit 10;

revoke all on productivity.today_schedule_simple from anon, authenticated, service_role;
grant select on productivity.today_schedule_simple to authenticated;

comment on view productivity.today_schedule_simple is '{"type": "dashboard_widget", "name": "Today Schedule", "description": "Calendar events for today", "widget_type": "table_1"}';

-- Table 3: Task Overview (Detailed)
create or replace view productivity.task_overview_detailed
with (security_invoker = true) as
select
    t.title,
    p.name as project,
    tp.name as priority,
    t.status,
    t.due_date,
    case
        when t.due_date < current_date and t.status not in ('completed', 'cancelled') then 'Overdue'
        when t.due_date = current_date then 'Due Today'
        when t.due_date <= current_date + interval '3 days' then 'Due Soon'
        else 'On Track'
    end as timeline
from productivity.tasks t
left join productivity.projects p on t.project_id = p.id
left join productivity.task_priorities tp on t.priority_id = tp.id
where t.status not in ('completed', 'cancelled')
order by tp.level desc, t.due_date asc nulls last
limit 15;

revoke all on productivity.task_overview_detailed from anon, authenticated, service_role;
grant select on productivity.task_overview_detailed to authenticated;

comment on view productivity.task_overview_detailed is '{"type": "dashboard_widget", "name": "Task Overview", "description": "Detailed view of active tasks with status", "widget_type": "table_2"}';

-- Table 4: Habit Tracker (Detailed)
create or replace view productivity.habit_tracker_detailed
with (security_invoker = true) as
select
    h.name as habit,
    h.frequency_type as frequency,
    h.target_value::text || coalesce(' ' || h.unit, '') as target,
    h.streak_count as streak,
    h.best_streak as best,
    case
        when h.streak_count >= 21 then 'Excellent'
        when h.streak_count >= 7 then 'Good'
        when h.streak_count > 0 then 'Building'
        else 'Start'
    end as status
from productivity.habits h
where h.is_active = true
  and (h.end_date is null or h.end_date >= current_date)
order by h.streak_count desc, h.name
limit 15;

revoke all on productivity.habit_tracker_detailed from anon, authenticated, service_role;
grant select on productivity.habit_tracker_detailed to authenticated;

comment on view productivity.habit_tracker_detailed is '{"type": "dashboard_widget", "name": "Habit Tracker", "description": "Active habits with streak information", "widget_type": "table_2"}';

-- Chart Views

-- Area Chart: Task Trend (Last 30 Days)
create or replace view productivity.task_trend_area
with (security_invoker = true) as
select
    to_char(date_trunc('day', created_at), 'Mon DD') as date,
    count(*) filter (where status = 'completed')::integer as completed,
    count(*) filter (where status in ('pending', 'in_progress'))::integer as active,
    count(*)::integer as total
from productivity.tasks
where created_at >= current_date - interval '30 days'
group by date_trunc('day', created_at)
order by date_trunc('day', created_at);

revoke all on productivity.task_trend_area from anon, authenticated, service_role;
grant select on productivity.task_trend_area to authenticated;

comment on view productivity.task_trend_area is '{"type": "chart", "name": "Task Trend", "description": "Task creation and completion trends over last 30 days", "chart_type": "area"}';

-- Bar Chart: Priority Distribution
create or replace view productivity.priority_distribution_bar
with (security_invoker = true) as
select
    tp.name as priority,
    count(*)::integer as count,
    tp.color
from productivity.tasks t
join productivity.task_priorities tp on t.priority_id = tp.id
where t.status not in ('completed', 'cancelled')
group by tp.name, tp.level, tp.color
order by tp.level desc;

revoke all on productivity.priority_distribution_bar from anon, authenticated, service_role;
grant select on productivity.priority_distribution_bar to authenticated;

comment on view productivity.priority_distribution_bar is '{"type": "chart", "name": "Priority Distribution", "description": "Active tasks grouped by priority level", "chart_type": "bar"}';

-- Line Chart: Completion Rate (Last 12 Weeks)
create or replace view productivity.completion_rate_line
with (security_invoker = true) as
select
    to_char(date_trunc('week', created_at), 'Mon DD') as week,
    round(
        (count(*) filter (where status = 'completed')::numeric / nullif(count(*), 0)) * 100,
        1
    ) as completion_rate
from productivity.tasks
where created_at >= current_date - interval '12 weeks'
group by date_trunc('week', created_at)
order by date_trunc('week', created_at);

revoke all on productivity.completion_rate_line from anon, authenticated, service_role;
grant select on productivity.completion_rate_line to authenticated;

comment on view productivity.completion_rate_line is '{"type": "chart", "name": "Completion Rate Trend", "description": "Weekly task completion rate over last 12 weeks", "chart_type": "line"}';

-- Pie Chart: Project Distribution
create or replace view productivity.project_distribution_pie
with (security_invoker = true) as
select
    coalesce(p.name, 'No Project') as project,
    count(*)::integer as count,
    coalesce(p.color, '#6b7280') as color
from productivity.tasks t
left join productivity.projects p on t.project_id = p.id
where t.status not in ('completed', 'cancelled')
group by p.name, p.color
order by count desc;

revoke all on productivity.project_distribution_pie from anon, authenticated, service_role;
grant select on productivity.project_distribution_pie to authenticated;

comment on view productivity.project_distribution_pie is '{"type": "chart", "name": "Project Distribution", "description": "Active tasks grouped by project", "chart_type": "pie"}';

-- Radar Chart: Productivity Metrics
create or replace view productivity.productivity_metrics_radar
with (security_invoker = true) as
select
    jsonb_build_object(
        'Task Completion', (
            select round(
                (count(*) filter (where status = 'completed' and completion_date >= current_date - interval '7 days')::numeric /
                nullif(count(*) filter (where created_at >= current_date - interval '7 days'), 0)) * 100,
                1
            )
            from productivity.tasks
        ),
        'Habit Consistency', (
            select round(avg(streak_count)::numeric / nullif(max(best_streak), 0) * 100, 1)
            from productivity.habits
            where is_active = true
        ),
        'Goal Progress', (
            select round(avg(progress_percentage), 1)
            from productivity.goals
            where status = 'in_progress'
        ),
        'Focus Time', (
            select round(
                (sum(actual_duration) filter (where start_time >= current_date - interval '7 days')::numeric /
                (7 * 480)) * 100,
                1
            )
            from productivity.focus_sessions
            where completed = true
        ),
        'On-Time Rate', (
            select round(
                (count(*) filter (where completion_date <= due_date)::numeric /
                nullif(count(*), 0)) * 100,
                1
            )
            from productivity.tasks
            where status = 'completed' and completion_date >= current_date - interval '30 days'
        )
    ) as metrics;

revoke all on productivity.productivity_metrics_radar from anon, authenticated, service_role;
grant select on productivity.productivity_metrics_radar to authenticated;

comment on view productivity.productivity_metrics_radar is '{"type": "chart", "name": "Productivity Metrics", "description": "Multi-dimensional view of productivity performance", "chart_type": "radar"}';

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

-- Audit Triggers

-- Projects audit triggers
create trigger audit_projects_insert
    after insert
    on productivity.projects
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_projects_update
    after update
    on productivity.projects
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_projects_delete
    before delete
    on productivity.projects
    for each row
execute function supasheet.audit_trigger_function();

-- Tasks audit triggers
create trigger audit_tasks_insert
    after insert
    on productivity.tasks
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_tasks_update
    after update
    on productivity.tasks
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_tasks_delete
    before delete
    on productivity.tasks
    for each row
execute function supasheet.audit_trigger_function();

-- Habits audit triggers
create trigger audit_habits_insert
    after insert
    on productivity.habits
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_habits_update
    after update
    on productivity.habits
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_habits_delete
    before delete
    on productivity.habits
    for each row
execute function supasheet.audit_trigger_function();

-- Goals audit triggers
create trigger audit_goals_insert
    after insert
    on productivity.goals
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_goals_update
    after update
    on productivity.goals
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_goals_delete
    before delete
    on productivity.goals
    for each row
execute function supasheet.audit_trigger_function();

-- Calendar Events audit triggers
create trigger audit_calendar_events_insert
    after insert
    on productivity.calendar_events
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_calendar_events_update
    after update
    on productivity.calendar_events
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_calendar_events_delete
    before delete
    on productivity.calendar_events
    for each row
execute function supasheet.audit_trigger_function();

-- Notes audit triggers
create trigger audit_notes_insert
    after insert
    on productivity.notes
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_notes_update
    after update
    on productivity.notes
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_notes_delete
    before delete
    on productivity.notes
    for each row
execute function supasheet.audit_trigger_function();

-- Reviews audit triggers
create trigger audit_reviews_insert
    after insert
    on productivity.reviews
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_reviews_update
    after update
    on productivity.reviews
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_reviews_delete
    before delete
    on productivity.reviews
    for each row
execute function supasheet.audit_trigger_function();

-- Focus Sessions audit triggers
create trigger audit_focus_sessions_insert
    after insert
    on productivity.focus_sessions
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_focus_sessions_update
    after update
    on productivity.focus_sessions
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_focus_sessions_delete
    before delete
    on productivity.focus_sessions
    for each row
execute function supasheet.audit_trigger_function();

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.projects:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.projects:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.projects:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.projects:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_priorities:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_priorities:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_priorities:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_priorities:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.tasks:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.tasks:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.tasks:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.tasks:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_dependencies:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_dependencies:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_dependencies:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_dependencies:delete'); 

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.habits:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.habits:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.habits:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.habits:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.habit_logs:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.habit_logs:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.habit_logs:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.habit_logs:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.goals:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.goals:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.goals:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.goals:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.goal_milestones:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.goal_milestones:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.goal_milestones:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.goal_milestones:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.calendar_events:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.calendar_events:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.calendar_events:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.calendar_events:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.time_blocks:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.time_blocks:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.time_blocks:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.time_blocks:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.notes:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.notes:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.notes:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.notes:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.reviews:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.reviews:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.reviews:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.reviews:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.focus_sessions:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.focus_sessions:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.focus_sessions:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.focus_sessions:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.active_tasks:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.todays_tasks:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.active_habits:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.goals_progress:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.weekly_habit_completion:select');

-- Grant permissions for report views
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.productivity_report:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_report:select');

-- Grant permissions for dashboard widget views
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.active_task_count:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_completion_split:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.habit_streak:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.goal_progress_summary:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.urgent_tasks_simple:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.today_schedule_simple:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_overview_detailed:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.habit_tracker_detailed:select');

-- Grant permissions for chart views
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.task_trend_area:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.priority_distribution_bar:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.completion_rate_line:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.project_distribution_pie:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'productivity.productivity_metrics_radar:select');

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