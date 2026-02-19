-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_date TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT,
    time TEXT,
    location TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create index on event_date for faster queries
CREATE INDEX IF NOT EXISTS idx_event_date ON events(event_date);

-- Insert existing events from script.js
INSERT INTO events (event_date, category, title, time, location) VALUES
('2026-1-13', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-1-15', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-1-20', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-1-22', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-1-27', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-1-29', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-2-3', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-2-5', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-2-10', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-2-12', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-2-17', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-2-19', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-2-24', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-2-26', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-3-3', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-3-5', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-3-10', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-3-12', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-3-17', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-3-19', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-3-20', 'FIRST', 'FIRST Competition', 'All Day', 'Appleton East High School'),
('2026-3-21', 'FIRST', 'FIRST Competition', 'All Day', 'Appleton East High School'),
('2026-3-22', 'FIRST', 'FIRST Competition', 'All Day', 'Appleton East High School'),
('2026-3-24', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-3-26', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-3-31', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-4-2', 'FIRST', 'Seven Rivers Event', 'All Day', 'La Crosse Center, 300 Harborview Plaza, La Crosse, WI'),
('2026-4-3', 'FIRST', 'Seven Rivers Event', 'All Day', 'La Crosse Center, 300 Harborview Plaza, La Crosse, WI'),
('2026-4-4', 'FIRST', 'Seven Rivers Event', 'All Day', 'La Crosse Center, 300 Harborview Plaza, La Crosse, WI'),
('2026-4-7', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-4-9', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-4-14', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-4-16', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-4-21', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-4-23', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-4-28', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-4-30', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-5-5', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-5-7', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-5-12', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-5-14', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-5-19', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-5-21', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-5-26', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School'),
('2026-5-28', 'Robotics', 'Team Meeting', '4:00 PM - 8:00 PM', 'Room 196 @ Logan High School');

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_notes_created ON notes(created_at DESC);

-- Create deleted notes archive table
CREATE TABLE IF NOT EXISTS deleted_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_id INTEGER,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create index on deleted_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_deleted_notes_deleted ON deleted_notes(deleted_at DESC);
