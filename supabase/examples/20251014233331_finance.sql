-- Personal Finance Database Schema
-- PostgreSQL implementation

-- Create database (uncomment if needed)
-- CREATE DATABASE personal_finance;

-- Use the database
-- \c personal_finance;
create schema if not exists finance;

grant usage on schema finance to authenticated;

begin;
create type finance.transaction_type as enum ('income', 'expense', 'transfer');
create type finance.budget_period as enum ('weekly', 'monthly', 'quarterly', 'yearly');
create type finance.recurring_frequency as enum ('daily', 'weekly', 'monthly', 'quarterly', 'yearly');

alter type supasheet.app_permission add value 'finance.categories:select';
alter type supasheet.app_permission add value 'finance.categories:insert';
alter type supasheet.app_permission add value 'finance.categories:update';
alter type supasheet.app_permission add value 'finance.categories:delete';

alter type supasheet.app_permission add value 'finance.transactions:select';
alter type supasheet.app_permission add value 'finance.transactions:insert';
alter type supasheet.app_permission add value 'finance.transactions:update';
alter type supasheet.app_permission add value 'finance.transactions:delete';

alter type supasheet.app_permission add value 'finance.budgets:select';
alter type supasheet.app_permission add value 'finance.budgets:insert';
alter type supasheet.app_permission add value 'finance.budgets:update';
alter type supasheet.app_permission add value 'finance.budgets:delete';

alter type supasheet.app_permission add value 'finance.recurring_transactions:select';
alter type supasheet.app_permission add value 'finance.recurring_transactions:insert';
alter type supasheet.app_permission add value 'finance.recurring_transactions:update';
alter type supasheet.app_permission add value 'finance.recurring_transactions:delete';

alter type supasheet.app_permission add value 'finance.financial_goals:select';
alter type supasheet.app_permission add value 'finance.financial_goals:insert';
alter type supasheet.app_permission add value 'finance.financial_goals:update';
alter type supasheet.app_permission add value 'finance.financial_goals:delete';

alter type supasheet.app_permission add value 'finance.account_balances:select';
alter type supasheet.app_permission add value 'finance.account_balances:insert';
alter type supasheet.app_permission add value 'finance.account_balances:update';
alter type supasheet.app_permission add value 'finance.account_balances:delete';

alter type supasheet.app_permission add value 'finance.transaction_summary:select';

-- Report views
alter type supasheet.app_permission add value 'finance.financial_report:select';
alter type supasheet.app_permission add value 'finance.budget_report:select';

-- Dashboard widget views (Card types)
alter type supasheet.app_permission add value 'finance.total_balance:select';
alter type supasheet.app_permission add value 'finance.income_vs_expense:select';
alter type supasheet.app_permission add value 'finance.monthly_savings:select';
alter type supasheet.app_permission add value 'finance.budget_progress:select';

-- Dashboard widget views (Table types)
alter type supasheet.app_permission add value 'finance.recent_transactions_simple:select';
alter type supasheet.app_permission add value 'finance.upcoming_bills_simple:select';
alter type supasheet.app_permission add value 'finance.transaction_list_detailed:select';
alter type supasheet.app_permission add value 'finance.budget_breakdown_detailed:select';

-- Chart views
alter type supasheet.app_permission add value 'finance.spending_trend_area:select';
alter type supasheet.app_permission add value 'finance.category_spending_bar:select';
alter type supasheet.app_permission add value 'finance.income_expense_line:select';
alter type supasheet.app_permission add value 'finance.expense_distribution_pie:select';
alter type supasheet.app_permission add value 'finance.financial_health_radar:select';

commit;

create view finance.accounts as
select * from supasheet.accounts;

revoke all on finance.accounts from anon, authenticated, service_role;
grant select on finance.accounts to authenticated;

-- Transaction Categories Table
CREATE TABLE finance.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES finance.categories(id),
    type finance.transaction_type,
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table finance.categories from anon, authenticated, service_role;
grant select, insert, update, delete on table finance.categories to authenticated;

alter table finance.categories enable row level security;

create policy "Allow authenticated read access" on finance.categories
    for select
    to authenticated
    using (true);

