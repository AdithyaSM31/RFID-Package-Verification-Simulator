import React from 'react';
import { Package } from 'lucide-react';

interface ExpectedItemsProps {
  customerOrder: string[];
  placedItems: any[];
  orderConfirmed: boolean;
  orderId: string;
  orderName: string;
}

export const ExpectedItems: React.FC<ExpectedItemsProps> = ({
  customerOrder,
  placedItems,
  orderConfirmed,
  orderId,
  orderName,
}) => {
  const getItemCounts = (items: string[]) => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return counts;
  };

  const requiredCounts = getItemCounts(customerOrder);
  const detectedNames = placedItems.filter(item => item.detected).map(item => item.name);
  const detectedCounts = getItemCounts(detectedNames);

  const getStatusInfo = (itemName: string, required: number) => {
    const detected = detectedCounts[itemName] || 0;
    
    if (!orderConfirmed) {
      return { text: '', className: '' };
    } else if (detected === 0) {
      return { 
        text: `PENDING (0/${required})`, 
        className: 'text-yellow-400' 
      };
    } else if (detected < required) {
      return { 
        text: `PARTIAL (${detected}/${required})`, 
        className: 'text-orange-400' 
      };
    } else {
      return { 
        text: `DETECTED (${detected}/${required})`, 
        className: 'text-green-400 font-bold' 
      };
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Package className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Expected Items (Shopping Cart)</h3>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
          <span className="font-semibold text-blue-300">Order ID:</span> <span className="text-white">{orderId || 'Not set'}</span>
        </div>
        {orderName && (
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 border border-purple-500/30 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
            <span className="font-semibold text-purple-300">Order Name:</span> <span className="text-white">{orderName}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {Object.entries(requiredCounts).map(([itemName, requiredQty]) => {
          const status = getStatusInfo(itemName, requiredQty);
          return (
            <div key={itemName} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
              <span className="text-gray-300">{itemName} (x{requiredQty})</span>
              <span className={`text-sm ${status.className}`}>
                {status.text}
              </span>
            </div>
          );
        })}
        {customerOrder.length === 0 && (
          <div className="text-gray-500 text-center py-4">
            No items in cart
          </div>
        )}
      </div>
    </div>
  );
};