const express = require("express");
const router = express.Router();
const { sql, pool } = require("../db");

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const result = await pool.request()
            .input("email", sql.VarChar(100), email)
            .input("password", sql.VarChar(100), password)
            .query("SELECT * FROM Admins WHERE email=@email AND password=@password");

        if (result.recordset.length > 0) {
            res.json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Invalid login" });
        }

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send({ message: "Error during login" });
    }

});

module.exports = router;