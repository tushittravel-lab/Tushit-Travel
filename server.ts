import express from "express";
import { createServer as createViteServer } from "vite";
//import Database from "better-sqlite3";//
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//const db = new Database("tushit_travel.db");

// Initialize database
//db.exec(`
 // CREATE TABLE IF NOT EXISTS fleet (
   // id INTEGER PRIMARY KEY AUTOINCREMENT,
    //name TEXT NOT NULL,
    //car_number TEXT,
    //category TEXT NOT NULL,
    //capacity INTEGER NOT NULL,
    //luggage INTEGER NOT NULL,
    //price_per_km REAL NOT NULL,
    //image_url TEXT NOT NULL,
    //status TEXT DEFAULT 'available',
    //image_front TEXT,
    //image_side TEXT,
    //image_interior TEXT,
    //image_seats TEXT,
    //image_boot TEXT,
    //has_ac INTEGER DEFAULT 1,
    //fuel_type TEXT DEFAULT 'Diesel',
    //transmission TEXT DEFAULT 'Manual',
    //driver_included INTEGER DEFAULT 1,
    //price_per_day REAL DEFAULT 0,
    //price_per_hour REAL DEFAULT 0,
    //best_use TEXT,
    //features TEXT,
    //driver_details TEXT
  //);

  //CREATE TABLE IF NOT EXISTS bookings (
    //id INTEGER PRIMARY KEY AUTOINCREMENT,
    //trip_type TEXT NOT NULL,
    //pickup_location TEXT NOT NULL,
    //drop_location TEXT,
    //pickup_date TEXT NOT NULL,
    //pickup_time TEXT NOT NULL,
    //passengers INTEGER NOT NULL,
    //car_id INTEGER,
    //customer_name TEXT,
    //customer_email TEXT,
    //customer_phone TEXT,
    //status TEXT DEFAULT 'pending',
    //created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    //FOREIGN KEY(car_id) REFERENCES fleet(id)
  //);

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    total_bookings INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(car_id) REFERENCES fleet(id)
  );