-- Transactions Table
CREATE TABLE finance.transactions (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES finance.categories(id),
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    type finance.transaction_type NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    transfer_account_id UUID REFERENCES supasheet.accounts(id), -- For transfers between accounts
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table finance.transactions from anon, authenticated, service_role;
grant select, insert, update, delete on table finance.transactions to authenticated;

alter table finance.transactions enable row level security;

create policy transactions_select on finance.transactions
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.transactions:select'));

create policy transactions_insert on finance.transactions
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('finance.transactions:insert'));

create policy transactions_update on finance.transactions
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.transactions:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('finance.transactions:update'));

create policy transactions_delete on finance.transactions
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.transactions:delete'));

-- Budgets Table
CREATE TABLE finance.budgets (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category_id INTEGER REFERENCES finance.categories(id),
    amount DECIMAL(15,2) NOT NULL,
    period finance.budget_period DEFAULT 'monthly',
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table finance.budgets from anon, authenticated, service_role;
grant select, insert, update, delete on table finance.budgets to authenticated;

alter table finance.budgets enable row level security;

create policy budgets_select on finance.budgets
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.budgets:select'));

create policy budgets_insert on finance.budgets
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('finance.budgets:insert'));

create policy budgets_update on finance.budgets
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.budgets:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('finance.budgets:update'));

create policy budgets_delete on finance.budgets
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.budgets:delete'));

-- Recurring Transactions Table
CREATE TABLE finance.recurring_transactions (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES finance.categories(id),
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    type finance.transaction_type NOT NULL,
    frequency finance.recurring_frequency NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    next_due_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table finance.recurring_transactions from anon, authenticated, service_role;
grant select, insert, update, delete on table finance.recurring_transactions to authenticated;

alter table finance.recurring_transactions enable row level security;

create policy recurring_transactions_select on finance.recurring_transactions
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.recurring_transactions:select'));

create policy recurring_transactions_insert on finance.recurring_transactions
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('finance.recurring_transactions:insert'));

create policy recurring_transactions_update on finance.recurring_transactions
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.recurring_transactions:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('finance.recurring_transactions:update'));

create policy recurring_transactions_delete on finance.recurring_transactions
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.recurring_transactions:delete'));

-- Financial Goals Table
CREATE TABLE finance.financial_goals (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) DEFAULT 0.00,
    target_date DATE,
    priority INTEGER CHECK (priority >= 1 AND priority <= 5) DEFAULT 3,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table finance.financial_goals from anon, authenticated, service_role;
grant select, insert, update, delete on table finance.financial_goals to authenticated;

alter table finance.financial_goals enable row level security;

create policy financial_goals_select on finance.financial_goals
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.financial_goals:select'));

create policy financial_goals_insert on finance.financial_goals
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('finance.financial_goals:insert'));

create policy financial_goals_update on finance.financial_goals
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.financial_goals:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('finance.financial_goals:update'));

create policy financial_goals_delete on finance.financial_goals
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.financial_goals:delete'));

-- Indexes for better performance
CREATE INDEX idx_transactions_account_id ON finance.transactions(account_id);
CREATE INDEX idx_transactions_category_id ON finance.transactions(category_id);
CREATE INDEX idx_transactions_date ON finance.transactions(transaction_date);
CREATE INDEX idx_transactions_type ON finance.transactions(type);
CREATE INDEX idx_budgets_account_id ON finance.budgets(account_id);
CREATE INDEX idx_financial_goals_account_id ON finance.financial_goals(account_id);
CREATE INDEX idx_recurring_transactions_account_id ON finance.recurring_transactions(account_id);
CREATE INDEX idx_categories_parent ON finance.categories(parent_id);
CREATE INDEX idx_categories_type ON finance.categories(type);

-- Note: Account types table not needed as we're using supasheet.accounts directly

-- Insert default categories
INSERT INTO finance.categories (name, type, parent_id) VALUES
-- Income categories
('Salary', 'income', NULL),
('Freelance', 'income', NULL),
('Investment Returns', 'income', NULL),
('Other Income', 'income', NULL),

-- Expense categories
('Housing', 'expense', NULL),
('Transportation', 'expense', NULL),
('Food & Dining', 'expense', NULL),
('Utilities', 'expense', NULL),
('Healthcare', 'expense', NULL),
('Entertainment', 'expense', NULL),
('Shopping', 'expense', NULL),
('Education', 'expense', NULL),
('Insurance', 'expense', NULL),
('Other Expenses', 'expense', NULL),

