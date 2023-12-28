-- Active: 1703000615609@@127.0.0.1@3306@digital_store
INSERT INTO
    brands (brand_name)
VALUES
    ("Nike");

CREATE TABLE
    IF NOT EXISTS banners (
        id BIGINT NOT NULL UNIQUE AUTO_INCREMENT,
        sup_text VARCHAR(50) NOT NULL,
        sub_text VARCHAR(50) NOT NULL,
        title VARCHAR(50) NOT NULL,
        cta_text VARCHAR(50) NOT NULL,
        cta_color VARCHAR(15) NOT NULL,
        image TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE,
        updated_at VARCHAR(50) NOT NULL,
        CONSTRAINT id_pk PRIMARY KEY (id)
    );

DESC banners;

CREATE TABLE
    IF NOT EXISTS categorys (
        id BIGINT NOT NULL UNIQUE,
        name VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE,
        updated_at VARCHAR(50) NOT NULL,
        CONSTRAINT id_category PRIMARY KEY (id)
    );

ALTER TABLE categorys MODIFY id BIGINT NOT NULL AUTO_INCREMENT;

CREATE TABLE
    IF NOT EXISTS products (
        product_id INTEGER NOT NULL AUTO_INCREMENT,
        product_image BLOB(100) NULL,
        product_discount INTEGER NOT NULL,
        product_price FLOAT NOT NULL,
        product_sizes VARCHAR(50) NULL,
        product_gender VARCHAR(10) NOT NULL,
        product_name VARCHAR(20) NOT NULL,
        product_discription VARCHAR(255) NULL,
        product_category VARCHAR(10) NOT NULL,
        product_colors VARCHAR(10) NOT NULL,
        product_status INTEGER DEFAULT 1,
        product_condition INTEGER DEFAULT 1,
        CONSTRAINT id_product_pk PRIMARY KEY (product_id)
    );

SHOW TABLES;

desc products;

ALTER TABLE products MODIFY product_category BIGINT NOT NULL;
ALTER TABLE products ADD FOREIGN KEY (product_category) REFERENCES categorys (id);

SELECT
    *
FROM
    products
    INNER JOIN categorys ON products.product_category = categorys.id;

CREATE TABLE
    IF NOT EXISTS collections (
        id_collection BIGINT NOT NULL AUTO_INCREMENT,
        discount_collection INTEGER NULL,
        title_collection VARCHAR(50) NOT NULL,
        image_collection TEXT NOT NULL,
        cta_text_collection VARCHAR(50) NOT NULL,
        created_at_collection TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE,
        updated_at_collection VARCHAR(50) NOT NULL,
        product_collections TEXT NOT NULL,
        CONSTRAINT id_collection_pk PRIMARY KEY (id_collection)
    );

SELECT
    *
FROM
    collections;

CREATE TABLE
    IF NOT EXISTS reviews (
        id_review BIGINT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
        rate_review INTEGER NOT NULL,
        comment_review VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE,
        updated_at VARCHAR(50) NOT NULL
    );

ALTER TABLE reviews ADD FOREIGN KEY (id_review) REFERENCES users (id);

SELECT
    *
FROM
    reviews;

CREATE TABLE
    IF NOT EXISTS orders (
        id_order BIGINT NOT NULL AUTO_INCREMENT,
        product_orders TEXT NOT NULL,
        total_price INTEGER NOT NULL,
        discount DOUBLE NULL,
        rate VARCHAR(100) NULL,
        CONSTRAINT id_order_pk PRIMARY KEY (id_order)
    );

    DESC orders;

ALTER TABLE products MODIFY product_discount DOUBLE NULL;

    DESC products;


    SHOW TABLES;


    DELETE FROM brands WHERE brand_id = 28;


DESC banners;


ALTER TABLE banners MODIFY created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP();

INSERT INTO banners (sup_text, title, sub_text, cta_text, cta_color, image)
VALUES
('Sinta a conexão da terra apartir da sola do pé', 'Queima dos ortopedicos 👣', 'Consequat culpa exercitation mollit nisi excepteur do do tempor laboris eiusmod irure consectetur.', 'Ver ofertas' , '#254FCA', 'https://github.com/DavidBrito32/digital_store/blob/main/src/components/Caroussel/assets/Caroussel/Tenis3.png?raw=true');


SELECT * FROM banners;


CREATE TABLE IF NOT EXISTS brands(
    id BIGINT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL,
    brand_status INT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() UNIQUE,
    updated_at TIMESTAMP NULL
);


DROP TABLE brands;

DESC brands;



CREATE TABLE IF NOT EXISTS users(
    user_id BIGINT NOT NULL AUTO_INCREMENT UNIQUE,
    user_name VARCHAR(50) NOT NULL,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(50) NOT NULL,
    user_level INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT user_id_pk PRIMARY KEY (user_id)
);

DESC products;

ALTER TABLE categorys MODIFY updated_at TEXT NULL;

SHOW TABLES;

SELECT * FROM users;
