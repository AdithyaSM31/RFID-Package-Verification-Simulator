import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, CheckCircle } from 'lucide-react';
import { PRODUCT_DATABASE } from '../data/products';

interface CartManagementProps {
  customerOrder: string[];
  orderConfirmed: boolean;
  orderId: string;
  orderName: string;
  onAddToCart: (productName: string, quantity: number) => void;
  onClearCart: () => void;
  onConfirmOrder: () => boolean;
  onOrderIdChange: (id: string) => void;
  onOrderNameChange: (name: string) => void;
}

export const CartManagement: React.FC<CartManagementProps> = ({
  customerOrder,
  orderConfirmed,
  orderId,
  orderName,
  onAddToCart,
  onClearCart,
  onConfirmOrder,
  onOrderIdChange,
  onOrderNameChange,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_DATABASE[0].name);
  const [quantity, setQuantity] = useState(1);
  const [orderMode, setOrderMode] = useState<'catalog' | 'custom'>('catalog');
  const [customProductName, setCustomProductName] = useState('');

  const handleAddToCart = () => {
    if (quantity < 1) {
      alert('Please enter a valid positive number.');
      return;
    }
    
    const productToAdd = orderMode === 'custom' 
      ? customProductName.trim() 
      : selectedProduct;
    
    if (!productToAdd) {
      alert('Please enter a product name or select from catalog.');
      return;
    }
    
    onAddToCart(productToAdd, quantity);
    
    // Clear custom product name after adding
    if (orderMode === 'custom') {
      setCustomProductName('');
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      onClearCart();
    }
  };

  const handleConfirmOrder = () => {
    const success = onConfirmOrder();
    if (!success) {
      alert('Cannot confirm an empty order.');
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <ShoppingCart className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Step 1: Create Customer Order</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Order ID:
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => onOrderIdChange(e.target.value)}
            placeholder="Enter custom order ID"
            disabled={orderConfirmed}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Order Name:
          </label>
          <input
            type="text"
            value={orderName}
            onChange={(e) => onOrderNameChange(e.target.value)}
            placeholder="Enter custom order name"
            disabled={orderConfirmed}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div className="border-t border-slate-600 pt-4">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Order Mode:
          </label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="orderMode"
                value="catalog"
                checked={orderMode === 'catalog'}
                onChange={(e) => setOrderMode(e.target.value as 'catalog' | 'custom')}
                disabled={orderConfirmed}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-gray-300">Select from Catalog</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="orderMode"
                value="custom"
                checked={orderMode === 'custom'}
                onChange={(e) => setOrderMode(e.target.value as 'catalog' | 'custom')}
                disabled={orderConfirmed}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-gray-300">Custom Product</span>
            </label>
          </div>
        </div>
        
        {orderMode === 'catalog' ? (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product:
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              disabled={orderConfirmed}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            >
              {PRODUCT_DATABASE.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Product Name:
            </label>
            <input
              type="text"
              value={customProductName}
              onChange={(e) => setCustomProductName(e.target.value)}
              placeholder="Enter custom product name"
              disabled={orderConfirmed}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quantity:
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              disabled={orderConfirmed}
              className="flex-1 p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
            <button
              onClick={handleAddToCart}
              disabled={orderConfirmed}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/20"
            >
              <Plus className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleClearCart}
            disabled={orderConfirmed}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
          <button
            onClick={handleConfirmOrder}
            disabled={orderConfirmed}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};