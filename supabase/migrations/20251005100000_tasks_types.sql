create type task_status as enum ('pending', 'in_progress', 'completed', 'archived');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');

alter type supasheet.app_permission add value 'public.tasks:select';
alter type supasheet.app_permission add value 'public.tasks:insert';
alter type supasheet.app_permission add value 'public.tasks:update';
alter type supasheet.app_permission add value 'public.tasks:delete';

alter type supasheet.app_permission add value 'public.user_tasks:select';
alter type supasheet.app_permission add value 'public.task_report:select';

alter type supasheet.app_permission add value 'public.task_summary:select';
alter type supasheet.app_permission add value 'public.task_completion_rate:select';
alter type supasheet.app_permission add value 'public.tasks_by_status:select';
alter type supasheet.app_permission add value 'public.task_urgent_count:select';

alter type supasheet.app_permission add value if not exists 'public.task_list_simple:select';
alter type supasheet.app_permission add value if not exists 'public.active_tasks_simple:select';
alter type supasheet.app_permission add value if not exists 'public.task_list_detailed:select';
alter type supasheet.app_permission add value if not exists 'public.task_analytics_detailed:select';

alter type supasheet.app_permission add value 'public.task_trend_area:select';
alter type supasheet.app_permission add value 'public.task_priority_bar:select';
alter type supasheet.app_permission add value 'public.task_completion_line:select';
alter type supasheet.app_permission add value 'public.task_status_pie:select';
alter type supasheet.app_permission add value 'public.task_metrics_radar:select';

alter type supasheet.app_permission add value 'public.task_board_view:select';
alter type supasheet.app_permission add value 'public.task_list_view:select';
alter type supasheet.app_permission add value 'public.task_calendar_view:select';