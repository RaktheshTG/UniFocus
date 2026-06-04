-- =====================================================
-- FULL HABIT TRACKER PROJECT DATABASE
-- WITH SAMPLE DATA
-- =====================================================

DROP DATABASE IF EXISTS habit_tracker;
CREATE DATABASE habit_tracker;
USE habit_tracker;

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- HABITS TABLE
-- =========================
CREATE TABLE habits (
    habit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    habit_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    frequency ENUM('Daily','Weekly','Monthly') DEFAULT 'Daily',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_habits_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- =========================
-- HABIT LOG TABLE
-- =========================
CREATE TABLE habit_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    habit_id INT NOT NULL,
    log_date DATE NOT NULL,
    status ENUM('DONE','MISSED') NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_habit
        FOREIGN KEY (habit_id)
        REFERENCES habits(habit_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_habit_date
        UNIQUE (habit_id, log_date)
);

-- =========================
-- QUOTES TABLE
-- =========================
CREATE TABLE quotes (
    quote_id INT AUTO_INCREMENT PRIMARY KEY,
    quote_text TEXT NOT NULL,
    author VARCHAR(100),
    category VARCHAR(50),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- POMODORO SESSIONS TABLE
-- =========================
CREATE TABLE pomodoro_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_start DATETIME NOT NULL,
    session_end DATETIME,
    duration_minutes INT NOT NULL,
    session_type ENUM('FOCUS','SHORT_BREAK','LONG_BREAK') DEFAULT 'FOCUS',
    completed TINYINT(1) DEFAULT 1,

    CONSTRAINT fk_pomodoro_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- =========================
-- STRESS LOG TABLE
-- =========================
CREATE TABLE stress_log (
    stress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    log_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    stress_level TINYINT NOT NULL,
    mood VARCHAR(30),
    trigger_note VARCHAR(255),
    coping_action VARCHAR(100),
    outcome_note VARCHAR(255),

    CONSTRAINT chk_stress_level
        CHECK (stress_level BETWEEN 1 AND 10),

    CONSTRAINT fk_stress_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- =========================
-- TASKS TABLE (To-Do list)
-- =========================
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(120) NOT NULL,
    description VARCHAR(255),
    due_date DATE,
    priority ENUM('LOW','MEDIUM','HIGH') DEFAULT 'MEDIUM',
    status ENUM('PENDING','DONE') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tasks_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- =========================
-- TIMETABLE SLOTS TABLE
-- =========================
CREATE TABLE timetable_slots (
    slot_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    day_of_week ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject VARCHAR(80) NOT NULL,
    location VARCHAR(80),
    type ENUM('CLASS','LAB','STUDY','OTHER') DEFAULT 'CLASS',

    CONSTRAINT fk_slots_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_time_order CHECK (end_time > start_time)
);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

INSERT INTO quotes (quote_text, author, category) VALUES
('No one is coming to save you. Build yourself.', 'Unknown', 'Discipline'),
('You either suffer the pain of discipline or the pain of regret.', 'Jim Rohn', 'Discipline'),
('Comfort is the enemy of growth.', 'David Goggins', 'Mental Strength'),
('Stop waiting. Start building.', 'Unknown', 'Action'),
('If you are tired of starting over, stop quitting.', 'Unknown', 'Persistence'),
('You don''t rise to the level of your goals. You fall to the level of your systems.', 'James Clear', 'Systems'),
('The body achieves what the mind believes.', 'Unknown', 'Belief'),
('Discipline beats motivation every single time.', 'Unknown', 'Discipline'),
('Your future is created by what you do today, not tomorrow.', 'Robert Kiyosaki', 'Action'),
('Hard days build strong people.', 'Unknown', 'Resilience'),
('Greatness requires suffering.', 'Unknown', 'Mental Strength'),
('If it was easy, everyone would do it.', 'Unknown', 'Reality'),
('Stay hard.', 'David Goggins', 'Mental Strength'),
('One year from now you will wish you started today.', 'Unknown', 'Urgency'),
('Small daily improvements are the key to staggering long-term results.', 'Robin Sharma', 'Consistency');

-- =====================================================
-- FINAL CHECK
-- =====================================================
-- SHOW TABLES;
-- SELECT * FROM users;
-- SELECT * FROM habits;
-- SELECT * FROM habit_log;
-- SELECT * FROM quotes;
-- SELECT * FROM pomodoro_sessions;
-- SELECT * FROM stress_log;
-- SELECT * FROM tasks;
-- SELECT * FROM timetable_slots;
