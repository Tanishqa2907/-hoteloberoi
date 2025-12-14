const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'http://localhost:8080'
    : '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all rooms with their status
app.get('/api/rooms', (req, res) => {
    db.all("SELECT * FROM rooms ORDER BY id", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows.map(room => ({
            ...room,
            isOccupied: Boolean(room.isOccupied)
        })));
    });
});

// Get all active guests
app.get('/api/guests', (req, res) => {
    db.all("SELECT * FROM guests WHERE status = 'active'", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows.map(guest => ({
            ...guest,
            checkInDate: new Date(guest.checkInDate)
        })));
    });
});

// Get statistics
app.get('/api/stats', (req, res) => {
    db.all("SELECT * FROM rooms", [], (err, rooms) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.all("SELECT * FROM guests WHERE status = 'active'", [], (err, guests) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const totalRooms = rooms.length;
            const occupiedRooms = rooms.filter(r => r.isOccupied).length;
            const availableRooms = totalRooms - occupiedRooms;
            const totalGuests = guests.length;
            const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

            res.json({
                totalRooms,
                occupiedRooms,
                availableRooms,
                totalGuests,
                occupancyRate
            });
        });
    });
});

// Validation helper
function validateBookingData(data) {
    const errors = [];
    
    if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters');
    }
    if (!data.lastName || typeof data.lastName !== 'string' || data.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters');
    }
    if (!data.contact || typeof data.contact !== 'string' || data.contact.trim().length < 10) {
        errors.push('Contact number must be at least 10 characters');
    }
    if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
        errors.push('Valid email is required');
    }
    if (!data.roomId || typeof data.roomId !== 'number' || data.roomId < 1) {
        errors.push('Valid room ID is required');
    }
    if (!data.checkInDate) {
        errors.push('Check-in date is required');
    }
    if (!data.numberOfDays || typeof data.numberOfDays !== 'number' || data.numberOfDays < 1 || data.numberOfDays > 365) {
        errors.push('Number of days must be between 1 and 365');
    }
    
    return errors;
}

// Check-in (Create booking)
app.post('/api/bookings', (req, res) => {
    const { firstName, lastName, contact, email, roomId, checkInDate, numberOfDays } = req.body;

    // Validate input
    const validationErrors = validateBookingData(req.body);
    if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors.join(', ') });
    }

    // Validate room availability
    db.get("SELECT * FROM rooms WHERE id = ?", [roomId], (err, room) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        if (room.isOccupied) {
            return res.status(400).json({ error: 'Room is already occupied' });
        }

        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Insert guest
        db.run(
            `INSERT INTO guests (id, firstName, lastName, contact, email, roomId, checkInDate, numberOfDays, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
            [guestId, firstName, lastName, contact, email, roomId, checkInDate, numberOfDays],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                // Mark room as occupied
                db.run("UPDATE rooms SET isOccupied = 1 WHERE id = ?", [roomId], (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    res.json({
                        success: true,
                        message: 'Check-in successful',
                        guest: {
                            id: guestId,
                            firstName,
                            lastName,
                            contact,
                            email,
                            roomId,
                            checkInDate: new Date(checkInDate),
                            numberOfDays
                        }
                    });
                });
            }
        );
    });
});

// Check-out
app.post('/api/checkout/:roomId', (req, res) => {
    const roomId = parseInt(req.params.roomId);
    
    if (isNaN(roomId) || roomId < 1) {
        return res.status(400).json({ error: 'Invalid room ID' });
    }

    // Get guest and room info
    db.get("SELECT * FROM guests WHERE roomId = ? AND status = 'active'", [roomId], (err, guest) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!guest) {
            return res.status(404).json({ error: 'No active guest found in this room' });
        }

        db.get("SELECT * FROM rooms WHERE id = ?", [roomId], (err, room) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const GST_RATE = 0.12;
            const baseAmount = room.price * guest.numberOfDays;
            const gstAmount = baseAmount * GST_RATE;
            const totalBill = baseAmount + gstAmount;

            const roomTypeMap = {
                'non-ac': 'Standard',
                'ac': 'Deluxe',
                'premium': 'Premium Suite'
            };

            const billDetails = {
                guestName: `${guest.firstName} ${guest.lastName}`,
                roomId: room.id,
                roomType: roomTypeMap[room.type],
                pricePerDay: room.price,
                numberOfDays: guest.numberOfDays,
                baseAmount,
                gstAmount,
                gstRate: GST_RATE * 100,
                totalBill,
                checkInDate: guest.checkInDate
            };

            // Update guest status and bill
            db.run(
                "UPDATE guests SET status = 'checked-out', totalBill = ? WHERE id = ?",
                [totalBill, guest.id],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    // Mark room as available
                    db.run("UPDATE rooms SET isOccupied = 0 WHERE id = ?", [roomId], (err) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        res.json({
                            success: true,
                            message: 'Check-out successful',
                            billDetails
                        });
                    });
                }
            );
        });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${NODE_ENV}`);
    console.log(`💾 Database: Connected`);
});