-- Transfer category
('Transfer', 'transfer', NULL);

-- Insert subcategories for Housing
INSERT INTO finance.categories (name, type, parent_id) VALUES
('Rent/Mortgage', 'expense', (SELECT id FROM finance.categories WHERE name = 'Housing')),
('Property Tax', 'expense', (SELECT id FROM finance.categories WHERE name = 'Housing')),
('Home Maintenance', 'expense', (SELECT id FROM finance.categories WHERE name = 'Housing'));

-- Insert subcategories for Transportation
INSERT INTO finance.categories (name, type, parent_id) VALUES
('Gas', 'expense', (SELECT id FROM finance.categories WHERE name = 'Transportation')),
('Car Payment', 'expense', (SELECT id FROM finance.categories WHERE name = 'Transportation')),
('Public Transit', 'expense', (SELECT id FROM finance.categories WHERE name = 'Transportation')),
('Car Maintenance', 'expense', (SELECT id FROM finance.categories WHERE name = 'Transportation'));

-- Insert subcategories for Food & Dining
INSERT INTO finance.categories (name, type, parent_id) VALUES
('Groceries', 'expense', (SELECT id FROM finance.categories WHERE name = 'Food & Dining')),
('Restaurants', 'expense', (SELECT id FROM finance.categories WHERE name = 'Food & Dining')),
('Fast Food', 'expense', (SELECT id FROM finance.categories WHERE name = 'Food & Dining'));

-- Create a table for account balances (since supasheet.accounts doesn't have balance field)
CREATE TABLE finance.account_balances (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE UNIQUE,
    balance DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_account_balances_account_id ON finance.account_balances(account_id);

revoke all on table finance.account_balances from anon, authenticated, service_role;
grant select, insert, update, delete on table finance.account_balances to authenticated;

alter table finance.account_balances enable row level security;

create policy account_balances_select on finance.account_balances
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.account_balances:select'));

create policy account_balances_insert on finance.account_balances
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('finance.account_balances:insert'));

create policy account_balances_update on finance.account_balances
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.account_balances:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('finance.account_balances:update'));

create policy account_balances_delete on finance.account_balances
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('finance.account_balances:delete'));

-- Create a view for transaction summaries with category names
CREATE VIEW finance.transaction_summary AS
SELECT
    t.id,
    a.name as account_name,
    c.name as category_name,
    t.amount,
    t.description,
    t.transaction_date,
    t.type,
    t.created_at
FROM finance.transactions t
JOIN supasheet.accounts a ON t.account_id = a.id
LEFT JOIN finance.categories c ON t.category_id = c.id
ORDER BY t.transaction_date DESC;

revoke all on finance.transaction_summary from anon, authenticated, service_role;
grant select on finance.transaction_summary to authenticated;

-- Function to update account balance after transaction
CREATE OR REPLACE FUNCTION finance.update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update account balance based on transaction type
        IF NEW.type = 'income' THEN
            INSERT INTO finance.account_balances (account_id, balance) 
            VALUES (NEW.account_id, NEW.amount)
            ON CONFLICT (account_id) 
            DO UPDATE SET balance = finance.account_balances.balance + NEW.amount,
                         updated_at = CURRENT_TIMESTAMP;
        ELSIF NEW.type = 'expense' THEN
            INSERT INTO finance.account_balances (account_id, balance) 
            VALUES (NEW.account_id, -NEW.amount)
            ON CONFLICT (account_id) 
            DO UPDATE SET balance = finance.account_balances.balance - NEW.amount,
                         updated_at = CURRENT_TIMESTAMP;
        ELSIF NEW.type = 'transfer' THEN
            -- Subtract from source account
            INSERT INTO finance.account_balances (account_id, balance) 
            VALUES (NEW.account_id, -NEW.amount)
            ON CONFLICT (account_id) 
            DO UPDATE SET balance = finance.account_balances.balance - NEW.amount,
                         updated_at = CURRENT_TIMESTAMP;
            -- Add to destination account
            INSERT INTO finance.account_balances (account_id, balance) 
            VALUES (NEW.transfer_account_id, NEW.amount)
            ON CONFLICT (account_id) 
            DO UPDATE SET balance = finance.account_balances.balance + NEW.amount,
                         updated_at = CURRENT_TIMESTAMP;
        END IF;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic balance updates
