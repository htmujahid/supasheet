create schema if not exists supasheet;

-- Initialize schema and extensions
grant usage on schema supasheet to authenticated;

create domain EMAIL as text;

create domain TEL as text;

create domain RATING as real check (value >= 0 and value <= 5);

create domain PERCENTAGE as real;

create domain URL as text;

create domain DURATION as bigint;

create domain COLOR as varchar(16);
