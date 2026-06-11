USE habit_tracker;

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id INT NOT NULL,
    preference_key VARCHAR(80) NOT NULL,
    preference_value JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, preference_key),
    CONSTRAINT fk_preferences_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS calendar_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_date DATE NOT NULL,
    item_type ENUM('note','task') NOT NULL,
    item_text VARCHAR(240) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_calendar_user_date (user_id, item_date),
    CONSTRAINT fk_calendar_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE
);