CREATE TRIGGER trigger_update_account_balance
    AFTER INSERT ON finance.transactions
    FOR EACH ROW
    EXECUTE FUNCTION finance.update_account_balance();

-- Function to get spending by category for a date range
CREATE OR REPLACE FUNCTION finance.get_spending_by_category(
    start_date DATE,
    end_date DATE
)
RETURNS TABLE(category_name VARCHAR, total_amount DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.name as category_name,
        SUM(t.amount) as total_amount
    FROM finance.transactions t
    JOIN finance.categories c ON t.category_id = c.id
    WHERE t.transaction_date >= start_date 
      AND t.transaction_date <= end_date
      AND t.type = 'expense'
    GROUP BY c.name
    ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------
-- Reports for finance
----------------------------------------------------------------

-- Financial report view with detailed transaction information
create or replace view finance.financial_report
with(security_invoker = true) as
select
    a.name as account_name,
    t.transaction_date,
    c.name as category_name,
    t.type,
    t.amount,
    t.description,
    t.reference_number
from finance.transactions t
join supasheet.accounts a on t.account_id = a.id
left join finance.categories c on t.category_id = c.id
order by t.transaction_date desc;

revoke all on finance.financial_report from anon, authenticated, service_role;
grant select on finance.financial_report to authenticated;

comment on view finance.financial_report is '{
    "type": "report",
    "name": "Financial Report",
    "description": "Detailed transaction history with account and category information"
}';

-- Budget report view
create or replace view finance.budget_report
with(security_invoker = true) as
select
    b.name as budget_name,
    c.name as category_name,
    b.amount as budget_amount,
    b.period,
    b.start_date,
    b.end_date,
    coalesce(sum(t.amount), 0) as spent_amount,
    b.amount - coalesce(sum(t.amount), 0) as remaining_amount
from finance.budgets b
left join finance.categories c on b.category_id = c.id
left join finance.transactions t on t.category_id = b.category_id
    and t.account_id = b.account_id
    and t.transaction_date >= b.start_date
    and (b.end_date is null or t.transaction_date <= b.end_date)
    and t.type = 'expense'
where b.is_active = true
group by b.id, b.name, c.name, b.amount, b.period, b.start_date, b.end_date;

revoke all on finance.budget_report from anon, authenticated, service_role;
grant select on finance.budget_report to authenticated;

comment on view finance.budget_report is '{
    "type": "report",
    "name": "Budget Report",
    "description": "Budget tracking with spending and remaining amounts"
}';

----------------------------------------------------------------
-- Dashboard widget views for finance
----------------------------------------------------------------

-- Card1: Total balance across all accounts
create or replace view finance.total_balance
with (security_invoker = true) as
select
    coalesce(sum(balance), 0) as value,
    'wallet' as icon,
    'Total Balance' as label
from finance.account_balances;

revoke all on finance.total_balance from anon, authenticated, service_role;
grant select on finance.total_balance to authenticated;

comment on view finance.total_balance is '{
    "type": "dashboard_widget",
    "name": "Total Balance",
    "description": "Total sum of all account balances",
    "widget_type": "card_1"
}';

-- Card2: Income vs Expense comparison
create or replace view finance.income_vs_expense
with (security_invoker = true) as
select
    coalesce(sum(amount) filter (where type = 'income' and transaction_date >= date_trunc('month', current_date)), 0) as primary,
    coalesce(sum(amount) filter (where type = 'expense' and transaction_date >= date_trunc('month', current_date)), 0) as secondary,
    'Income' as primary_label,
    'Expenses' as secondary_label
from finance.transactions;

revoke all on finance.income_vs_expense from anon, authenticated, service_role;
grant select on finance.income_vs_expense to authenticated;

comment on view finance.income_vs_expense is '{
    "type": "dashboard_widget",
    "name": "Income vs Expenses",
    "description": "Monthly income and expense comparison",
    "widget_type": "card_2"
}';

