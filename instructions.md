# Pharmacy POS System - Project Specification & Instructions

This document outlines the complete Business Requirements, Technical Requirements, and Step-by-Step Implementation Instructions for building an offline-first Pharmacy Point of Sale (POS) system using **HTML5, Tailwind CSS, Vanilla JavaScript, and Dexie.js (IndexedDB)**.

---

## 1. Project Overview
The goal is to build a lightweight, fast, and secure desktop-friendly Web POS designed specifically for a retail pharmacy. Since pharmacies cannot afford downtime due to internet drops, the system will use an **Offline-First Architecture** leveraging browser-based IndexedDB via Dexie.js.

---

## 2. Business Requirements (Functional Modules)

### 2.1. Dashboard & Alerts
* **Key Metrics:** Total Sales (Today), Total Profit (Today), Low Stock Items Count, Expired/Soon-to-expire Items Count.
* **Real-time Notifications:** * Alert for drugs expiring within the next 90 days.
    * Alert for drugs below the minimum stock threshold.

### 2.2. Inventory & Stock Management
* **Drug Profile:** Brand Name, Generic Name (Formula), Dosage (mg/ml), Type (Tablet, Syrup, Capsule, etc.), Rack/Shelf Location.
* **Batch Tracking (Crucial):** Each drug must support multiple batches. Each batch contains:
    * Batch Number
    * Expiry Date
    * Cost Price
    * Selling Price
    * Available Quantity
* **Supplier Management:** Supplier Name, Contact Person, Phone, Pending Dues.

### 2.3. Billing & Point of Sale (POS)
* **Fast Search:** Search drugs instantly by Brand Name, Generic Name, or barcode scan.
* **Batch Selection:** If a drug has multiple batches, the system must automatically suggest the earliest expiring batch first (FEFO - First Expired, First Out), with an option to manually switch batches.
* **Cart Management:** Add, update quantity, remove, display subtotal.
* **Discounts:** Line-item discount or overall bill discount (Percentage or Flat rate).
* **Customer & Prescription Notes:** Option to attach a customer name/phone and doctor/prescription notes (especially for narcotics or regulated drugs).
* **Payment Methods:** Cash, Card, or Credit (Paid Later).
* **Receipt Printing:** Standard thermal receipt layout (80mm/58mm) with a clean print template.

### 2.4. Reports & Analytics
* **Sales Report:** Filterable by Date Range (Daily, Weekly, Monthly). Displays Total Revenue, Total Cost, and Net Profit.
* **Inventory Valuation:** Current total value of stock based on Cost Price and Selling Price.
* **Fast-Moving Items:** List of top-selling drugs.

### 2.5. Data Backup & Restore
* **Export Database:** Download all IndexedDB data as a single `.json` file.
* **Import Database:** Restore data from a previously saved `.json` file (overwriting or merging).

---

## 3. Technical Requirements & Stack

* **UI/Styling:** Single Page Application (SPA) structure using **HTML5** and **Tailwind CSS** (via CDN for simplicity, or compiled utility classes).
* **Icons:** Heroicons or FontAwesome via CDN.
* **State & Logic:** Pure **Vanilla JavaScript** (ES6+ features like Modules, Async/Await).
* **Database Management:** **Dexie.js** wrapper for IndexedDB.
    * *Why Dexie?* Provides structured schemas, rapid indexing, complex queries (like range filters for expiry dates), and ACID transactions locally in the browser.

### 3.4. Database Schema Design (Dexie.js)
```javascript
const db = new Dexie('PharmacyPOSDB');
db.version(1).stores({
    drugs: '++id, brandName, genericName, rackLocation',
    batches: '++id, drugId, batchNumber, expiryDate, qty, costPrice, sellingPrice',
    sales: '++id, invoiceNumber, dateTime, totalAmount, discount, netAmount, paymentMethod, profit',
    salesItems: '++id, saleId, drugId, batchId, qty, unitPrice, total',
    suppliers: '++id, name, phone'
});