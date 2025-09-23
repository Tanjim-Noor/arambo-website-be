# 🚛 Arambo Website Backend API Testing Guide

## 📋 Complete CRUD Operations Available

### **TRUCKS API** 🚚

#### 1. **CREATE Truck** 
- **Method:** `POST`
- **URL:** `http://localhost:4000/api/trucks`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "modelNumber": "T-500",
  "height": 4.2,
  "isOpen": true
}
```

#### 2. **GET All Trucks**
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/trucks`
- **Headers:** None required

#### 3. **GET Truck by ID**
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/trucks/{truck_id}`
- **Example:** `http://localhost:4000/api/trucks/68d26e129f10e9b5c0031915`
- **Headers:** None required

#### 4. **UPDATE Truck**
- **Method:** `PUT`
- **URL:** `http://localhost:4000/api/trucks/{truck_id}`
- **Example:** `http://localhost:4000/api/trucks/68d26e129f10e9b5c0031915`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "modelNumber": "T-999",
  "height": 5.0,
  "isOpen": false
}
```

#### 5. **DELETE Truck**
- **Method:** `DELETE`
- **URL:** `http://localhost:4000/api/trucks/{truck_id}`
- **Example:** `http://localhost:4000/api/trucks/68d26e129f10e9b5c0031915`
- **Headers:** None required

---

### **TRIPS API** 🎯

#### 1. **CREATE Trip**
- **Method:** `POST`
- **URL:** `http://localhost:4000/api/trips`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "name": "Alice Johnson",
  "phone": "01712345678",
  "email": "alice@example.com",
  "productType": "Fragile",
  "pickupLocation": "123 Main Street, Dhaka",
  "dropOffLocation": "456 Park Avenue, Chittagong",
  "preferredDate": "2024-01-15",
  "preferredTimeSlot": "Morning (8AM - 12PM)",
  "truckId": "68d26e129f10e9b5c0031915"
}
```

#### 2. **GET All Trips**
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/trips`
- **Headers:** None required

#### 3. **GET Trip by ID**
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/trips/{trip_id}`
- **Example:** `http://localhost:4000/api/trips/68d26e129f10e9b5c0031916`
- **Headers:** None required

#### 4. **UPDATE Trip**
- **Method:** `PUT`
- **URL:** `http://localhost:4000/api/trips/{trip_id}`
- **Example:** `http://localhost:4000/api/trips/68d26e129f10e9b5c0031916`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "name": "Alice Johnson Updated",
  "phone": "01987654321",
  "email": "alice.updated@example.com",
  "productType": "Non-Perishable Goods",
  "pickupLocation": "789 Updated Street, Dhaka",
  "dropOffLocation": "321 New Avenue, Sylhet",
  "preferredDate": "2024-02-20",
  "preferredTimeSlot": "Evening (4PM - 8PM)",
  "truckId": "68d26e129f10e9b5c0031915"
}
```

#### 5. **DELETE Trip**
- **Method:** `DELETE`
- **URL:** `http://localhost:4000/api/trips/{trip_id}`
- **Example:** `http://localhost:4000/api/trips/68d26e129f10e9b5c0031916`
- **Headers:** None required

---

### **SPECIAL TRIP QUERIES** 🔍

#### 6. **GET Trips by Truck ID**
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/trips/truck/{truck_id}`
- **Example:** `http://localhost:4000/api/trips/truck/68d26e129f10e9b5c0031915`

#### 7. **GET Trips by Date**
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/trips/date?date={YYYY-MM-DD}`
- **Example:** `http://localhost:4000/api/trips/date?date=2024-01-15`

#### 8. **GET Trips by Time Slot**
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/trips/timeslot/{time_slot}`
- **Examples:**
  - `http://localhost:4000/api/trips/timeslot/Morning (8AM - 12PM)`
  - `http://localhost:4000/api/trips/timeslot/Afternoon (12PM - 4PM)`
  - `http://localhost:4000/api/trips/timeslot/Evening (4PM - 8PM)`

---

## 🧪 **POSTMAN TESTING STEPS**

### **Step 1: Start Your Server**
```bash
npm run dev
```
Your server should be running on `http://localhost:4000`

### **Step 2: Create Postman Collection**
1. Open Postman
2. Click "New" → "Collection"
3. Name it "Arambo Backend API"

### **Step 3: Add Requests**
Create folders for "Trucks" and "Trips", then add all the requests above.

### **Step 4: Test Sequence**
1. **First:** GET all trucks to see existing IDs
2. **Then:** Use a real truck ID in your trip creation
3. **Test:** All CRUD operations for both trucks and trips

---

## ✅ **VALIDATION RULES TO TEST**

### **Product Type (Only 4 Options):**
- ✅ "Perishable Goods"
- ✅ "Non-Perishable Goods" 
- ✅ "Fragile"
- ✅ "Other"
- ❌ "Custom Type" (Should fail with 400)

### **Time Slot (Only 3 Options):**
- ✅ "Morning (8AM - 12PM)"
- ✅ "Afternoon (12PM - 4PM)"
- ✅ "Evening (4PM - 8PM)"
- ❌ "Night" (Should fail with 400)

---

## 📊 **EXPECTED RESPONSES**

### **Success Responses:**
- **CREATE:** `201 Created` with created object
- **GET:** `200 OK` with data
- **UPDATE:** `200 OK` with updated object  
- **DELETE:** `200 OK` with `{"success": true}`

### **Error Responses:**
- **Not Found:** `404` with `{"error": "Resource not found"}`
- **Validation Error:** `400` with error details
- **Server Error:** `500` with error message

---

## 🎯 **QUICK TEST EXAMPLES**

Copy-paste these into Postman for quick testing:

**Create Truck:**
```
POST http://localhost:4000/api/trucks
Content-Type: application/json

{
  "plateNumber": "TEST-123",
  "driverName": "Test Driver",
  "driverPhone": "01700000000",
  "capacity": "3 tons",
  "truckType": "Mini Truck"
}
```

**Create Trip:**
```
POST http://localhost:4000/api/trips
Content-Type: application/json

{
  "name": "Test Customer",
  "phone": "01700000001",
  "email": "test@example.com",
  "productType": "Other",
  "pickupLocation": "Test Pickup Location",
  "dropOffLocation": "Test Drop Location",
  "preferredDate": "2024-12-25",
  "preferredTimeSlot": "Afternoon (12PM - 4PM)",
  "truckId": "USE_REAL_TRUCK_ID_HERE"
}
```

**Update Trip:**
```
PUT http://localhost:4000/api/trips/{trip_id}
Content-Type: application/json

{
  "name": "Updated Customer Name",
  "preferredTimeSlot": "Evening (4PM - 8PM)"
}
```

**Delete Trip:**
```
DELETE http://localhost:4000/api/trips/{trip_id}
```

