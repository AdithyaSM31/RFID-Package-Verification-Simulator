import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useRFIDSimulation } from './hooks/useRFIDSimulation';
import { CartManagement } from './components/CartManagement';
import { ExpectedItems } from './components/ExpectedItems';
import { ItemPlacement } from './components/ItemPlacement';
import { PackageCanvas } from './components/PackageCanvas';
import { Scanner } from './components/Scanner';
import { MetricsDashboard } from './components/MetricsDashboard';
import { VerificationModal } from './components/VerificationModal';

function App() {
  const {
    customerOrder,
    placedItems,
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
  } = useRFIDSimulation();

  const [showModal, setShowModal] = useState(false);

  const handleCanvasClick = (x: number, y: number) => {
    if (!orderConfirmed || scanMode) return;

    // Check if click is within package bounds
    const PACKAGE_BOUNDS = { x1: 50, y1: 50, x2: 700, y2: 650 };
    if (x < PACKAGE_BOUNDS.x1 || x > PACKAGE_BOUNDS.x2 || y < PACKAGE_BOUNDS.y1 || y > PACKAGE_BOUNDS.y2) {
      alert('Please click inside the black dashed package boundary.');
      return;
    }

    addItemToPackage(x, y);
  };

  const handleAddItem = () => {
    if (!selectedItem) {
      alert('Please select an item first.');
      return;
    }
    // This will prepare the item for placement on canvas
  };

  const handleFinalizeScan = () => {
    const result = finalizeScan();
    if (result) {
      setShowModal(true);
    }
  };

  // Auto-show modal when verification completes
  React.useEffect(() => {
    if (verificationData && !scanMode) {
      setShowModal(true);
    }
  }, [verificationData, scanMode]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Shield className="w-7 h-7 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              RFID Package Verification System
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Top Section - Order Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cart Management */}
          <CartManagement
            customerOrder={customerOrder}
            orderConfirmed={orderConfirmed}
            orderId={orderId}
            orderName={orderName}
            onAddToCart={addToCart}
            onClearCart={clearCart}
            onConfirmOrder={confirmOrder}
            onOrderIdChange={setOrderId}
            onOrderNameChange={setOrderName}
          />

          {/* Expected Items */}
          <ExpectedItems
            customerOrder={customerOrder}
            placedItems={placedItems}
            orderConfirmed={orderConfirmed}
            orderId={orderId}
            orderName={orderName}
          />
        </div>

        {/* Middle Section - Canvas and Controls */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Canvas - Takes 2 columns */}
          <div className="xl:col-span-2">
            <PackageCanvas
              placedItems={placedItems}
              scanner={scanner}
              orderConfirmed={orderConfirmed}
              scanMode={scanMode}
              onCanvasClick={handleCanvasClick}
              onScannerMove={updateScannerPosition}
            />
          </div>

          {/* Right Side - Item Placement & Scanner */}
          <div className="space-y-6">
            {/* Item Placement */}
            <ItemPlacement
              selectedItem={selectedItem}
              orderConfirmed={orderConfirmed}
              scanMode={scanMode}
              customerOrder={customerOrder}
              onItemSelect={setSelectedItem}
              onAddItem={handleAddItem}
              onClearAll={clearAllItems}
            />

            {/* Scanner */}
            <Scanner
              orderConfirmed={orderConfirmed}
              scanMode={scanMode}
              scannerRange={scanner.range}
              placedItemsCount={placedItems.length}
              onInitiateScan={initiateScan}
              onFinalizeScan={handleFinalizeScan}
              onRangeChange={updateScannerRange}
            />
          </div>
        </div>

        {/* Bottom Section - Metrics Dashboard */}
        <div>
          <MetricsDashboard
            verificationData={verificationData}
          />
        </div>
      </div>

      {/* Verification Modal */}
      {verificationData && (
        <VerificationModal
          verificationData={verificationData}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;