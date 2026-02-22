import sqlite3

DB_NAME = "devbrain.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_message TEXT,
            ai_response TEXT,
            timestamp TEXT
        )
    """)

    conn.commit()
    conn.close()

def save_message(user_message, ai_response, timestamp):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO conversations (user_message, ai_response, timestamp)
        VALUES (?, ?, ?)
    """, (user_message, ai_response, timestamp))

    conn.commit()
    conn.close()

def fetch_history():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM conversations ORDER BY id DESC")
    rows = cursor.fetchall()

    conn.close()
    return rows