-- Card3: Monthly savings with percentage
create or replace view finance.monthly_savings
with (security_invoker = true) as
select
    coalesce(
        sum(amount) filter (where type = 'income' and transaction_date >= date_trunc('month', current_date)) -
        sum(amount) filter (where type = 'expense' and transaction_date >= date_trunc('month', current_date)),
        0
    ) as value,
    case
        when sum(amount) filter (where type = 'income' and transaction_date >= date_trunc('month', current_date)) > 0
        then round((
            (sum(amount) filter (where type = 'income' and transaction_date >= date_trunc('month', current_date)) -
             sum(amount) filter (where type = 'expense' and transaction_date >= date_trunc('month', current_date)))
            / sum(amount) filter (where type = 'income' and transaction_date >= date_trunc('month', current_date))
        ) * 100, 1)
        else 0
    end as percent
from finance.transactions;

revoke all on finance.monthly_savings from anon, authenticated, service_role;
grant select on finance.monthly_savings to authenticated;

comment on view finance.monthly_savings is '{
    "type": "dashboard_widget",
    "name": "Monthly Savings",
    "description": "Current month savings amount and percentage",
    "widget_type": "card_3"
}';

-- Card4: Budget progress with breakdown
create or replace view finance.budget_progress
with (security_invoker = true) as
select
    coalesce(sum(t.amount), 0) as current,
    coalesce(sum(b.amount), 0) as total,
    json_build_array(
        json_build_object(
            'label', 'Within Budget',
            'value', count(*) filter (where coalesce(spent.total, 0) <= b.amount)
        ),
        json_build_object(
            'label', 'Over Budget',
            'value', count(*) filter (where coalesce(spent.total, 0) > b.amount)
        ),
        json_build_object(
            'label', 'Unspent',
            'value', count(*) filter (where coalesce(spent.total, 0) = 0)
        )
    ) as segments
from finance.budgets b
left join lateral (
    select sum(amount) as total
    from finance.transactions t
    where t.category_id = b.category_id
    and t.account_id = b.account_id
    and t.type = 'expense'
    and t.transaction_date >= b.start_date
    and (b.end_date is null or t.transaction_date <= b.end_date)
) spent on true
left join finance.transactions t on t.category_id = b.category_id
    and t.account_id = b.account_id
    and t.type = 'expense'
    and t.transaction_date >= b.start_date
    and (b.end_date is null or t.transaction_date <= b.end_date)
where b.is_active = true;

revoke all on finance.budget_progress from anon, authenticated, service_role;
grant select on finance.budget_progress to authenticated;

comment on view finance.budget_progress is '{
    "type": "dashboard_widget",
    "name": "Budget Progress",
    "description": "Overall budget tracking with categories",
    "widget_type": "card_4"
}';

-- Table1: Recent transactions (simple)
create or replace view finance.recent_transactions_simple
with (security_invoker = true) as
select
    to_char(transaction_date, 'MM/DD') as date,
    substring(description, 1, 30) || case when length(description) > 30 then '...' else '' end as description,
    type,
    amount
from finance.transactions
order by transaction_date desc, created_at desc
limit 10;

revoke all on finance.recent_transactions_simple from anon, authenticated, service_role;
grant select on finance.recent_transactions_simple to authenticated;

comment on view finance.recent_transactions_simple is '{
    "type": "dashboard_widget",
    "name": "Recent Transactions",
    "description": "Latest 10 transactions",
    "widget_type": "table_1"
}';

-- Table1: Upcoming recurring transactions (simple)
create or replace view finance.upcoming_bills_simple
with (security_invoker = true) as
select
    substring(description, 1, 30) || case when length(description) > 30 then '...' else '' end as bill,
    to_char(next_due_date, 'MM/DD') as due_date,
    amount
from finance.recurring_transactions
where is_active = true
and next_due_date >= current_date
order by next_due_date
limit 10;

revoke all on finance.upcoming_bills_simple from anon, authenticated, service_role;
grant select on finance.upcoming_bills_simple to authenticated;

comment on view finance.upcoming_bills_simple is '{
    "type": "dashboard_widget",
    "name": "Upcoming Bills",
    "description": "Next recurring transactions",
    "widget_type": "table_1"
}';

-- Table2: Transaction list (detailed)
create or replace view finance.transaction_list_detailed
with (security_invoker = true) as
select
    to_char(t.transaction_date, 'MM/DD/YYYY') as date,
    c.name as category,
    substring(t.description, 1, 25) || case when length(t.description) > 25 then '...' else '' end as description,
    t.type,
    t.amount,
    a.name as account,
    t.reference_number as ref
