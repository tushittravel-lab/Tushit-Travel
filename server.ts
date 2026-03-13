import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import mongoose, { Schema, model } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NOTE: Previous SQLite schema & migrations are intentionally preserved below,
// but fully commented out as requested during the MongoDB migration.
// Do NOT delete this block.
/*
import Database from "better-sqlite3";
const db = new Database("tushit_travel.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS fleet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    car_number TEXT,
    category TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    luggage INTEGER NOT NULL,
    price_per_km REAL NOT NULL,
    image_url TEXT NOT NULL,
    status TEXT DEFAULT 'available',
    image_front TEXT,
    image_side TEXT,
    image_interior TEXT,
    image_seats TEXT,
    image_boot TEXT,
    has_ac INTEGER DEFAULT 1,
    fuel_type TEXT DEFAULT 'Diesel',
    transmission TEXT DEFAULT 'Manual',
    driver_included INTEGER DEFAULT 1,
    price_per_day REAL DEFAULT 0,
    price_per_hour REAL DEFAULT 0,
    best_use TEXT,
    features TEXT,
    driver_details TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_type TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    drop_location TEXT,
    pickup_date TEXT NOT NULL,
    pickup_time TEXT NOT NULL,
    passengers INTEGER NOT NULL,
    car_id INTEGER,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(car_id) REFERENCES fleet(id)
  );

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
*/

// --- Mongoose Schemas ---

const FleetSchema = new Schema(
  {
    name: { type: String, required: true },
    car_number: String,
    category: { type: String, required: true },
    capacity: { type: Number, required: true },
    luggage: { type: Number, required: true },
    price_per_km: { type: Number, required: true },
    image_url: { type: String, required: true },
    status: { type: String, default: "available" },
    image_front: String,
    image_side: String,
    image_interior: String,
    image_seats: String,
    image_boot: String,
    has_ac: { type: Boolean, default: true },
    fuel_type: { type: String, default: "Diesel" },
    transmission: { type: String, default: "Manual" },
    driver_included: { type: Boolean, default: true },
    price_per_day: { type: Number, default: 0 },
    price_per_hour: { type: Number, default: 0 },
    best_use: String,
    features: String,
    driver_details: String,
  },
  { timestamps: true }
);

