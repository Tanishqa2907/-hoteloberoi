const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'hotel.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    // Create Rooms table
    db.run(`CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY,
    type TEXT CHECK(type IN ('non-ac', 'ac', 'premium')),
    price INTEGER,
    isOccupied INTEGER DEFAULT 0
  )`);

    // Create Guests table
    db.run(`CREATE TABLE IF NOT EXISTS guests (
    id TEXT PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    contact TEXT,
    email TEXT,
    roomId INTEGER,
    checkInDate TEXT,
    numberOfDays INTEGER,
    totalBill INTEGER,
    status TEXT DEFAULT 'active',
    FOREIGN KEY(roomId) REFERENCES rooms(id)
  )`);

    // Seed Rooms if empty
    db.get("SELECT count(*) as count FROM rooms", [], (err, row) => {
        if (err) return console.error(err.message);
        if (row.count === 0) {
            console.log('Seeding rooms...');
            const stmt = db.prepare("INSERT INTO rooms (id, type, price, isOccupied) VALUES (?, ?, ?, ?)");

            // Rooms 1-5: Non-AC
            for (let i = 1; i <= 5; i++) {
                stmt.run(i, 'non-ac', 2000, 0);
            }
            // Rooms 6-10: AC
            for (let i = 6; i <= 10; i++) {
                stmt.run(i, 'ac', 2500, 0);
            }
            // Rooms 11-15: Premium
            for (let i = 11; i <= 15; i++) {
                stmt.run(i, 'premium', 3000, 0);
            }

            stmt.finalize();
            console.log('Rooms seeded successfully.');
        }
    });
});

module.exports = db;