from finance.transactions t
join supasheet.accounts a on t.account_id = a.id
left join finance.categories c on t.category_id = c.id
order by t.transaction_date desc, t.created_at desc
limit 10;

revoke all on finance.transaction_list_detailed from anon, authenticated, service_role;
grant select on finance.transaction_list_detailed to authenticated;

comment on view finance.transaction_list_detailed is '{
    "type": "dashboard_widget",
    "name": "Transaction Details",
    "description": "Detailed transaction information",
    "widget_type": "table_2"
}';

-- Table2: Budget breakdown (detailed)
create or replace view finance.budget_breakdown_detailed
with (security_invoker = true) as
select
    b.name as budget,
    c.name as category,
    b.amount as budgeted,
    coalesce(sum(t.amount), 0) as spent,
    b.amount - coalesce(sum(t.amount), 0) as remaining,
    case
        when b.amount > 0
        then round((coalesce(sum(t.amount), 0) / b.amount) * 100, 1)
        else 0
    end as percent_used,
    b.period
from finance.budgets b
left join finance.categories c on b.category_id = c.id
left join finance.transactions t on t.category_id = b.category_id
    and t.account_id = b.account_id
    and t.type = 'expense'
    and t.transaction_date >= b.start_date
    and (b.end_date is null or t.transaction_date <= b.end_date)
where b.is_active = true
group by b.id, b.name, c.name, b.amount, b.period
order by percent_used desc
limit 10;

revoke all on finance.budget_breakdown_detailed from anon, authenticated, service_role;
grant select on finance.budget_breakdown_detailed to authenticated;

comment on view finance.budget_breakdown_detailed is '{
    "type": "dashboard_widget",
    "name": "Budget Breakdown",
    "description": "Detailed budget usage by category",
    "widget_type": "table_2"
}';

----------------------------------------------------------------
-- Chart views for finance
----------------------------------------------------------------

-- Area chart: Spending trend over last 30 days
create or replace view finance.spending_trend_area
with (security_invoker = true) as
select
    to_char(date_trunc('day', transaction_date), 'Mon DD') as date,
    coalesce(sum(amount) filter (where type = 'income'), 0) as income,
    coalesce(sum(amount) filter (where type = 'expense'), 0) as expenses,
    coalesce(
        sum(amount) filter (where type = 'income') -
        sum(amount) filter (where type = 'expense'),
        0
    ) as net
from finance.transactions
where transaction_date >= current_date - interval '30 days'
group by date_trunc('day', transaction_date)
order by date_trunc('day', transaction_date);

revoke all on finance.spending_trend_area from anon, authenticated, service_role;
grant select on finance.spending_trend_area to authenticated;

comment on view finance.spending_trend_area is '{
    "type": "chart",
    "name": "Spending Trend",
    "description": "Income and expenses over last 30 days",
    "chart_type": "area"
}';

-- Bar chart: Spending by category
create or replace view finance.category_spending_bar
with (security_invoker = true) as
select
    c.name as label,
    coalesce(sum(t.amount) filter (where t.type = 'expense'), 0) as expenses,
    coalesce(sum(t.amount) filter (where t.type = 'income'), 0) as income
from finance.categories c
left join finance.transactions t on t.category_id = c.id
    and t.transaction_date >= date_trunc('month', current_date)
where c.is_active = true
group by c.name
order by expenses desc
limit 10;

revoke all on finance.category_spending_bar from anon, authenticated, service_role;
grant select on finance.category_spending_bar to authenticated;

comment on view finance.category_spending_bar is '{
    "type": "chart",
    "name": "Category Spending",
    "description": "Top spending categories this month",
    "chart_type": "bar"
}';

-- Line chart: Income and expense trend over time
create or replace view finance.income_expense_line
with (security_invoker = true) as
select
    to_char(date_trunc('week', transaction_date), 'Mon DD') as date,
    coalesce(sum(amount) filter (where type = 'income'), 0) as income,
    coalesce(sum(amount) filter (where type = 'expense'), 0) as expenses
from finance.transactions
where transaction_date >= current_date - interval '12 weeks'
group by date_trunc('week', transaction_date)
order by date_trunc('week', transaction_date);

