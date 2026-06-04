const express = require("express")
const router = express.Router()
const { sql, pool } = require("../db")

// ADD MEDICINE
router.post("/add", async (req,res)=>{

const {name,batch,expiry,brand,supplier,quantity} = req.body

try{

await pool.request()
    .input("name", sql.VarChar(100), name)
    .input("batch", sql.VarChar(50), batch)
    .input("expiry", sql.Date, expiry)
    .input("brand", sql.VarChar(100), brand)
    .input("supplier", sql.VarChar(100), supplier)
    .input("quantity", sql.Int, quantity)
    .query("INSERT INTO Medicines (name,batch,expiry_date,brand,supplier,quantity) VALUES (@name,@batch,@expiry,@brand,@supplier,@quantity)")

res.json({message:"Medicine Added Successfully"})

}catch(err){

res.json({message:"Error adding medicine"})

}

})


// GET ALL MEDICINES
router.get("/all", async (req,res)=>{

try{

const result = await pool.request().query("SELECT * FROM Medicines")

res.json(result.recordset)

}catch(err){

res.json([])

}

})

module.exports = router