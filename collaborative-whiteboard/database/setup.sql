-- ============================================
-- MySQL Setup for Collaborative Whiteboard
-- Run this in MySQL Workbench or MySQL CLI
-- ============================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS whiteboard_db;

-- Step 2: Switch to the database
USE whiteboard_db;

-- Step 3: Tables will be auto-created by Spring Boot (JPA ddl-auto=update)
-- But you can manually create them too:

CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_code VARCHAR(10) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    room_id BIGINT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- View all rooms
SELECT * FROM rooms;

-- View all members with their room code
SELECT rm.username, r.room_code, rm.joined_at
FROM room_members rm
JOIN rooms r ON rm.room_id = r.id;