revoke all on finance.income_expense_line from anon, authenticated, service_role;
grant select on finance.income_expense_line to authenticated;

comment on view finance.income_expense_line is '{
    "type": "chart",
    "name": "Income vs Expenses",
    "description": "Weekly income and expense comparison",
    "chart_type": "line"
}';

-- Pie chart: Expense distribution by category
create or replace view finance.expense_distribution_pie
with (security_invoker = true) as
select
    c.name as label,
    coalesce(sum(t.amount), 0) as value
from finance.categories c
left join finance.transactions t on t.category_id = c.id
    and t.type = 'expense'
    and t.transaction_date >= date_trunc('month', current_date)
where c.type = 'expense'
and c.is_active = true
group by c.name
having sum(t.amount) > 0
order by value desc;

revoke all on finance.expense_distribution_pie from anon, authenticated, service_role;
grant select on finance.expense_distribution_pie to authenticated;

comment on view finance.expense_distribution_pie is '{
    "type": "chart",
    "name": "Expense Distribution",
    "description": "Monthly expenses by category",
    "chart_type": "pie"
}';

-- Radar chart: Financial health metrics
create or replace view finance.financial_health_radar
with (security_invoker = true) as
select
    'Income' as metric,
    coalesce(sum(amount) filter (where type = 'income' and transaction_date >= date_trunc('month', current_date)), 0) as current_month,
    coalesce(sum(amount) filter (where type = 'income' and transaction_date >= date_trunc('month', current_date - interval '1 month') and transaction_date < date_trunc('month', current_date)), 0) as last_month,
    coalesce(avg(monthly_income.total), 0) as avg_3months
from finance.transactions
cross join lateral (
    select sum(amount) as total
    from finance.transactions
    where type = 'income'
    and transaction_date >= current_date - interval '3 months'
    group by date_trunc('month', transaction_date)
) monthly_income

union all

select
    'Expenses' as metric,
    coalesce(sum(amount) filter (where type = 'expense' and transaction_date >= date_trunc('month', current_date)), 0) as current_month,
    coalesce(sum(amount) filter (where type = 'expense' and transaction_date >= date_trunc('month', current_date - interval '1 month') and transaction_date < date_trunc('month', current_date)), 0) as last_month,
    coalesce(avg(monthly_expense.total), 0) as avg_3months
from finance.transactions
cross join lateral (
    select sum(amount) as total
    from finance.transactions
    where type = 'expense'
    and transaction_date >= current_date - interval '3 months'
    group by date_trunc('month', transaction_date)
) monthly_expense

union all

select
    'Savings' as metric,
    coalesce(
        sum(amount) filter (where type = 'income' and transaction_date >= date_trunc('month', current_date)) -
        sum(amount) filter (where type = 'expense' and transaction_date >= date_trunc('month', current_date)),
        0
    ) as current_month,
    coalesce(
        sum(amount) filter (where type = 'income' and transaction_date >= date_trunc('month', current_date - interval '1 month') and transaction_date < date_trunc('month', current_date)) -
        sum(amount) filter (where type = 'expense' and transaction_date >= date_trunc('month', current_date - interval '1 month') and transaction_date < date_trunc('month', current_date)),
        0
    ) as last_month,
    coalesce(avg(monthly_savings.total), 0) as avg_3months
from finance.transactions
cross join lateral (
    select
        sum(amount) filter (where type = 'income') - sum(amount) filter (where type = 'expense') as total
    from finance.transactions
    where transaction_date >= current_date - interval '3 months'
    group by date_trunc('month', transaction_date)
) monthly_savings;

revoke all on finance.financial_health_radar from anon, authenticated, service_role;
grant select on finance.financial_health_radar to authenticated;

comment on view finance.financial_health_radar is '{
    "type": "chart",
    "name": "Financial Health",
    "description": "Income, expenses and savings metrics",
    "chart_type": "radar"
}';

----------------------------------------------------------------
-- Add table comments with metadata
----------------------------------------------------------------

