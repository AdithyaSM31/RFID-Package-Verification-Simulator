# Changelog

## [Unreleased] - 2025-10-19

### Added
- **Custom Order ID and Name**: Users can now enter custom order IDs and order names instead of using auto-generated values
  - Added "Order ID" input field in Step 1 (CartManagement)
  - Added "Order Name" input field in Step 1 (CartManagement)
  - Order ID and Name are displayed in the "Expected Items" section
  - Order Name displays in a purple badge (only when provided)
  - If no Order ID is provided, system auto-generates one with format: `AUTO_<timestamp>`

- **Dual Order Mode**: Users can now choose between catalog products or custom products
  - Added radio button toggle: "Select from Catalog" vs "Custom Product"
  - **Catalog Mode**: Select from predefined product database (original functionality)
  - **Custom Product Mode**: Enter any custom product name
  - Custom products get auto-generated RFID tags with format: `CUSTOM-<PRODUCT-NAME>-<instance>`
  - Both catalog and custom products work seamlessly in the verification workflow

### Modified Files
1. **src/hooks/useRFIDSimulation.ts**
   - Added `orderId` and `orderName` state
   - Added `setOrderId` and `setOrderName` functions
   - Updated `confirmOrder()` to generate RFIDs for both catalog and custom products
   - Updated `addItemToPackage()` to handle custom products without catalog entries
   - Updated `finalizeScan()` to use custom orderId or auto-generate if empty
   - Updated `clearAllItems()` to reset order ID and name
   - Exported new state and setters in return object

2. **src/components/CartManagement.tsx**
   - Added `orderId` and `orderName` props
   - Added `onOrderIdChange` and `onOrderNameChange` callbacks
   - Added `orderMode` state ('catalog' | 'custom')
   - Added `customProductName` state
   - Added two new input fields for Order ID and Order Name
   - Added radio buttons to switch between Catalog and Custom modes
   - Added conditional rendering: shows product dropdown OR custom product input
   - Updated `handleAddToCart()` to use either selected or custom product
   - Both order ID/name fields and mode selector are disabled after order confirmation

3. **src/components/ExpectedItems.tsx**
   - Added `orderId` and `orderName` props
   - Updated display to show custom order ID (or "Not set")
   - Added conditional purple badge for order name (when provided)
   - Removed hardcoded "Custom" order ID

4. **src/components/ItemPlacement.tsx**
   - Added `customerOrder` prop to receive all ordered items
   - Re-added dependency on PRODUCT_DATABASE to show all catalog products
   - Updated dropdown to show ALL catalog products in an optgroup
   - Added second optgroup for custom products from cart (if any)
   - Users can now place ANY item (catalog or custom), not just items from cart
   - This enables testing scenarios where extra/unexpected items appear in package

5. **src/App.tsx**
   - Destructured `orderId`, `orderName`, `setOrderId`, `setOrderName` from hook
   - Passed new props to CartManagement component
   - Passed new props to ExpectedItems component
   - Passed `customerOrder` prop to ItemPlacement component

### User Workflow
1. User enters custom Order ID and Order Name (optional) in Step 1
2. User selects order mode:
   - **Catalog Mode**: Choose product from dropdown, set quantity, add to cart
   - **Custom Mode**: Type custom product name, set quantity, add to cart
3. User can mix catalog and custom products in the same order
4. User confirms order (locks the Order ID, Name, and products)
5. Step 2 dropdown shows:
   - **All catalog products** (in "Catalog Products" group)
   - **Custom products from cart** (in "Custom Products" group, if any)
6. User can place items from cart OR place extra items not in cart (for testing)
7. User places items on canvas and scans
8. Final verification report identifies:
   - Items in cart that are missing
   - Extra items placed but not in cart (will show as "EXTRA" items)
9. Final verification report uses the custom Order ID and includes all products
