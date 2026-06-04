
require("dotenv").config();
const sql = require("mssql");


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true
    }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect()
.then(() => {
    console.log("✅ Database Connected");
    return pool;
})
.catch(err => {
    console.error("❌ Database connection error:", err);
    throw err;
});

module.exports = { sql, pool, poolConnect };