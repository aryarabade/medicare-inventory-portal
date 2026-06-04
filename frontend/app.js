function showLogin(){

let modal = new bootstrap.Modal(document.getElementById("loginModal"))
modal.show()

}



async function loginAdmin(){

let email = document.getElementById("email").value
let password = document.getElementById("password").value

const response = await fetch("/admin/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email,password})

})

const data = await response.json()

if(data.message==="Login successful"){

alert("Login Successful")

window.location.href="dashboard.html"

}
else{

alert("Invalid Login")

}

}



function logout(){

window.location.href="index.html"

}



function showAddMedicine(){

document.getElementById("content-area").innerHTML=`

<h4>Add Medicine</h4>

<input id="name" class="form-control mb-2" placeholder="Name">

<input id="batch" class="form-control mb-2" placeholder="Batch">

<input id="expiry" type="date" class="form-control mb-2">

<input id="brand" class="form-control mb-2" placeholder="Brand">

<input id="supplier" class="form-control mb-2" placeholder="Supplier">

<input id="quantity" type="number" class="form-control mb-2" placeholder="Quantity">

<button class="btn btn-primary" onclick="addMedicine()">Add</button>

`

}



async function addMedicine(){

let medicine = {

name:document.getElementById("name").value,
batch:document.getElementById("batch").value,
expiry:document.getElementById("expiry").value,
brand:document.getElementById("brand").value,
supplier:document.getElementById("supplier").value,
quantity:document.getElementById("quantity").value

}

const res = await fetch("http://localhost:5000/medicine/add",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(medicine)

})

const data = await res.json()

alert(data.message)

loadStock()

}



async function loadStock(){

try{

const res = await fetch("http://localhost:5000/medicine/all")

const data = await res.json()

let table = `

<h4>Medicine Stock</h4>

<!-- NEW: SEARCH BAR ADDED -->
<input 
id="searchMedicine" 
class="form-control mb-3 w-25" 
placeholder="Search Medicine..." 
onkeyup="searchMedicine()"
/>

<table class="table table-bordered">

<tr>
<th>ID</th>
<th>Name</th>
<th>Batch</th>
<th>Expiry</th>
<th>Brand</th>
<th>Supplier</th>
<th>Quantity</th>
</tr>
`

data.forEach((m,index)=>{

table += `

<tr>
<td>${m.medicine_id || index+1}</td>
<td>${m.name}</td>
<td>${m.batch}</td>
<td>${m.expiry_date || m.expiry}</td>
<td>${m.brand}</td>
<td>${m.supplier}</td>
<td>${m.quantity}</td>
</tr>

`

})

table += "</table>"

document.getElementById("content-area").innerHTML = table

/* CHECK ALERTS */
checkAlerts(data)

}catch(error){

console.error("Stock loading error:", error)

document.getElementById("content-area").innerHTML =
"<p style='color:red'>Error loading stock</p>"

}

}




function checkAlerts(medicines){

let today = new Date()

let alerts = ""

medicines.forEach(m=>{

let expiry = new Date(m.expiry_date)

let diff = (expiry - today) / (1000*60*60*24)

// Alert only for medicines expiring within next 30 days (not more, not less)
if(diff > 0 && diff <= 30){

alerts += `⚠ Medicine ${m.name} expires in ${Math.floor(diff)} days\n`

}

if(m.quantity <= 10){

alerts += `⚠ Low Stock: ${m.name} only ${m.quantity} left\n`

}

})

if(alerts !== ""){

alert(alerts)

}

}



function showDispense(){

document.getElementById("content-area").innerHTML=`

<h4>Dispense Medicine</h4>

<input id="medName" class="form-control mb-2" placeholder="Medicine Name">

<input id="patientName" class="form-control mb-2" placeholder="Patient Name">

<input id="dispenseQty" type="number" class="form-control mb-2" placeholder="Quantity">

<button class="btn btn-success" onclick="dispenseMedicine()">Dispense</button>

`;

}



async function dispenseMedicine(){

let name = document.getElementById("medName").value
let patient = document.getElementById("patientName").value
let quantity = Number(document.getElementById("dispenseQty").value)

if(!name || !patient || !quantity || quantity <= 0){
 alert("Please enter medicine name, patient name, and a valid quantity.")
 return
}

const res = await fetch("http://localhost:5000/dispense/add",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name:name,
patient:patient,
quantity:quantity
})

})

const data = await res.json()

alert(data.message || "Operation Completed")

loadStock()

}


/* ===============================
   NEW FUNCTION: SEARCH MEDICINE
   =============================== */

function searchMedicine(){

let input = document.getElementById("searchMedicine").value.toLowerCase()

let rows = document.querySelectorAll("table tr")

rows.forEach((row,index)=>{

if(index===0) return

let name = row.children[1].innerText.toLowerCase()

if(name.includes(input)){
row.style.display=""
}
else{
row.style.display="none"
}

})

}