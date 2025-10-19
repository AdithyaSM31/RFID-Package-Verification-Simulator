import { useState, useCallback, useRef, useEffect } from 'react';
import { Item, VerificationData, Scanner } from '../types';
import { PRODUCT_DATABASE } from '../data/products';

export const useRFIDSimulation = () => {
  const [customerOrder, setCustomerOrder] = useState<string[]>([]);
  const [placedItems, setPlacedItems] = useState<Item[]>([]);
  const [detectedRfids, setDetectedRfids] = useState<Set<string>>(new Set());
  const [expectedRfidsSet, setExpectedRfidsSet] = useState<Set<string>>(new Set());
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [scanner, setScanner] = useState<Scanner>({ x: 100, y: 100, range: 80, active: false });
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [orderName, setOrderName] = useState<string>('');
  const scanStartTimeRef = useRef<number>(0);
  const itemInstanceCounterRef = useRef<Record<string, number>>({});
  const rfidToNameMapRef = useRef<Map<string, string>>(new Map());

  const addToCart = useCallback((productName: string, quantity: number) => {
    const newItems = Array(quantity).fill(productName);
    setCustomerOrder(prev => [...prev, ...newItems]);
  }, []);

  const clearCart = useCallback(() => {
    setCustomerOrder([]);
  }, []);

  const confirmOrder = useCallback(() => {
    if (customerOrder.length === 0) return false;
    
    setOrderConfirmed(true);
    
    const expectedSet = new Set<string>();
    const rfidToNameMap = new Map<string, string>();
    const tempCounter: Record<string, number> = {};
    
    customerOrder.forEach(itemName => {
      tempCounter[itemName] = (tempCounter[itemName] || 0) + 1;
      const product = PRODUCT_DATABASE.find(p => p.name === itemName);
      
      // Generate RFID for both catalog and custom products
      const rfidBase = product 
        ? product.rfid 
        : `CUSTOM-${itemName.toUpperCase().replace(/\s+/g, '-').substring(0, 20)}`;
      
      const uniqueRfid = `${rfidBase}-${tempCounter[itemName]}`;
      expectedSet.add(uniqueRfid);
      rfidToNameMap.set(uniqueRfid, itemName);
    });
    
    setExpectedRfidsSet(expectedSet);
    rfidToNameMapRef.current = rfidToNameMap;
    return true;
  }, [customerOrder]);

  const addItemToPackage = useCallback((x: number, y: number) => {
    if (!orderConfirmed || !selectedItem) return null;
    
    const product = PRODUCT_DATABASE.find(p => p.name === selectedItem);
    
    itemInstanceCounterRef.current[selectedItem] = (itemInstanceCounterRef.current[selectedItem] || 0) + 1;
    const instanceCount = itemInstanceCounterRef.current[selectedItem];
    
    // Generate RFID for both catalog and custom products
    const rfidBase = product 
      ? product.rfid 
      : `CUSTOM-${selectedItem.toUpperCase().replace(/\s+/g, '-').substring(0, 20)}`;
    
    const uniqueRfid = `${rfidBase}-${instanceCount}`;
    
    // Generate ID for both catalog and custom products
    const itemId = product 
      ? `${product.id}-${instanceCount}` 
      : `custom-${selectedItem.toLowerCase().replace(/\s+/g, '-')}-${instanceCount}`;

    const newItem: Item = {
      id: itemId,
      name: selectedItem,
      rfidTag: uniqueRfid,
      x,
      y,
      size: 20,
      detected: false
    };

    setPlacedItems(prev => [...prev, newItem]);
    setSelectedItem('');
    return newItem;
  }, [orderConfirmed, selectedItem]);

  const startAutoScan = useCallback(() => {
    const PACKAGE_BOUNDS = { x1: 50, y1: 50, x2: 700, y2: 650 };
    const SCAN_SPEED = 25; // 5 times faster
    const SCAN_DELAY = 50;

    let currentX = PACKAGE_BOUNDS.x1;
    let currentY = PACKAGE_BOUNDS.y1;
    let direction = 1;

    const scanInterval = setInterval(() => {
      setScanner(prev => ({ ...prev, x: currentX, y: currentY }));

      setPlacedItems(prevItems => {
        const newDetected = new Set<string>();
        const updatedItems = prevItems.map(item => {
          if (!item.detected) {
            const distance = Math.sqrt((item.x - currentX) ** 2 + (item.y - currentY) ** 2);
            if (distance <= scanner.range) {
              newDetected.add(item.rfidTag);
              return { ...item, detected: true };
            }
          }
          return item;
        });

        if (newDetected.size > 0) {
          setDetectedRfids(prevRfids => new Set([...prevRfids, ...newDetected]));
        }
        return updatedItems;
      });

      currentX += SCAN_SPEED * direction;

      if (currentX >= PACKAGE_BOUNDS.x2 || currentX <= PACKAGE_BOUNDS.x1) {
        direction *= -1;
        currentY += scanner.range / 2;
        if (currentX >= PACKAGE_BOUNDS.x2) currentX = PACKAGE_BOUNDS.x2;
        if (currentX <= PACKAGE_BOUNDS.x1) currentX = PACKAGE_BOUNDS.x1;
      }

      if (currentY >= PACKAGE_BOUNDS.y2) {
        clearInterval(scanInterval);
        setTimeout(() => finalizeScanRef.current(), 1000);
      }
    }, SCAN_DELAY);
  }, [scanner.range]);

  const initiateScan = useCallback(() => {
    if (placedItems.length === 0) return false;
    
    setScanMode(true);
    setScanner(prev => ({ ...prev, active: true }));
    scanStartTimeRef.current = Date.now();
    
    startAutoScan();
    return true;
  }, [placedItems.length, startAutoScan]);

  const updateScannerPosition = useCallback((x: number, y: number) => {
    if (!scanMode) return;
    
    setScanner(prev => ({ ...prev, x, y }));
    
    const newDetectedRfids = new Set(detectedRfids);
    let itemsUpdated = false;

    setPlacedItems(prev => prev.map(item => {
      if (!item.detected) {
        const distance = Math.sqrt((item.x - x) ** 2 + (item.y - y) ** 2);
        if (distance <= scanner.range) {
          newDetectedRfids.add(item.rfidTag);
          itemsUpdated = true;
          return { ...item, detected: true };
        }
      }
      return item;
    }));

    if (itemsUpdated) {
      setDetectedRfids(newDetectedRfids);
    }
  }, [scanMode, scanner.range, detectedRfids]);

  const finalizeScan = useCallback(() => {
    const scanDuration = (Date.now() - scanStartTimeRef.current) / 1000;
    setScanMode(false);
    setScanner(prev => ({ ...prev, active: false }));

    const missingRfids = new Set([...expectedRfidsSet].filter(rfid => !detectedRfids.has(rfid)));
    const extraRfids = new Set([...detectedRfids].filter(rfid => !expectedRfidsSet.has(rfid)));

    const getMissingCounts = () => {
      const counts: Record<string, number> = {};
      missingRfids.forEach(rfid => {
        const itemName = rfidToNameMapRef.current.get(rfid);
        if (itemName) {
          counts[itemName] = (counts[itemName] || 0) + 1;
        }
      });
      return counts;
    };

    const getExtraCounts = () => {
      const counts: Record<string, number> = {};
      extraRfids.forEach(rfid => {
        const item = placedItems.find(p => p.rfidTag === rfid);
        if (item) {
          counts[item.name] = (counts[item.name] || 0) + 1;
        }
      });
      return counts;
    };

    const getItemCounts = (items: string[]) => {
      const counts: Record<string, number> = {};
      items.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
      });
      return counts;
    };

    const detectedItemNames = [...detectedRfids].map(rfid => rfidToNameMapRef.current.get(rfid) || 'Unknown Item');

    let status: 'SUCCESS' | 'MISMATCH' | 'CAUTION';
    if (missingRfids.size > 0) {
      status = 'MISMATCH';
    } else if (extraRfids.size > 0) {
      status = 'CAUTION';
    } else {
      status = 'SUCCESS';
    }

    const verificationResult: VerificationData = {
      orderId: orderId || `AUTO_${new Date().toISOString().replace(/[:.]/g, '')}`,
      timestamp: new Date().toISOString(),
      verificationStatus: status,
      scanDurationSeconds: Math.round(scanDuration * 100) / 100,
      metrics: {
        expectedItemsCount: expectedRfidsSet.size,
        placedItemsCount: placedItems.length,
        detectedItemsCount: detectedRfids.size,
        missingItemsCount: missingRfids.size,
        extraItemsCount: extraRfids.size,
      },
      expectedItems: getItemCounts(customerOrder),
      detectedItems: getItemCounts(detectedItemNames),
      missingItemsDetail: getMissingCounts(),
      extraItemsDetail: getExtraCounts(),
    };

    setVerificationData(verificationResult);
    return verificationResult;
  }, [customerOrder, placedItems, detectedRfids, expectedRfidsSet]);

  const finalizeScanRef = useRef(finalizeScan);
  useEffect(() => {
    finalizeScanRef.current = finalizeScan;
  }, [finalizeScan]);

  const clearAllItems = useCallback(() => {
    setPlacedItems([]);
    setOrderConfirmed(false);
    setScanMode(false);
    setDetectedRfids(new Set());
    setExpectedRfidsSet(new Set());
    setCustomerOrder([]);
    setVerificationData(null);
    setSelectedItem('');
    setOrderId('');
    setOrderName('');
    itemInstanceCounterRef.current = {};
    rfidToNameMapRef.current.clear();
    setScanner({ x: 100, y: 100, range: 80, active: false });
  }, []);

  const updateScannerRange = useCallback((range: number) => {
    setScanner(prev => ({ ...prev, range }));
  }, []);

  return {
    customerOrder,
    placedItems,
    detectedRfids,
    orderConfirmed,
    scanMode,
    scanner,
    verificationData,
    selectedItem,
    orderId,
    orderName,
    addToCart,
    clearCart,
    confirmOrder,
    addItemToPackage,
    initiateScan,
    updateScannerPosition,
    finalizeScan,
    clearAllItems,
    updateScannerRange,
    setSelectedItem,
    setOrderId,
    setOrderName,
  };
};
