require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "habit_tracker",
});

db.connect((err) => {
  if (err) {
    console.error("DB Connection Failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

function asPositiveInt(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function isValidDateTime(value) {
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(String(value || ""));
}

function isValidTime(value) {
  return /^\d{2}:\d{2}(:\d{2})?$/.test(String(value || ""));
}

async function ensureUserExists(userId) {
  const rows = await query("SELECT user_id FROM users WHERE user_id = ? LIMIT 1", [userId]);
  return rows.length > 0;
}

function sendDbError(res, err) {
  console.error(err);
  res.status(500).json({ error: err.message });
}

app.use(express.static(path.join(__dirname, "../FrontEnd/html")));
app.use(express.static(path.join(__dirname, "../FrontEnd")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../FrontEnd/html/WebDev.html"));
});

app.get("/api", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/quotes/random", async (req, res) => {
  try {
    const results = await query(
      "SELECT quote_id, quote_text, author, category FROM quotes WHERE is_active = 1 ORDER BY RAND() LIMIT 1"
    );
    if (!results.length) {
      return res.status(404).json({ message: "No quotes found" });
    }
    res.json(results[0]);
  } catch (err) {
    sendDbError(res, err);
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)",
      [String(full_name).trim(), String(email).trim(), hashedPassword]
    );

    res.json({ message: "User created successfully", user_id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }
    sendDbError(res, err);
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email/password" });
    }

    const results = await query("SELECT * FROM users WHERE email = ? LIMIT 1", [String(email).trim()]);
    if (!results.length) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
    });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.get("/api/todos/:userId", async (req, res) => {
  try {
    const userId = asPositiveInt(req.params.userId);
    if (!userId) return res.status(400).json({ message: "Invalid user_id" });

    const rows = await query(
      `SELECT
        task_id AS todo_id,
        title AS task_text,
        CASE WHEN status = 'DONE' THEN 1 ELSE 0 END AS is_done,
        created_at
      FROM tasks
      WHERE user_id = ?
      ORDER BY created_at DESC, task_id DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    sendDbError(res, err);
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const userId = asPositiveInt(req.body.user_id);
    const taskText = String(req.body.task_text || "").trim();
    const isDone = Number(req.body.is_done) === 1 ? "DONE" : "PENDING";

    if (!userId || !taskText) {
      return res.status(400).json({ message: "Missing user_id or task_text" });
    }
    if (!(await ensureUserExists(userId))) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await query(
      "INSERT INTO tasks (user_id, title, status) VALUES (?, ?, ?)",
      [userId, taskText, isDone]
    );

    res.json({ message: "Todo created", todo_id: result.insertId });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.patch("/api/todos/:todoId", async (req, res) => {
  try {
    const todoId = asPositiveInt(req.params.todoId);
    const userId = asPositiveInt(req.body.user_id);
    const fields = [];
    const params = [];

    if (!todoId || !userId) {
      return res.status(400).json({ message: "Invalid todo_id or user_id" });
    }

    if (typeof req.body.task_text !== "undefined") {
      const taskText = String(req.body.task_text || "").trim();
      if (!taskText) return res.status(400).json({ message: "task_text cannot be empty" });
      fields.push("title = ?");
      params.push(taskText);
    }

    if (typeof req.body.is_done !== "undefined") {
      fields.push("status = ?");
      params.push(Number(req.body.is_done) === 1 ? "DONE" : "PENDING");
    }

    if (!fields.length) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    params.push(todoId, userId);
    const result = await query(
      `UPDATE tasks
       SET ${fields.join(", ")}
       WHERE task_id = ? AND user_id = ?`,
      params
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo updated" });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.delete("/api/todos/:userId/clear-done", async (req, res) => {
  try {
    const userId = asPositiveInt(req.params.userId);
    if (!userId) return res.status(400).json({ message: "Invalid user_id" });

    await query("DELETE FROM tasks WHERE user_id = ? AND status = 'DONE'", [userId]);
    res.json({ message: "Done todos cleared" });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.delete("/api/todos/:todoId", async (req, res) => {
  try {
    const todoId = asPositiveInt(req.params.todoId);
    const userId = asPositiveInt(req.body.user_id);
    if (!todoId || !userId) {
      return res.status(400).json({ message: "Invalid todo_id or user_id" });
    }

    const result = await query("DELETE FROM tasks WHERE task_id = ? AND user_id = ?", [todoId, userId]);
    if (!result.affectedRows) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.get("/api/habits/:userId", async (req, res) => {
  try {
    const userId = asPositiveInt(req.params.userId);
    if (!userId) return res.status(400).json({ message: "Invalid user_id" });

    const rows = await query(
      `SELECT habit_id, user_id, habit_name, description, frequency, is_active, created_at
       FROM habits
       WHERE user_id = ? AND is_active = 1
       ORDER BY created_at ASC, habit_id ASC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    sendDbError(res, err);
  }
});

app.post("/api/habits", async (req, res) => {
  try {
    const userId = asPositiveInt(req.body.user_id);
    const habitName = String(req.body.habit_name || "").trim();
    const description = req.body.description ? String(req.body.description).trim() : null;
    const frequency = ["Daily", "Weekly", "Monthly"].includes(req.body.frequency) ? req.body.frequency : "Daily";

    if (!userId || !habitName) {
      return res.status(400).json({ message: "Missing user_id or habit_name" });
    }

    const result = await query(
      "INSERT INTO habits (user_id, habit_name, description, frequency) VALUES (?, ?, ?, ?)",
      [userId, habitName, description, frequency]
    );

    res.json({ message: "Habit created", habit_id: result.insertId });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.delete("/api/habits/:habitId", async (req, res) => {
  try {
    const habitId = asPositiveInt(req.params.habitId);
    const userId = asPositiveInt(req.body.user_id);
    if (!habitId || !userId) {
      return res.status(400).json({ message: "Invalid habit_id or user_id" });
    }

    const result = await query("DELETE FROM habits WHERE habit_id = ? AND user_id = ?", [habitId, userId]);
    if (!result.affectedRows) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json({ message: "Habit deleted" });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.patch("/api/habits/:habitId", async (req, res) => {
  try {
    const habitId = asPositiveInt(req.params.habitId);
    const userId = asPositiveInt(req.body.user_id);
    const habitName = String(req.body.habit_name || "").trim();

    if (!habitId || !userId || !habitName) {
      return res.status(400).json({ message: "Invalid habit update payload" });
    }

    const result = await query(
      "UPDATE habits SET habit_name = ? WHERE habit_id = ? AND user_id = ?",
      [habitName, habitId, userId]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json({ message: "Habit renamed" });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.get("/api/habits/log/:userId", async (req, res) => {
  try {
    const userId = asPositiveInt(req.params.userId);
    if (!userId) return res.status(400).json({ message: "Invalid user_id" });

    const rows = await query(
      `SELECT hl.log_id, hl.habit_id, hl.log_date, hl.status, hl.notes
       FROM habit_log hl
       INNER JOIN habits h ON h.habit_id = hl.habit_id
       WHERE h.user_id = ?
       ORDER BY hl.log_date ASC, hl.log_id ASC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    sendDbError(res, err);
  }
});

app.post("/api/habits/log", async (req, res) => {
  try {
    const habitId = asPositiveInt(req.body.habit_id);
    const logDate = String(req.body.log_date || "").trim();
    const status = req.body.status === "MISSED" ? "MISSED" : "DONE";
    const notes = req.body.notes ? String(req.body.notes).trim() : null;

    if (!habitId || !isValidDate(logDate)) {
      return res.status(400).json({ message: "Invalid habit log payload" });
    }

    await query(
      `INSERT INTO habit_log (habit_id, log_date, status, notes)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status), notes = VALUES(notes)`,
      [habitId, logDate, status, notes]
    );

    res.json({ message: "Habit log saved" });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.get("/api/timetable/:userId", async (req, res) => {
  try {
    const userId = asPositiveInt(req.params.userId);
    if (!userId) return res.status(400).json({ message: "Invalid user_id" });

    const rows = await query(
      `SELECT slot_id, user_id, day_of_week, start_time, end_time, subject, location, type
       FROM timetable_slots
       WHERE user_id = ?
       ORDER BY FIELD(day_of_week, 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'), start_time ASC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    sendDbError(res, err);
  }
});

app.post("/api/timetable", async (req, res) => {
  try {
    const userId = asPositiveInt(req.body.user_id);
    const dayOfWeek = String(req.body.day_of_week || "");
    const startTime = String(req.body.start_time || "").trim();
    const endTime = String(req.body.end_time || "").trim();
    const subject = String(req.body.subject || "").trim();

    if (
      !userId ||
      !["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(dayOfWeek) ||
      !isValidTime(startTime) ||
      !isValidTime(endTime) ||
      !subject
    ) {
      return res.status(400).json({ message: "Invalid timetable payload" });
    }

    await query(
      "DELETE FROM timetable_slots WHERE user_id = ? AND day_of_week = ? AND start_time = ?",
      [userId, dayOfWeek, startTime]
    );

    const result = await query(
      `INSERT INTO timetable_slots (user_id, day_of_week, start_time, end_time, subject, type)
       VALUES (?, ?, ?, ?, ?, 'CLASS')`,
      [userId, dayOfWeek, startTime, endTime, subject]
    );

    res.json({ message: "Timetable slot saved", slot_id: result.insertId });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.delete("/api/timetable", async (req, res) => {
  try {
    const userId = asPositiveInt(req.body.user_id);
    const dayOfWeek = String(req.body.day_of_week || "");
    const startTime = String(req.body.start_time || "").trim();

    if (!userId || !["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(dayOfWeek) || !isValidTime(startTime)) {
      return res.status(400).json({ message: "Invalid timetable delete payload" });
    }

    await query(
      "DELETE FROM timetable_slots WHERE user_id = ? AND day_of_week = ? AND start_time = ?",
      [userId, dayOfWeek, startTime]
    );

    res.json({ message: "Timetable slot deleted" });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.post("/api/stress", async (req, res) => {
  try {
    const userId = asPositiveInt(req.body.user_id);
    const stressLevel = Number(req.body.stress_level);
    const mood = req.body.mood ? String(req.body.mood).trim() : null;
    const triggerNote = req.body.trigger_note ? String(req.body.trigger_note).trim() : null;
    const copingAction = req.body.coping_action ? String(req.body.coping_action).trim() : null;
    const outcomeNote = req.body.outcome_note ? String(req.body.outcome_note).trim() : null;

    if (!userId || !Number.isFinite(stressLevel) || stressLevel < 1 || stressLevel > 10) {
      return res.status(400).json({ message: "Invalid stress log payload" });
    }

    const result = await query(
      `INSERT INTO stress_log (user_id, stress_level, mood, trigger_note, coping_action, outcome_note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, Math.round(stressLevel), mood, triggerNote, copingAction, outcomeNote]
    );

    res.json({ message: "Stress saved", stress_id: result.insertId });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.post("/api/pomodoro", async (req, res) => {
  try {
    const userId = asPositiveInt(req.body.user_id);
    const sessionStart = String(req.body.session_start || "").trim();
    const sessionEnd = String(req.body.session_end || "").trim();
    const durationMinutes = Number(req.body.duration_minutes);
    const sessionType = ["FOCUS", "SHORT_BREAK", "LONG_BREAK"].includes(req.body.session_type)
      ? req.body.session_type
      : "FOCUS";
    const completed = Number(req.body.completed) === 0 ? 0 : 1;

    if (
      !userId ||
      !isValidDateTime(sessionStart) ||
      !isValidDateTime(sessionEnd) ||
      !Number.isFinite(durationMinutes) ||
      durationMinutes < 0
    ) {
      return res.status(400).json({ message: "Invalid pomodoro payload" });
    }

    const result = await query(
      `INSERT INTO pomodoro_sessions
        (user_id, session_start, session_end, duration_minutes, session_type, completed)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, sessionStart, sessionEnd, Math.round(durationMinutes), sessionType, completed]
    );

    res.json({ message: "Pomodoro session saved", session_id: result.insertId });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.get("/api/pomodoro/today/:userId", async (req, res) => {
  try {
    const userId = asPositiveInt(req.params.userId);
    if (!userId) return res.status(400).json({ message: "Invalid user_id" });

    const rows = await query(
      `SELECT
        COALESCE(SUM(CASE WHEN session_type = 'FOCUS' AND completed = 1 THEN duration_minutes ELSE 0 END), 0) AS minutes_today,
        COALESCE(SUM(CASE WHEN session_type = 'FOCUS' AND completed = 1 THEN 1 ELSE 0 END), 0) AS sessions_today,
        COALESCE(SUM(CASE WHEN session_type <> 'FOCUS' AND completed = 1 THEN 1 ELSE 0 END), 0) AS breaks_today
      FROM pomodoro_sessions
      WHERE user_id = ? AND DATE(session_start) = CURDATE()`,
      [userId]
    );

    res.json(rows[0] || { minutes_today: 0, sessions_today: 0, breaks_today: 0 });
  } catch (err) {
    sendDbError(res, err);
  }
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: `${req.method} ${req.path}`,
  });
});

const PORT = Number(process.env.PORT) || 5050;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