comment on table finance.transactions is
'{
    "icon": "DollarSign",
    "display": "block",
    "query": {
        "sort": [{"id":"transaction_date","desc":true}],
        "filter": [],
        "join": [
            {"table":"accounts","on":"account_id","columns":["name","email"]},
            {"table":"categories","on":"category_id","columns":["name","type","color"]}
        ]
    },
    "items": [
        {"id":"type","name":"Transactions By Type","type":"kanban","group":"type","title":"description","description":"notes","date":"transaction_date","badge":"amount"},
        {"id":"calendar","name":"Calendar View","type":"calendar","title":"description","startDate":"transaction_date","endDate":"transaction_date","badge":"type"}
    ]
}';

comment on table finance.budgets is
'{
    "icon": "Target",
    "display": "block",
    "query": {
        "sort": [{"id":"start_date","desc":true}],
        "filter": [{"id":"is_active","value":"true","variant":"boolean","operator":"eq"}]
    },
    "items": [
        {"id":"period","name":"Budgets By Period","type":"kanban","group":"period","title":"name","description":"amount","badge":"category_id"}
    ]
}';

comment on table finance.categories is
'{
    "icon": "FolderTree",
    "display": "block"
}';

comment on table finance.financial_goals is
'{
    "icon": "Trophy",
    "display": "block",
    "query": {
        "sort": [{"id":"target_date","desc":false}],
        "filter": []
    }
}';

comment on table finance.recurring_transactions is
'{
    "icon": "Repeat",
    "display": "block",
    "query": {
        "sort": [{"id":"next_due_date","desc":false}],
        "filter": [{"id":"is_active","value":"true","variant":"boolean","operator":"eq"}]
    },
    "items": [
        {"id":"frequency","name":"By Frequency","type":"kanban","group":"frequency","title":"description","description":"amount","date":"next_due_date"}
    ]
}';

----------------------------------------------------------------
-- Audit triggers for finance
----------------------------------------------------------------

create trigger audit_transactions_insert
    after insert
    on finance.transactions
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_transactions_update
    after update
    on finance.transactions
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_transactions_delete
    before delete
    on finance.transactions
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_budgets_insert
    after insert
    on finance.budgets
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_budgets_update
    after update
    on finance.budgets
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_budgets_delete
    before delete
    on finance.budgets
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_recurring_transactions_insert
    after insert
    on finance.recurring_transactions
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_recurring_transactions_update
    after update
    on finance.recurring_transactions
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_recurring_transactions_delete
    before delete
    on finance.recurring_transactions
    for each row
execute function supasheet.audit_trigger_function();


insert into supasheet.role_permissions (role, permission) values ('user', 'finance.categories:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.categories:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.categories:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.categories:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'finance.transactions:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.transactions:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.transactions:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.transactions:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'finance.budgets:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.budgets:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.budgets:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.budgets:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'finance.recurring_transactions:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.recurring_transactions:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.recurring_transactions:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.recurring_transactions:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'finance.financial_goals:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.financial_goals:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.financial_goals:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.financial_goals:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'finance.account_balances:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.account_balances:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.account_balances:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.account_balances:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'finance.transaction_summary:select');

-- Grant permissions for report views
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.financial_report:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.budget_report:select');

-- Grant permissions for dashboard widget views
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.total_balance:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.income_vs_expense:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.monthly_savings:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.budget_progress:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.recent_transactions_simple:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.upcoming_bills_simple:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.transaction_list_detailed:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.budget_breakdown_detailed:select');

-- Grant permissions for chart views
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.spending_trend_area:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.category_spending_bar:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.income_expense_line:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.expense_distribution_pie:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'finance.financial_health_radar:select');

-- Sample data insertion (optional)
-- Uncomment the following lines to insert sample data

/*
-- Sample data insertion would require existing user accounts in supasheet.accounts
-- Example:
-- INSERT INTO finance.transactions (account_id, category_id, amount, description, transaction_date, type) VALUES
-- ('user-uuid-here', (SELECT id FROM finance.categories WHERE name = 'Groceries'), 150.00, 'Weekly grocery shopping', CURRENT_DATE - INTERVAL '1 day', 'expense');

-- Insert sample budget
-- INSERT INTO finance.budgets (name, category_id, amount, period, start_date) VALUES
-- ('Monthly Grocery Budget', (SELECT id FROM finance.categories WHERE name = 'Groceries'), 600.00, 'monthly', DATE_TRUNC('month', CURRENT_DATE));
*/