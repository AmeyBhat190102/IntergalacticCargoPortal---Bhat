CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('Admin', 'Standard'))
);

CREATE TABLE IF NOT EXISTS cargo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cargo_id VARCHAR(20) UNIQUE NOT NULL,
    weight NUMERIC(10, 4) NOT NULL,
    destination TEXT NOT NULL,
    date DATE NOT NULL
);