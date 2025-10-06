create type task_status as enum ('pending', 'in_progress', 'completed', 'archived');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');

alter type supasheet.app_permission add value 'public.tasks:select';
alter type supasheet.app_permission add value 'public.tasks:insert';
alter type supasheet.app_permission add value 'public.tasks:update';
alter type supasheet.app_permission add value 'public.tasks:delete';

alter type supasheet.app_permission add value 'public.vw_tasks:select';
alter type supasheet.app_permission add value 'reports.task_report:select';
alter type supasheet.app_permission add value 'dashboards.task_summary:select';

alter type supasheet.app_permission add value 'dashboards.task_completion_rate:select';
alter type supasheet.app_permission add value 'dashboards.tasks_by_status:select';
alter type supasheet.app_permission add value 'dashboards.task_urgent_count:select';

alter type supasheet.app_permission add value if not exists 'dashboards.task_list_simple:select';
alter type supasheet.app_permission add value if not exists 'dashboards.active_tasks_simple:select';
alter type supasheet.app_permission add value if not exists 'dashboards.task_list_detailed:select';
alter type supasheet.app_permission add value if not exists 'dashboards.task_analytics_detailed:select';

alter type supasheet.app_permission add value 'charts.task_trend_area:select';
alter type supasheet.app_permission add value 'charts.task_priority_bar:select';
alter type supasheet.app_permission add value 'charts.task_completion_line:select';
alter type supasheet.app_permission add value 'charts.task_status_pie:select';
alter type supasheet.app_permission add value 'charts.task_metrics_radar:select';