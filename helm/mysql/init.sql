-- 데이터베이스 생성 (이미 존재하면 무시)
CREATE DATABASE IF NOT EXISTS msa_db;

-- 사용자 생성 (이미 존재하면 무시)
CREATE USER IF NOT EXISTS 'msa_user'@'%' IDENTIFIED BY 'msa_password';

-- 권한 부여
GRANT ALL PRIVILEGES ON msa_db.* TO 'msa_user'@'%';
FLUSH PRIVILEGES;

-- 데이터베이스 사용
USE msa_db;

-- 사용자 테이블 초기화 (이미 존재하면 무시)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255)
);

-- 상품 테이블 초기화 (이미 존재하면 무시)
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(19,2),
    stock INT
);

-- 초기 데이터 삽입 (중복 방지)
INSERT IGNORE INTO users (username, password, name, email) VALUES
('user1', 'password1', '홍길동', 'user1@example.com'),
('user2', 'password2', '김철수', 'user2@example.com');

INSERT IGNORE INTO products (name, description, price, stock) VALUES
('노트북', '고성능 노트북', 1500000, 10),
('스마트폰', '최신 스마트폰', 1000000, 20); 