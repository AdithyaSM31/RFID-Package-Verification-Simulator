import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Download } from 'lucide-react';
import { VerificationData } from '../types';

interface VerificationModalProps {
  verificationData: VerificationData;
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  verificationData,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getStatusIcon = () => {
    switch (verificationData.verificationStatus) {
      case 'SUCCESS':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'MISMATCH':
        return <AlertCircle className="w-8 h-8 text-red-400" />;
      case 'CAUTION':
        return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (verificationData.verificationStatus) {
      case 'SUCCESS': return 'text-green-400';
      case 'MISMATCH': return 'text-red-400';
      case 'CAUTION': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(verificationData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `verification_report_${verificationData.orderId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getDetailsText = () => {
    let details = '';
    
    if (Object.keys(verificationData.missingItemsDetail).length > 0) {
      const missingItems = Object.entries(verificationData.missingItemsDetail)
        .map(([name, qty]) => `${name} (x${qty})`)
        .join(', ');
      details += `Missing Items:\n${missingItems}\n\n`;
    }
    
    if (Object.keys(verificationData.extraItemsDetail).length > 0) {
      const extraItems = Object.entries(verificationData.extraItemsDetail)
        .map(([name, qty]) => `${name} (x${qty})`)
        .join(', ');
      details += `Extra Items Found:\n${extraItems}\n\n`;
    }
    
    return details || 'All items verified successfully.';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg border border-slate-600 max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <h2 className="text-xl font-bold text-white">Verification Result</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            {getStatusIcon()}
            <span className={`text-2xl font-bold ${getStatusColor()}`}>
              {verificationData.verificationStatus}
            </span>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4 mb-6">
            <div className="text-white text-sm space-y-2">
              {verificationData.verificationStatus === 'SUCCESS' ? (
                <div className="text-green-400 font-semibold">
                  ✅ All items verified successfully!
                </div>
              ) : (
                <>
                  {Object.keys(verificationData.missingItemsDetail).length > 0 && (
                    <div>
                      <div className="text-red-400 font-semibold mb-1">❌ Missing Items:</div>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        {Object.entries(verificationData.missingItemsDetail).map(([name, qty]) => (
                          <li key={name} className="text-red-300">
                            {name} (x{qty})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {Object.keys(verificationData.extraItemsDetail).length > 0 && (
                    <div className="mt-3">
                      <div className="text-yellow-400 font-semibold mb-1">⚠️ Extra Items Found:</div>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        {Object.entries(verificationData.extraItemsDetail).map(([name, qty]) => (
                          <li key={name} className="text-yellow-300">
                            {name} (x{qty})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={downloadResults}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Save as JSON
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};