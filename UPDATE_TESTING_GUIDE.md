# 📝 **How to Edit/Update Data in Postman**

## 🚀 **Step-by-Step Update Testing Guide**

### **STEP 1: Get Existing Data First** 🔍

Before updating, you need to get the existing record to see its current values and get the ID.

#### **Get All Trips:**
- **Method:** `GET`
- **URL:** `http://localhost:4000/api/trips`
- **Expected Response:**
```json
[
  {
    "_id": "68d26e129f10e9b5c0031916",
    "name": "Alice Johnson",
    "phone": "01712345678",
    "email": "alice@example.com",
    "productType": "Fragile",
    "pickupLocation": "123 Main Street",
    "dropOffLocation": "456 Park Avenue",
    "preferredDate": "2024-01-15T00:00:00.000Z",
    "preferredTimeSlot": "Morning (8AM - 12PM)",
    "truckId": "68d26e129f10e9b5c0031915"
  }
]
```

#### **Get All Trucks:**
- **Method:** `GET` 
- **URL:** `http://localhost:4000/api/trucks`

---

### **STEP 2: Update Trip Data** 🎯

#### **Update Trip Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:4000/api/trips`
- **Headers:** `Content-Type: application/json`

#### **Update Trip Body Examples:**

**🔹 Partial Update (Change only some fields):**
```json
{
  "id": "68d26e129f10e9b5c0031916",
  "name": "Alice Johnson - UPDATED",
  "phone": "01999888777",
  "preferredTimeSlot": "Evening (4PM - 8PM)"
}
```

**🔹 Full Update (Change all fields):**
```json
{
  "id": "68d26e129f10e9b5c0031916",
  "name": "Bob Smith",
  "phone": "01987654321",
  "email": "bob.smith@updated.com",
  "productType": "Non-Perishable Goods",
  "pickupLocation": "789 Updated Street, Dhaka",
  "dropOffLocation": "321 New Avenue, Sylhet",
  "preferredDate": "2024-03-20",
  "preferredTimeSlot": "Afternoon (12PM - 4PM)",
  "truckId": "68d26e129f10e9b5c0031915"
}
```

**🔹 Test Validation (Invalid Data):**
```json
{
  "id": "68d26e129f10e9b5c0031916",
  "productType": "Invalid Product Type",
  "preferredTimeSlot": "Invalid Time Slot"
}
```

---

### **STEP 3: Update Truck Data** 🚚

#### **Update Truck Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:4000/api/trucks`
- **Headers:** `Content-Type: application/json`

#### **Update Truck Body Examples:**

**🔹 Partial Update:**
```json
{
  "id": "68d26e129f10e9b5c0031915",
  "plateNumber": "XYZ-9999",
  "driverName": "John Doe - UPDATED"
}
```

**🔹 Full Update:**
```json
{
  "id": "68d26e129f10e9b5c0031915",
  "plateNumber": "UPDATED-123",
  "driverName": "Jane Smith",
  "driverPhone": "01777888999",
  "capacity": "10 tons",
  "truckType": "Heavy Truck"
}
```

---

## 🧪 **POSTMAN TESTING SEQUENCE**

### **Complete Update Test Flow:**

#### **1. Test Trip Update** 🎯
```bash
# Step 1: Get existing trip
GET http://localhost:4000/api/trips

# Step 2: Copy an ID from response (e.g., "68d26e129f10e9b5c0031916")

# Step 3: Update that trip
PUT http://localhost:4000/api/trips/68d26e129f10e9b5c0031916
Content-Type: application/json

{
  "name": "UPDATED Customer Name",
  "preferredTimeSlot": "Evening (4PM - 8PM)"
}

# Step 4: Verify update worked
GET http://localhost:4000/api/trips/68d26e129f10e9b5c0031916
```

#### **2. Test Truck Update** 🚚
```bash
# Step 1: Get existing truck
GET http://localhost:4000/api/trucks

# Step 2: Copy an ID from response (e.g., "68d26e129f10e9b5c0031915")

# Step 3: Update that truck
PUT http://localhost:4000/api/trucks/68d26e129f10e9b5c0031915
Content-Type: application/json

{
  "plateNumber": "UPDATED-PLATE",
  "driverName": "Updated Driver Name"
}

# Step 4: Verify update worked
GET http://localhost:4000/api/trucks/68d26e129f10e9b5c0031915
```

---

## ✅ **Expected Update Responses**

### **🟢 Successful Update (200 OK):**
```json
{
  "_id": "68d26e129f10e9b5c0031916",
  "name": "UPDATED Customer Name",
  "phone": "01712345678",
  "email": "alice@example.com",
  "productType": "Fragile",
  "pickupLocation": "123 Main Street",
  "dropOffLocation": "456 Park Avenue",
  "preferredDate": "2024-01-15T00:00:00.000Z",
  "preferredTimeSlot": "Evening (4PM - 8PM)",
  "truckId": "68d26e129f10e9b5c0031915",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T11:30:00.000Z"
}
```

### **🔴 Resource Not Found (404):**
```json
{
  "error": "Trip not found"
}
```

### **🔴 Validation Error (400):**
```json
{
  "error": "Failed to update trip",
  "details": {
    "issues": [
      {
        "code": "invalid_enum_value",
        "expected": ["Perishable Goods", "Non-Perishable Goods", "Fragile", "Other"],
        "received": "Invalid Product Type",
        "path": ["productType"],
        "message": "Invalid enum value. Expected 'Perishable Goods' | 'Non-Perishable Goods' | 'Fragile' | 'Other', received 'Invalid Product Type'"
      }
    ]
  }
}
```

---

## 🎯 **Key Update Features**

### **✅ What Works:**
- **Partial Updates** - Only send fields you want to change
- **Full Updates** - Send all fields to completely replace
- **Validation** - Invalid data gets rejected with clear errors
- **Enum Restrictions** - Product types and time slots are still enforced
- **Real-time Updates** - Changes are immediately reflected in database

### **🛡️ Validation Still Active:**
- **Product Type** must be one of: `"Perishable Goods"`, `"Non-Perishable Goods"`, `"Fragile"`, `"Other"`
- **Time Slot** must be one of: `"Morning (8AM - 12PM)"`, `"Afternoon (12PM - 4PM)"`, `"Evening (4PM - 8PM)"`
- **Required Fields** are still enforced
- **Data Types** are validated (dates, strings, etc.)

---

## 🔄 **Quick Postman Collection for Updates**

Import this into Postman for quick testing:

**1. GET Trip by ID:**
```
GET http://localhost:4000/api/trips/{{trip_id}}
```

**2. UPDATE Trip:**
```
PUT http://localhost:4000/api/trips/{{trip_id}}
Content-Type: application/json

{
  "name": "Updated Name",
  "preferredTimeSlot": "Evening (4PM - 8PM)"
}
```

**3. Verify Update:**
```
GET http://localhost:4000/api/trips/{{trip_id}}
```

**Set Variables in Postman:**
- `trip_id`: Get this from your GET all trips response
- `truck_id`: Get this from your GET all trucks response

---

## 🚀 **Ready to Test!**

1. Start your server: `npm run dev`
2. Use Postman to GET existing data
3. Copy real IDs from the response
4. Use PUT requests to update
5. Verify changes with GET requests

**All update operations are fully functional and validated!** 🎉