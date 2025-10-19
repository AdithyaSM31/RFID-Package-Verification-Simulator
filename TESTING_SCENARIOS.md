# Testing Scenarios Guide

## Overview
The RFID Package Verification System now supports comprehensive testing scenarios including detection of missing items, extra items, and mixed verification states.

## Test Scenario 1: Perfect Match (SUCCESS)
**Goal**: All expected items are placed and detected.

**Steps**:
1. Add to cart: 2x Laptop, 1x Smartphone
2. Set Order ID: TEST-001
3. Confirm order
4. In Step 2, place exactly:
   - 2x Laptop on canvas
   - 1x Smartphone on canvas
5. Initiate scan
6. **Expected Result**: ✅ SUCCESS - All items detected, no missing, no extra

---

## Test Scenario 2: Missing Items (MISMATCH)
**Goal**: Some expected items are not placed in the package.

**Steps**:
1. Add to cart: 3x Tablet, 2x Headphones
2. Set Order ID: TEST-002
3. Confirm order
4. In Step 2, place only:
   - 2x Tablet (missing 1)
   - 1x Headphones (missing 1)
5. Initiate scan
6. **Expected Result**: ❌ MISMATCH - Missing: 1x Tablet, 1x Headphones

---

## Test Scenario 3: Extra Items (CAUTION)
**Goal**: Items not in the order appear in the package.

**Steps**:
1. Add to cart: 1x Laptop
2. Set Order ID: TEST-003
3. Confirm order
4. In Step 2, place:
   - 1x Laptop (expected)
   - 1x Smartwatch (NOT in cart - extra!)
   - 1x Tablet (NOT in cart - extra!)
5. Initiate scan
6. **Expected Result**: ⚠️ CAUTION - All expected found, but Extra: 1x Smartwatch, 1x Tablet

---

## Test Scenario 4: Mixed (MISMATCH + Extra)
**Goal**: Both missing items AND extra items detected.

**Steps**:
1. Add to cart: 2x Smartphone, 2x Headphones
2. Set Order ID: TEST-004
3. Confirm order
4. In Step 2, place:
   - 1x Smartphone (missing 1)
   - 2x Headphones (correct)
   - 1x Tablet (extra!)
5. Initiate scan
6. **Expected Result**: ❌ MISMATCH - Missing: 1x Smartphone, Extra: 1x Tablet

---

## Test Scenario 5: Custom Products Only
**Goal**: Test with custom products not in catalog.

**Steps**:
1. Switch to "Custom Product" mode
2. Add to cart: 2x "Industrial Sensor", 1x "Control Panel"
3. Set Order ID: TEST-CUSTOM-001
4. Confirm order
5. In Step 2, place:
   - 2x Industrial Sensor
   - 1x Control Panel
6. Initiate scan
7. **Expected Result**: ✅ SUCCESS - Custom products verified correctly

---

## Test Scenario 6: Mixed Catalog + Custom Products
**Goal**: Verify mixed order with both catalog and custom items.

**Steps**:
1. Add to cart (Catalog mode): 1x Laptop
2. Switch to Custom mode
3. Add to cart: 1x "Custom Cable"
4. Switch back to Catalog
5. Add to cart: 2x Smartphone
6. Set Order ID: TEST-MIXED-001
7. Confirm order
8. In Step 2, place all items:
   - 1x Laptop
   - 1x Custom Cable
   - 2x Smartphone
9. Initiate scan
10. **Expected Result**: ✅ SUCCESS - Both catalog and custom items verified

---

## Test Scenario 7: Empty Package (Worst Case)
**Goal**: Nothing placed, everything missing.

**Steps**:
1. Add to cart: 2x Laptop, 1x Tablet, 1x Smartphone
2. Set Order ID: TEST-EMPTY-001
3. Confirm order
4. In Step 2, **don't place anything** (leave canvas empty)
5. Try to initiate scan
6. **Expected Result**: Cannot scan (no items placed) OR all items marked as MISSING

---

## Test Scenario 8: Extra Items Only (No Order)
**Goal**: Items in package that weren't ordered at all.

**Steps**:
1. Add to cart: 1x Laptop
2. Set Order ID: TEST-EXTRA-ONLY-001
3. Confirm order
4. In Step 2, place:
   - 1x Laptop (expected)
   - 2x Tablet (extra)
   - 1x Headphones (extra)
   - 1x Smartwatch (extra)
5. Initiate scan
6. **Expected Result**: ⚠️ CAUTION - Expected items found, but 4 extra items detected

---

## Test Scenario 9: Quantity Mismatch
**Goal**: Correct product but wrong quantity.

**Steps**:
1. Add to cart: 5x Headphones
2. Set Order ID: TEST-QTY-001
3. Confirm order
4. In Step 2, place only:
   - 3x Headphones (missing 2)
5. Initiate scan
6. **Expected Result**: ❌ MISMATCH - Missing: 2x Headphones

---

## Test Scenario 10: Complete Wrong Items
**Goal**: Completely different items than ordered.

**Steps**:
1. Add to cart: 2x Laptop, 1x Smartphone
2. Set Order ID: TEST-WRONG-001
3. Confirm order
4. In Step 2, place:
   - 2x Tablet (extra, wrong item)
   - 1x Smartwatch (extra, wrong item)
   - (Don't place Laptop or Smartphone)
5. Initiate scan
6. **Expected Result**: ❌ MISMATCH - Missing: 2x Laptop, 1x Smartphone; Extra: 2x Tablet, 1x Smartwatch

---

## Verification Status Meanings

| Status | Icon | Meaning |
|--------|------|---------|
| **SUCCESS** | ✅ | All expected items detected, no missing items, no extra items |
| **MISMATCH** | ❌ | One or more expected items are missing (regardless of extra items) |
| **CAUTION** | ⚠️ | All expected items detected BUT extra items found in package |

## Tips for Testing

1. **Use Clear Order IDs**: Name tests like TEST-001, TEST-MISSING-001, etc.
2. **Reset Between Tests**: Click "Clear All Items & Reset Order" to start fresh
3. **Test Edge Cases**: Empty packages, single items, large quantities
4. **Mix Modes**: Test catalog-only, custom-only, and mixed orders
5. **Verify Metrics**: Check the dashboard shows correct counts
6. **Review Details**: Open verification modal to see detailed breakdown
