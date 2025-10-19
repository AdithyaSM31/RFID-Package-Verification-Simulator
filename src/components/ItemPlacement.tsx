import React from 'react';
import { Package, RotateCcw } from 'lucide-react';
import { PRODUCT_DATABASE } from '../data/products';

interface ItemPlacementProps {
  selectedItem: string;
  orderConfirmed: boolean;
  scanMode: boolean;
  customerOrder: string[];
  onItemSelect: (itemName: string) => void;
  onAddItem: () => void;
  onClearAll: () => void;
}

export const ItemPlacement: React.FC<ItemPlacementProps> = ({
  selectedItem,
  orderConfirmed,
  scanMode,
  customerOrder,
  onItemSelect,
  onAddItem,
  onClearAll,
}) => {
  const isDisabled = !orderConfirmed || scanMode;
  
  // Get unique custom items from customer order (items not in catalog)
  const customItems = Array.from(new Set(customerOrder)).filter(
    itemName => !PRODUCT_DATABASE.find(p => p.name === itemName)
  );

  const handleClearAll = () => {
    if (window.confirm('This will clear all placed items AND reset the order. Continue?')) {
      onClearAll();
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-500/10 rounded-lg">
          <Package className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Step 2: Configure Package Items</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Item:
          </label>
          <select
            value={selectedItem}
            onChange={(e) => onItemSelect(e.target.value)}
            disabled={isDisabled}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
          >
            <option value="">Choose an item...</option>
            <optgroup label="Catalog Products">
              {PRODUCT_DATABASE.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </optgroup>
            {customItems.length > 0 && (
              <optgroup label="Custom Products">
                {customItems.map((itemName, index) => (
                  <option key={`custom-${index}`} value={itemName}>
                    {itemName}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
        
        <button
          onClick={onAddItem}
          disabled={isDisabled || !selectedItem}
          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/20"
        >
          Add Selected Item (Click Canvas)
        </button>
        
        <button
          onClick={handleClearAll}
          className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          Clear All Items & Reset Order
        </button>
      </div>
    </div>
  );
};