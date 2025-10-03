-- Personal Finance Database Schema
-- PostgreSQL implementation

-- Create database (uncomment if needed)
-- CREATE DATABASE personal_finance;

-- Use the database
-- \c personal_finance;
create schema if not exists finance;

grant usage on schema finance to authenticated;

-- Transaction Categories Table
CREATE TABLE finance.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES finance.categories(id),
    type VARCHAR(20) CHECK (type IN ('income', 'expense', 'transfer')),
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table finance.categories from anon, authenticated, service_role;
grant select on table finance.categories to authenticated;

alter table finance.categories enable row level security;

create policy "Allow authenticated read access" on finance.categories
    for select
    to authenticated
    using (true);

-- Transactions Table
CREATE TABLE finance.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES finance.categories(id),
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense', 'transfer')) NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    transfer_account_id UUID REFERENCES supasheet.accounts(id), -- For transfers between accounts
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table finance.transactions from anon, authenticated, service_role;
grant select on table finance.transactions to authenticated;

alter table finance.transactions enable row level security;

create policy "Allow authenticated read access" on finance.transactions
    for select
    to authenticated
    using (true);

-- Budgets Table
CREATE TABLE finance.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category_id INTEGER REFERENCES finance.categories(id),
    amount DECIMAL(15,2) NOT NULL,
    period VARCHAR(20) CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')) DEFAULT 'monthly',
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table finance.budgets from anon, authenticated, service_role;
grant select on table finance.budgets to authenticated;

alter table finance.budgets enable row level security;

create policy "Allow authenticated read access" on finance.budgets
    for select
    to authenticated
    using (true);

-- Recurring Transactions Table
CREATE TABLE finance.recurring_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES finance.categories(id),
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('income', 'expense', 'transfer')) NOT NULL,
    frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    next_due_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table finance.recurring_transactions from anon, authenticated, service_role;
grant select on table finance.recurring_transactions to authenticated;

alter table finance.recurring_transactions enable row level security;

create policy "Allow authenticated read access" on finance.recurring_transactions
    for select
    to authenticated
    using (true);

-- Financial Goals Table
CREATE TABLE finance.financial_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
grant select on table finance.financial_goals to authenticated;

alter table finance.financial_goals enable row level security;

create policy "Allow authenticated read access" on finance.financial_goals
    for select
    to authenticated
    using (true);

-- Indexes for better performance
CREATE INDEX idx_transactions_account_id ON finance.transactions(account_id);
CREATE INDEX idx_transactions_category_id ON finance.transactions(category_id);
CREATE INDEX idx_transactions_date ON finance.transactions(transaction_date);
CREATE INDEX idx_transactions_type ON finance.transactions(type);
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE UNIQUE,
    balance DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

revoke all on table finance.account_balances from anon, authenticated, service_role;
grant select on table finance.account_balances to authenticated;

alter table finance.account_balances enable row level security;

create policy "Allow authenticated read access" on finance.account_balances
    for select
    to authenticated
    using (true);

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