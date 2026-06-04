require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const adminRoutes = require("./routes/adminRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const dispenseRoutes = require("./routes/dispenseRoutes");

const app = express();

/* PORT FROM .ENV */
const PORT = process.env.PORT || 5000;

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* API ROUTES */
app.use("/admin", adminRoutes);
app.use("/medicine", medicineRoutes);
app.use("/dispense", dispenseRoutes);

/* SERVE FRONTEND FILES */
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

/* OPEN INDEX PAGE */
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

/* START SERVER ONLY AFTER DB IS CONNECTED */
db.poolConnect
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    });