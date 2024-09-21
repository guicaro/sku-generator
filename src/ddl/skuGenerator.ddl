-- 1. Category Table
CREATE TABLE Category (
    category_code SMALLINT PRIMARY KEY CHECK (category_code >= 10 AND category_code < 100),
    description VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Brand Table
CREATE TABLE Brand (
    brand_code SMALLINT PRIMARY KEY CHECK (brand_code >= 0 AND brand_code < 1000),
    description VARCHAR(255) NOT NULL UNIQUE
);

-- 3. Item Table
CREATE TABLE Item (
    item_id SERIAL PRIMARY KEY, -- 5-digit unique ID
    name VARCHAR(255) NOT NULL,
    category_code SMALLINT NOT NULL REFERENCES Category(category_code),
    brand_code SMALLINT NOT NULL REFERENCES Brand(brand_code),
    year SMALLINT NOT NULL CHECK (year >= 0 AND year < 100),
    item_code SMALLINT NOT NULL CHECK (item_code >= 0 AND item_code < 1000),
    unique_item_id INTEGER GENERATED ALWAYS AS (year * 1000 + item_code) STORED
);

-- 4. Variation Table
CREATE TABLE Variation (
    variation_code SMALLINT PRIMARY KEY CHECK (variation_code >= 0 AND variation_code < 100),
    description VARCHAR(255) NOT NULL UNIQUE
);

-- 5. Size Table
CREATE TABLE Size (
    size_code SMALLINT PRIMARY KEY CHECK (size_code >= 0 AND size_code < 100),
    description VARCHAR(255) NOT NULL UNIQUE
);

-- 6. SKU Table
CREATE TABLE SKU (
    sku CHAR(14) PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES Item(item_id),
    variation_code SMALLINT NOT NULL REFERENCES Variation(variation_code),
    size_code SMALLINT NOT NULL REFERENCES Size(size_code)
);

-- 7. WarehouseLocation Table
CREATE TABLE WarehouseLocation (
    sku CHAR(14) NOT NULL REFERENCES SKU(sku),
    location VARCHAR(255) NOT NULL,
    PRIMARY KEY (sku, location)
);
