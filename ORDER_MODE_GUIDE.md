# Order Mode Feature Guide

## Overview
The RFID Package Verification System now supports **two order modes**: selecting from a predefined catalog OR creating custom orders with user-defined product names.

## How to Use

### Step 1: Set Order Information
1. **Order ID** (required): Enter a custom order ID (e.g., "ORD-2025-001")
   - If left blank, system auto-generates: `AUTO_<timestamp>`
2. **Order Name** (optional): Enter a descriptive name (e.g., "Electronics Shipment Q4")

### Step 2: Choose Order Mode

#### Option A: Select from Catalog
1. Select the **"Select from Catalog"** radio button
2. Choose a product from the dropdown menu:
   - Laptop
   - Smartphone
   - Tablet
   - Headphones
   - Smartwatch
3. Enter quantity
4. Click "Add to Cart"
5. Repeat for additional catalog items

#### Option B: Custom Product
1. Select the **"Custom Product"** radio button
2. Type your custom product name in the text field (e.g., "Industrial Sensor X200")
3. Enter quantity
4. Click "Add to Cart"
5. Custom product name is cleared automatically after adding
6. Repeat for additional custom items

### Step 3: Mix and Match (Advanced)
- You can **combine both modes** in a single order!
- Example workflow:
  1. Add 2x Laptop (catalog)
  2. Switch to Custom mode
  3. Add 1x "Custom Cable Assembly" (custom)
  4. Switch back to Catalog
  5. Add 3x Smartphone (catalog)

### Step 4: Confirm Order
- Click **"Confirm Order"** to lock:
  - Order ID and Name
  - All products in cart
  - Order mode selection
- After confirmation, you cannot modify the order

### Step 5: Place Items
- In **Step 2: Configure Package Items**, the dropdown will show:
  - **Catalog Products** (all products from database)
  - **Custom Products** (any custom products you added to cart)
- You can select and place:
  - Items from your cart (to fulfill the order)
  - Extra items NOT in your cart (to test "extra items" scenarios)
- Select an item and click on the canvas to place it

### Step 6: Scan and Verify
- Continue with normal RFID scanning workflow
- Custom products are scanned and verified just like catalog products

## Technical Details

### RFID Generation
- **Catalog products**: Use predefined RFID tags from database
  - Example: `RFID001-1`, `RFID002-2`
- **Custom products**: Auto-generate RFID tags
  - Format: `CUSTOM-<PRODUCT-NAME>-<instance>`
  - Example: `CUSTOM-INDUSTRIAL-SENSOR-X200-1`
  - Product names are uppercased and spaces replaced with hyphens
  - Limited to first 20 characters

### Item IDs
- **Catalog products**: `<product-id>-<instance>`
- **Custom products**: `custom-<product-name>-<instance>`

## Example Scenarios

### Scenario 1: Pure Catalog Order
```
Order ID: ORD-2025-100
Order Name: Standard Electronics Package
Mode: Select from Catalog
Items:
- 2x Laptop
- 1x Tablet
- 3x Headphones
```

### Scenario 2: Pure Custom Order
```
Order ID: CUSTOM-MFG-2025-001
Order Name: Manufacturing Parts Batch 7
Mode: Custom Product
Items:
- 5x Circuit Board v3.2
- 10x Power Supply Unit
- 2x Control Panel Assembly
```

### Scenario 3: Mixed Order
```
Order ID: HYBRID-2025-050
Order Name: Office Setup Package
Items (mixed):
- 3x Laptop (catalog)
- 2x Smartphone (catalog)
- 1x Ergonomic Desk Mat (custom)
- 2x USB-C Hub Pro (custom)
- 1x Smartwatch (catalog)
```

## Benefits
1. **Flexibility**: Handle both standard and non-standard inventory
2. **No Database Required**: Add new products on-the-fly without updating the catalog
3. **Seamless Integration**: Custom products work identically to catalog products throughout the workflow
4. **Audit Trail**: All orders maintain proper IDs and names for tracking
5. **Extra Item Testing**: Place items not in the cart to test "extra items detected" scenarios
6. **Complete Validation**: Verify both missing items and unexpected extra items in packages
