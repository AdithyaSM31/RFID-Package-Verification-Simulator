export interface Product {
  id: string;
  name: string;
  rfid: string;
}

export interface Item {
  id: string;
  name: string;
  rfidTag: string;
  x: number;
  y: number;
  size: number;
  detected: boolean;
}

export interface VerificationData {
  orderId: string;
  timestamp: string;
  verificationStatus: 'SUCCESS' | 'MISMATCH' | 'CAUTION';
  scanDurationSeconds: number;
  metrics: {
    expectedItemsCount: number;
    placedItemsCount: number;
    detectedItemsCount: number;
    missingItemsCount: number;
    extraItemsCount: number;
  };
  expectedItems: Record<string, number>;
  detectedItems: Record<string, number>;
  missingItemsDetail: Record<string, number>;
  extraItemsDetail: Record<string, number>;
}

export interface Scanner {
  x: number;
  y: number;
  range: number;
  active: boolean;
}