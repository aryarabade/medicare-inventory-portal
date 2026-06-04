const express = require("express")
const router = express.Router()
const { sql, pool } = require("../db")

router.post("/add", async (req,res)=>{

const {name,patient,quantity} = req.body
const quantityInt = parseInt(quantity, 10)
console.log("Dispense request", {name, patient, quantity, quantityInt})

if(!name || !patient || !quantityInt || quantityInt <= 0){
 return res.status(400).json({message:"Please provide a valid medicine name, patient name, and quantity."})
}

try{

const medicine = await pool.request()
    .input("name", sql.VarChar(100), name)
    .query("SELECT * FROM Medicines WHERE name=@name")

if(medicine.recordset.length === 0){
 return res.json({message:"Medicine not found"})
}

let stock = medicine.recordset[0].quantity

if(stock < quantityInt){
 return res.json({message:"Not enough stock"})
}

await pool.request()
    .input("quantity", sql.Int, quantityInt)
    .input("name", sql.VarChar(100), name)
    .query("UPDATE Medicines SET quantity = quantity - @quantity WHERE name=@name")

await pool.request()
    .input("name", sql.VarChar(100), name)
    .input("patient", sql.VarChar(100), patient)
    .input("quantity", sql.Int, quantityInt)
    .query("INSERT INTO DispenseHistory(medicine_name, patient_name, quantity) VALUES(@name, @patient, @quantity)")

res.json({message:"Medicine Dispensed Successfully"})

}catch(err){

console.error("Dispense error:", err)
res.status(500).json({message:"Error dispensing medicine"})

}

})

module.exports = router