const BookingSchema = new Schema(
  {
    trip_type: { type: String, required: true },
    pickup_location: { type: String, required: true },
    drop_location: String,
    pickup_date: { type: String, required: true },
    pickup_time: { type: String, required: true },
    passengers: { type: Number, required: true },
    car: { type: Schema.Types.ObjectId, ref: "Fleet" },
    customer_name: String,
    customer_email: String,
    customer_phone: String,
    status: { type: String, default: "pending" },
    // extra fields from booking form
    return_date: String,
    duration: Number,
    tour_type: String,
    flight_number: String,
    instructions: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    total_bookings: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const SettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const RatingSchema = new Schema(
  {
    car: { type: Schema.Types.ObjectId, ref: "Fleet", required: true },
    customer_name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const InquirySchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Fleet = model("Fleet", FleetSchema);
const Booking = model("Booking", BookingSchema);
const Customer = model("Customer", CustomerSchema);
const Setting = model("Setting", SettingSchema);
const Admin = model("Admin", AdminSchema);
const Rating = model("Rating", RatingSchema);
const Inquiry = model("Inquiry", InquirySchema);

async function seedInitialData() {
  // Seed fleet if empty
  const fleetCount = await Fleet.countDocuments();
  if (fleetCount === 0) {
    await Fleet.insertMany([
      {
        name: "Premium Sedan",
        category: "Sedan",
        capacity: 4,
        luggage: 2,
        price_per_km: 12.5,
        image_url:
          "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80",
        status: "available",
      },
      {
        name: "Luxury SUV",
        category: "SUV",
        capacity: 7,
        luggage: 4,
        price_per_km: 18.0,
        image_url:
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
        status: "available",
      },
      {
        name: "Executive Minivan",
        category: "MUV",
        capacity: 6,
        luggage: 3,
        price_per_km: 15.0,
        image_url:
          "https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&w=800&q=80",
        status: "available",
      },
    ]);
  }

  // Seed default settings
  const settingsCount = await Setting.countDocuments();
  if (settingsCount === 0) {
    await Setting.insertMany([
      { key: "site_name", value: "Tushit Travel" },
      { key: "contact_email", value: "tushittravel@gmail.com" },
      { key: "contact_phone", value: "+91 9876543210" },
      { key: "whatsapp_number", value: "919074444467" },
      { key: "maintenance_mode", value: "false" },
    ]);
  }

  // Seed default admin
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    await Admin.create({ username: "admin", password: "admin" });
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  const mongoUri =
    process.env.MONGODB_URI ??
    "mongodb+srv://tushittravel_db_user:TuShitTrAvEl2004@cluster0.e9asmzb.mongodb.net/tushit_travel?retryWrites=true&w=majority";

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }

  // Seed core data once on startup
  await seedInitialData();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get("/api/fleet", async (req, res) => {
    console.log(`[API] GET /api/fleet from ${req.ip}`);
    try {
      const fleet = await Fleet.aggregate([
        {
          $lookup: {
            from: "ratings",
            localField: "_id",
            foreignField: "car",
            as: "ratings",
          },
        },
        {
          $addFields: {
            avg_rating: { $avg: "$ratings.rating" },
            review_count: { $size: "$ratings" },
          },
        },
        { $project: { ratings: 0 } },
        { $sort: { createdAt: 1 } },
      ]);
      res.json(
        fleet.map((f) => ({
          ...f,
          id: f._id,
        }))
      );
    } catch (error) {
      console.error("[API] Error fetching fleet:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/availability", async (req, res) => {
    console.log(`[API] GET /api/availability from ${req.ip}`);
    try {
      const total = await Fleet.countDocuments();
      const available = await Fleet.countDocuments({ status: "available" });
      const onTrip = await Fleet.countDocuments({ status: "on-trip" });
      res.json({
        total,
        available,
        onTrip,
      });
    } catch (error) {
      console.error("[API] Error fetching availability:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    console.log("[API] POST /api/bookings", req.body);
    const {
      tripType,
      pickup,
      drop,
      date,
      time,
      passengers,
      carId,
      customerName,
      customerEmail,
      customerPhone,
      returnDate,
      duration,
      tourType,
      flightNumber,
      instructions,
    } = req.body;

    try {
      // Create or update customer
      let customerDoc: any = null;
      if (customerEmail) {
        customerDoc = await Customer.findOne({ email: customerEmail });
        if (customerDoc) {
          customerDoc.name = customerName ?? customerDoc.name;
          customerDoc.phone = customerPhone ?? customerDoc.phone;
          customerDoc.total_bookings = (customerDoc.total_bookings ?? 0) + 1;
          await customerDoc.save();
        } else {
          customerDoc = await Customer.create({
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            total_bookings: 1,
          });
        }
      }

      const booking = await Booking.create({
        trip_type: tripType,
        pickup_location: pickup,
        drop_location: drop,
        pickup_date: date,
        pickup_time: time,
        passengers,
        car: carId || undefined,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        status: "pending",
        return_date: returnDate,
        duration,
        tour_type: tourType,
        flight_number: flightNumber,
        instructions,
      });

      res.json({ success: true, bookingId: booking._id });
    } catch (error) {
      console.error("[API] Error creating booking:", error);
      res.status(500).json({
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Ratings APIs (public)
  app.get("/api/ratings/:carId", async (req, res) => {
    const { carId } = req.params;
    try {
      const ratings = await Rating.find({ car: carId })
        .sort({ created_at: -1 })
        .lean();
      res.json(
        ratings.map((r) => ({
          ...r,
          id: r._id,
        }))
      );
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ratings" });
    }
  });

  app.post("/api/ratings", async (req, res) => {
    const { carId, customerName, rating, comment } = req.body;
    try {
      const created = await Rating.create({
        car: carId,
        customer_name: customerName,
        rating,
        comment,
      });
      res.json({ success: true, id: created._id });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit rating" });
    }
  });

  app.patch("/api/ratings/:id", async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    try {
      await Rating.findByIdAndUpdate(id, { rating, comment });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update rating" });
    }
  });

  app.delete("/api/ratings/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await Rating.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete rating" });
    }
  });

  // Admin auth
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const admin = await Admin.findOne({ username, password });
      if (admin) {
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Admin bookings
  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("car", "name")
        .sort({ created_at: -1 })
        .lean();
      const mapped = bookings.map((b) => ({
        ...b,
        id: b._id,
        car_name: (b as any).car?.name ?? undefined,
      }));
      res.json(mapped);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.patch("/api/admin/bookings/:id", async (req, res) => {
    const { id } = req.params;
    const {
      status,
      customer_name,
      customer_phone,
      pickup_location,
      drop_location,
      pickup_date,
      pickup_time,
    } = req.body;
    try {
      const update: any = {};
      if (status) update.status = status;
      if (customer_name !== undefined) update.customer_name = customer_name;
      if (customer_phone !== undefined) update.customer_phone = customer_phone;
      if (pickup_location !== undefined)
        update.pickup_location = pickup_location;
      if (drop_location !== undefined) update.drop_location = drop_location;
      if (pickup_date !== undefined) update.pickup_date = pickup_date;
      if (pickup_time !== undefined) update.pickup_time = pickup_time;

      await Booking.findByIdAndUpdate(id, update);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.delete("/api/admin/bookings/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await Booking.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete booking" });
    }
  });

  // Fleet admin
  app.post("/api/admin/fleet", async (req, res) => {
    const { 
      name, car_number, category, capacity, luggage, price_per_km, image_url, status,
      image_front, image_side, image_interior, image_seats, image_boot,
      has_ac, fuel_type, transmission, driver_included,
      price_per_day, price_per_hour, best_use, features, driver_details
    } = req.body;
    try {
      const created = await Fleet.create({
        name,
        car_number: car_number || "",
        category,
        capacity,
        luggage,
        price_per_km,
        image_url,
        status: status || "available",
        image_front: image_front || "",
        image_side: image_side || "",
        image_interior: image_interior || "",
        image_seats: image_seats || "",
        image_boot: image_boot || "",
        has_ac: !!has_ac,
        fuel_type: fuel_type || "Diesel",
        transmission: transmission || "Manual",
        driver_included: !!driver_included,
        price_per_day: price_per_day || 0,
        price_per_hour: price_per_hour || 0,
        best_use: best_use || "",
        features: features || "",
        driver_details: driver_details || "",
      });
      res.json({ success: true, id: created._id });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      res.status(500).json({ error: "Failed to add vehicle" });
    }
  });

  app.patch("/api/admin/fleet/:id", async (req, res) => {
    const { id } = req.params;
    const { 
      name, car_number, category, capacity, luggage, price_per_km, image_url, status,
      image_front, image_side, image_interior, image_seats, image_boot,
      has_ac, fuel_type, transmission, driver_included,
      price_per_day, price_per_hour, best_use, features, driver_details
    } = req.body;
    try {
      await Fleet.findByIdAndUpdate(req.params.id, {
        name,
        car_number: car_number || "",
        category,
        capacity,
        luggage,
        price_per_km,
        image_url,
        status,
        image_front: image_front || "",
        image_side: image_side || "",
        image_interior: image_interior || "",
        image_seats: image_seats || "",
        image_boot: image_boot || "",
        has_ac: !!has_ac,
        fuel_type: fuel_type || "Diesel",
        transmission: transmission || "Manual",
        driver_included: !!driver_included,
        price_per_day: price_per_day || 0,
        price_per_hour: price_per_hour || 0,
        best_use: best_use || "",
        features: features || "",
        driver_details: driver_details || "",
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(500).json({ error: "Failed to update vehicle" });
    }
  });

  app.delete("/api/admin/fleet/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await Fleet.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });

  // Customers API
  app.get("/api/admin/customers", async (req, res) => {
    try {
      const customers = await Customer.find().sort({ created_at: -1 }).lean();
      const mapped = customers.map((c) => ({ ...c, id: c._id }));
      res.json(mapped);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.patch("/api/admin/customers/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    try {
      await Customer.findByIdAndUpdate(id, { name, email, phone });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update customer" });
    }
  });

  app.delete("/api/admin/customers/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await Customer.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });

  // Admin stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const [totalBookings, totalCustomers, fleetStatsAgg, activeBookings] =
        await Promise.all([
          Booking.countDocuments(),
          Customer.countDocuments(),
          Fleet.aggregate([
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                available: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "available"] }, 1, 0],
                  },
                },
              },
            },
          ]),
          Booking.countDocuments({
            status: { $in: ["pending", "confirmed"] },
          }),
        ]);

      const fleetStats =
        fleetStatsAgg[0] ?? { total: 0, available: 0 };

      res.json({
        bookings: totalBookings,
        customers: totalCustomers,
        fleet: fleetStats,
        activeBookings,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Settings API (admin + public)
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settingsArr = await Setting.find().lean();
      const settingsObj = settingsArr.reduce(
        (acc: any, curr: any) => {
          acc[curr.key] = curr.value;
          return acc;
        },
        {} as any
      );
      res.json(settingsObj);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.patch("/api/admin/settings", async (req, res) => {
    const settings = req.body as Record<string, string>;
    try {
      const ops = Object.entries(settings).map(([key, value]) =>
        Setting.updateOne(
          { key },
          { $set: { value: String(value) } },
          { upsert: true }
        )
      );
      await Promise.all(ops);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Public settings for frontend (Home.tsx)
  app.get("/api/settings", async (req, res) => {
    try {
      const settingsArr = await Setting.find().lean();
      const settingsObj = settingsArr.reduce(
        (acc: any, curr: any) => {
          acc[curr.key] = curr.value;
          return acc;
        },
        {} as any
      );
      res.json(settingsObj);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Inquiries (Contact form)
  app.post("/api/inquiries", async (req, res) => {
    try {
      const { name, phone, email, subject, message } = req.body;
      const inquiry = await Inquiry.create({
        name,
        phone,
        email,
        subject,
        message,
      });
      res.json({ success: true, id: inquiry._id });
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(500).json({ error: "Failed to submit inquiry" });
    }
  });

  app.get("/api/admin/inquiries", async (req, res) => {
    try {
      const inquiries = await Inquiry.find().sort({ created_at: -1 }).lean();
      const mapped = inquiries.map((i) => ({ ...i, id: i._id }));
      res.json(mapped);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  app.delete("/api/admin/inquiries/:id", async (req, res) => {
    try {
      await Inquiry.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inquiry" });
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
