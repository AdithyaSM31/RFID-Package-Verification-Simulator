import React, { useState } from 'react';
import { Radar, Play, CheckCircle } from 'lucide-react';

interface ScannerProps {
  orderConfirmed: boolean;
  scanMode: boolean;
  scannerRange: number;
  placedItemsCount: number;
  onInitiateScan: () => boolean;
  onFinalizeScan: () => void;
  onRangeChange: (range: number) => void;
}

export const Scanner: React.FC<ScannerProps> = ({
  orderConfirmed,
  scanMode,
  scannerRange,
  placedItemsCount,
  onInitiateScan,
  onFinalizeScan,
  onRangeChange,
}) => {
  const [rangeInput, setRangeInput] = useState(scannerRange.toString());

  const handleInitiateScan = () => {
    const success = onInitiateScan();
    if (!success) {
      alert('Please add items to the package before scanning.');
    }
  };

  const handleRangeChange = (value: string) => {
    setRangeInput(value);
    const numValue = parseInt(value) || 80;
    onRangeChange(numValue);
  };

  const isInitiateDisabled = !orderConfirmed || scanMode || placedItemsCount === 0;
  const isFinalizeDisabled = !scanMode;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-500/10 rounded-lg">
          <Radar className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Step 3: Scan Package</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Scan Range (px):
          </label>
          <input
            type="number"
            min="20"
            max="200"
            value={rangeInput}
            onChange={(e) => handleRangeChange(e.target.value)}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleInitiateScan}
            disabled={isInitiateDisabled}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-500/20"
          >
            <Play className="w-4 h-4" />
            Initiate Scan
          </button>
          <button
            onClick={onFinalizeScan}
            disabled={isFinalizeDisabled}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20"
          >
            <CheckCircle className="w-4 h-4" />
            Finalize Verification
          </button>
        </div>
      </div>
    </div>
  );
};