`);

// Migration: Add new columns to fleet if they don't exist
const migrations = [
  "ALTER TABLE fleet ADD COLUMN car_number TEXT;",
  "ALTER TABLE fleet ADD COLUMN image_front TEXT;",
  "ALTER TABLE fleet ADD COLUMN image_side TEXT;",
  "ALTER TABLE fleet ADD COLUMN image_interior TEXT;",
  "ALTER TABLE fleet ADD COLUMN image_seats TEXT;",
  "ALTER TABLE fleet ADD COLUMN image_boot TEXT;",
  "ALTER TABLE fleet ADD COLUMN has_ac INTEGER DEFAULT 1;",
  "ALTER TABLE fleet ADD COLUMN fuel_type TEXT DEFAULT 'Diesel';",
  "ALTER TABLE fleet ADD COLUMN transmission TEXT DEFAULT 'Manual';",
  "ALTER TABLE fleet ADD COLUMN driver_included INTEGER DEFAULT 1;",
  "ALTER TABLE fleet ADD COLUMN price_per_day REAL DEFAULT 0;",
  "ALTER TABLE fleet ADD COLUMN price_per_hour REAL DEFAULT 0;",
  "ALTER TABLE fleet ADD COLUMN best_use TEXT;",
  "ALTER TABLE fleet ADD COLUMN features TEXT;",
  "ALTER TABLE fleet ADD COLUMN driver_details TEXT;"
];

for (const sql of migrations) {
  try {
    db.exec(sql);
  } catch (e) {
    // Column likely already exists
  }
}

// Seed initial data if empty
const fleetCount = db.prepare("SELECT COUNT(*) as count FROM fleet").get() as { count: number };
if (fleetCount.count === 0) {
  const insertFleet = db.prepare("INSERT INTO fleet (name, category, capacity, luggage, price_per_km, image_url) VALUES (?, ?, ?, ?, ?, ?)");
  insertFleet.run("Premium Sedan", "Sedan", 4, 2, 12.5, "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80");
  insertFleet.run("Luxury SUV", "SUV", 7, 4, 18.0, "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80");
  insertFleet.run("Executive Minivan", "MUV", 6, 3, 15.0, "https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&w=800&q=80");
}

// Seed default settings
const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  const insertSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
  insertSetting.run("site_name", "Tushit Travel");
  insertSetting.run("contact_email", "tushittravel@gmail.com");
  insertSetting.run("contact_phone", "+91 9876543210");
  insertSetting.run("whatsapp_number", "919074444467");
  insertSetting.run("maintenance_mode", "false");
}

// Seed default admin
const adminCount = db.prepare("SELECT COUNT(*) as count FROM admins").get() as { count: number };
if (adminCount.count === 0) {
  db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)").run("admin", "admin");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get("/api/fleet", (req, res) => {
    console.log(`[API] GET /api/fleet from ${req.ip}`);
    try {
      const fleet = db.prepare(`
        SELECT f.*, 
               AVG(r.rating) as avg_rating, 
               COUNT(r.id) as review_count
        FROM fleet f
        LEFT JOIN ratings r ON f.id = r.car_id
        GROUP BY f.id
      `).all();
      res.json(fleet);
    } catch (error) {
      console.error("[API] Error fetching fleet:", error);
      res.status(500).json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/availability", (req, res) => {
    console.log(`[API] GET /api/availability from ${req.ip}`);
    try {
      const total = db.prepare("SELECT COUNT(*) as count FROM fleet").get() as { count: number };
      const available = db.prepare("SELECT COUNT(*) as count FROM fleet WHERE status = 'available'").get() as { count: number };
      const onTrip = db.prepare("SELECT COUNT(*) as count FROM fleet WHERE status = 'on-trip'").get() as { count: number };
      res.json({
        total: total.count,
        available: available.count,
        onTrip: onTrip.count
      });
    } catch (error) {
      console.error("[API] Error fetching availability:", error);
      res.status(500).json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post("/api/bookings", (req, res) => {
    console.log("[API] POST /api/bookings", req.body);
    const { tripType, pickup, drop, date, time, passengers, carId, customerName, customerEmail, customerPhone } = req.body;
    try {
      // Create or update customer
      if (customerEmail) {
        const existingCustomer = db.prepare("SELECT * FROM customers WHERE email = ?").get(customerEmail) as any;
        if (existingCustomer) {
          db.prepare("UPDATE customers SET total_bookings = total_bookings + 1, name = ?, phone = ? WHERE id = ?").run(customerName, customerPhone, existingCustomer.id);
        } else {
          db.prepare("INSERT INTO customers (name, email, phone, total_bookings) VALUES (?, ?, ?, 1)").run(customerName, customerEmail, customerPhone);
        }
      }

      const info = db.prepare(`
        INSERT INTO bookings (trip_type, pickup_location, drop_location, pickup_date, pickup_time, passengers, car_id, customer_name, customer_email, customer_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(tripType, pickup, drop, date, time, passengers, carId || null, customerName, customerEmail, customerPhone);
      res.json({ success: true, bookingId: info.lastInsertRowid });
    } catch (error) {
      console.error("[API] Error creating booking:", error);
      res.status(500).json({ error: "Failed to create booking", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/ratings/:carId", (req, res) => {
    const { carId } = req.params;
    try {
      const ratings = db.prepare("SELECT * FROM ratings WHERE car_id = ? ORDER BY created_at DESC").all(carId);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ratings" });
    }
  });

  app.post("/api/ratings", (req, res) => {
    const { carId, customerName, rating, comment } = req.body;
    try {
      const info = db.prepare("INSERT INTO ratings (car_id, customer_name, rating, comment) VALUES (?, ?, ?, ?)").run(carId, customerName, rating, comment);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit rating" });
    }
  });

  app.patch("/api/ratings/:id", (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    try {
      db.prepare("UPDATE ratings SET rating = ?, comment = ? WHERE id = ?").run(rating, comment, id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update rating" });
    }
  });

  app.delete("/api/ratings/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM ratings WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete rating" });
    }
  });

  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    try {
      const admin = db.prepare("SELECT * FROM admins WHERE username = ? AND password = ?").get(username, password);
      if (admin) {
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/admin/bookings", (req, res) => {
    const bookings = db.prepare(`
      SELECT b.*, f.name as car_name 
      FROM bookings b 
      LEFT JOIN fleet f ON b.car_id = f.id 
      ORDER BY b.created_at DESC
    `).all();
    res.json(bookings);
  });

  app.patch("/api/admin/bookings/:id", (req, res) => {
    const { id } = req.params;
    const { status, customer_name, customer_phone, pickup_location, drop_location, pickup_date, pickup_time } = req.body;
    try {
      if (status && Object.keys(req.body).length === 1) {
        db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, id);
      } else {
        db.prepare(`
          UPDATE bookings 
          SET customer_name = ?, customer_phone = ?, pickup_location = ?, drop_location = ?, pickup_date = ?, pickup_time = ?, status = ?
          WHERE id = ?
        `).run(customer_name, customer_phone, pickup_location, drop_location, pickup_date, pickup_time, status, id);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.delete("/api/admin/bookings/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM bookings WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete booking" });
    }
  });

  app.post("/api/admin/fleet", (req, res) => {
    const { 
      name, car_number, category, capacity, luggage, price_per_km, image_url, status,
      image_front, image_side, image_interior, image_seats, image_boot,
      has_ac, fuel_type, transmission, driver_included,
      price_per_day, price_per_hour, best_use, features, driver_details
    } = req.body;
    try {
      const info = db.prepare(`
        INSERT INTO fleet (
          name, car_number, category, capacity, luggage, price_per_km, image_url, status,
          image_front, image_side, image_interior, image_seats, image_boot,
          has_ac, fuel_type, transmission, driver_included,
          price_per_day, price_per_hour, best_use, features, driver_details
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        name, car_number || '', category, capacity, luggage, price_per_km, image_url, status || 'available',
        image_front || '', image_side || '', image_interior || '', image_seats || '', image_boot || '',
        has_ac ? 1 : 0, fuel_type || 'Diesel', transmission || 'Manual', driver_included ? 1 : 0,
        price_per_day || 0, price_per_hour || 0, best_use || '', features || '', driver_details || ''
      );
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      res.status(500).json({ error: "Failed to add vehicle" });
    }
  });

  app.patch("/api/admin/fleet/:id", (req, res) => {
    const { id } = req.params;
    const { 
      name, car_number, category, capacity, luggage, price_per_km, image_url, status,
      image_front, image_side, image_interior, image_seats, image_boot,
      has_ac, fuel_type, transmission, driver_included,
      price_per_day, price_per_hour, best_use, features, driver_details
    } = req.body;
    try {
      db.prepare(`
        UPDATE fleet 
        SET name = ?, car_number = ?, category = ?, capacity = ?, luggage = ?, price_per_km = ?, image_url = ?, status = ?,
            image_front = ?, image_side = ?, image_interior = ?, image_seats = ?, image_boot = ?,
            has_ac = ?, fuel_type = ?, transmission = ?, driver_included = ?,
            price_per_day = ?, price_per_hour = ?, best_use = ?, features = ?, driver_details = ?
        WHERE id = ?
      `).run(
        name, car_number || '', category, capacity, luggage, price_per_km, image_url, status,
        image_front || '', image_side || '', image_interior || '', image_seats || '', image_boot || '',
        has_ac ? 1 : 0, fuel_type || 'Diesel', transmission || 'Manual', driver_included ? 1 : 0,
        price_per_day || 0, price_per_hour || 0, best_use || '', features || '', driver_details || '',
        id
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(500).json({ error: "Failed to update vehicle" });
    }
  });

  app.delete("/api/admin/fleet/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM fleet WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });

  // Customers API
  app.get("/api/admin/customers", (req, res) => {
    try {
      const customers = db.prepare("SELECT * FROM customers ORDER BY created_at DESC").all();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.patch("/api/admin/customers/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    try {
      db.prepare("UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?").run(name, email, phone, id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update customer" });
    }
  });

  app.delete("/api/admin/customers/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM customers WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });

  app.get("/api/admin/stats", (req, res) => {
    try {
      const totalBookings = db.prepare("SELECT COUNT(*) as count FROM bookings").get() as any;
      const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM customers").get() as any;
      const fleetStats = db.prepare("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available FROM fleet").get() as any;
      const activeBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status IN ('pending', 'confirmed')").get() as any;
      
      res.json({
        bookings: totalBookings.count,
        customers: totalCustomers.count,
        fleet: fleetStats,
        activeBookings: activeBookings.count
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Settings API
  app.get("/api/admin/settings", (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM settings").all();
      const settingsObj = settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      res.json(settingsObj);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.patch("/api/admin/settings", (req, res) => {
    const settings = req.body;
    try {
      const updateSetting = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
      const transaction = db.transaction((settingsData) => {
        for (const [key, value] of Object.entries(settingsData)) {
          updateSetting.run(key, String(value));
        }
      });
      transaction(settings);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Catch-all for API routes to prevent falling through to SPA fallback
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
