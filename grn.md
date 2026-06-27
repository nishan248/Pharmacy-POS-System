# Pharmacy GRN Module Specification

## 1. GRN Header Information

| Field | Purpose |
|---------|---------|
| GRN Number | Unique auto-generated receipt number |
| GRN Date | Date goods were received |
| Received By | Staff member receiving stock |
| Supplier Name | Supplier delivering goods |
| Supplier Invoice Number | Supplier invoice reference |
| Supplier Invoice Date | Invoice date |
| Purchase Order Number | Linked purchase order |
| Delivery Note Number | Delivery note reference |
| Branch/Warehouse | Receiving location |

## 2. Supplier Information

- Supplier ID
- Supplier Name
- Contact Person
- Phone Number
- Email
- Address

## 3. Item Details

- Item Code
- Barcode
- Product Name
- Generic Name
- Strength
- Dosage Form
- Manufacturer
- Batch/Lot Number
- Expiry Date
- Quantity Ordered
- Quantity Received
- Quantity Free
- Unit Cost
- Selling Price
- Discount %
- Tax/VAT %
- Total Cost

## 4. Batch Management

### Fields

- Batch Number
- Manufacturing Date
- Expiry Date
- Batch Quantity
- Batch Cost

### Functions

- Add multiple batches per item
- Near-expiry alerts
- FEFO (First Expired First Out)
- Batch-wise stock tracking

## 5. Quantity Verification

- Ordered Quantity
- Received Quantity
- Damaged Quantity
- Missing Quantity
- Excess Quantity

### Functions

- Calculate shortages
- Calculate excess deliveries
- Generate discrepancy reports

## 6. Pricing Functions

```text
Line Total = Quantity Received × Unit Cost
Discount Amount = Line Total × Discount %
Tax Amount = (Line Total - Discount) × Tax %
Net Amount = Line Total - Discount + Tax
```

## 7. Inventory Update Functions

- Increase stock quantity
- Create batch records
- Update average cost
- Update available stock
- Update warehouse stock

## 8. Quality Control

- QC Status
- Checked By
- Remarks
- Release Date

### Functions

- Quarantine stock until approved
- Reject damaged stock
- Record QC findings

## 9. Approval Workflow

### Statuses

- Draft
- Pending Verification
- Verified
- Approved
- Rejected
- Cancelled

### Roles

- Store Keeper
- Pharmacist
- Manager

## 10. Financial Integration

```text
Inventory Account     Dr
Accounts Payable      Cr
```

## 11. Document Management

- Supplier Invoice
- Delivery Note
- QC Documents
- Purchase Order Copy

## 12. Search and Reporting

### Reports

- Daily GRN Report
- Supplier-wise Purchases
- Batch-wise Receipts
- Expiry Report
- Stock Movement Report
- Purchase Cost Report

## 13. Pharmacy-Specific Features

### Expiry Alerts

- 1 Month
- 3 Months
- 6 Months

### Controlled Drugs

- License Number
- Authorized Receiver
- Audit Trail

### Cold Chain Medicines

- Receiving Temperature
- Storage Verification
- Temperature Logs

## Recommended Database Tables

- suppliers
- purchase_orders
- grn_header
- grn_items
- grn_batches
- inventory_stock
- stock_ledger
- accounts_payable
- attachments
- users
