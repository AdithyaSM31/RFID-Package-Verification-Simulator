import React, { useRef, useEffect } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { VerificationData } from '../types';

interface MetricsDashboardProps {
  verificationData: VerificationData | null;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  verificationData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !verificationData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;

    const { metrics } = verificationData;
    const data = [
      { label: 'Expected', value: metrics.expectedItemsCount, color: '#60a5fa', gradient: ['#3b82f6', '#60a5fa'] },
      { label: 'Detected', value: metrics.detectedItemsCount, color: '#4ade80', gradient: ['#22c55e', '#4ade80'] },
      { label: 'Missing', value: metrics.missingItemsCount, color: '#f87171', gradient: ['#ef4444', '#f87171'] },
      { label: 'Extra', value: metrics.extraItemsCount, color: '#fb923c', gradient: ['#f97316', '#fb923c'] },
    ];

    // Clear canvas with gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#1e293b');
    bgGradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Chart dimensions
    const padding = { top: 50, right: 20, bottom: 60, left: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const barWidth = Math.min(80, chartWidth / data.length - 30);
    const barSpacing = (chartWidth - barWidth * data.length) / (data.length + 1);
    const maxValue = Math.max(...data.map(d => d.value), 1);

    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Verification Summary', width / 2, 30);

    data.forEach((item, index) => {
      const x = padding.left + barSpacing + index * (barWidth + barSpacing);
      const barHeight = (item.value / maxValue) * chartHeight;
      const y = padding.top + chartHeight - barHeight;

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, item.gradient[0]);
      gradient.addColorStop(1, item.gradient[1]);
      
      // Draw shadow
      ctx.shadowColor = item.color;
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 5;
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Draw value on top of bar
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 10);

      // Draw label below bar
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '14px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2, height - 30);
      
      // Draw colored dot under label
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(x + barWidth / 2, height - 15, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw baseline
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(width - padding.right, padding.top + chartHeight);
    ctx.stroke();
  };

  useEffect(() => {
    drawChart();
  }, [verificationData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'text-green-400';
      case 'MISMATCH': return 'text-red-400';
      case 'CAUTION': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const downloadResults = () => {
    if (!verificationData) return;

    const dataStr = JSON.stringify(verificationData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `verification_report_${verificationData.orderId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Verification Dashboard</h3>
        </div>
        {verificationData && (
          <button
            onClick={downloadResults}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        )}
      </div>
      
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-5 mb-6 border border-slate-600/30">
        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          Scan Metrics
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Status</span>
            <div className={`text-lg font-bold mt-1 ${verificationData ? getStatusColor(verificationData.verificationStatus) : 'text-gray-500'}`}>
              {verificationData?.verificationStatus || '-'}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Scan Duration</span>
            <div className="text-lg font-bold text-white mt-1">
              {verificationData ? `${verificationData.scanDurationSeconds}s` : '-'}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Expected</span>
            <div className="text-lg font-bold text-blue-400 mt-1">
              {verificationData?.metrics.expectedItemsCount ?? '-'}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Detected</span>
            <div className="text-lg font-bold text-green-400 mt-1">
              {verificationData?.metrics.detectedItemsCount ?? '-'}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Missing</span>
            <div className="text-lg font-bold text-red-400 mt-1">
              {verificationData?.metrics.missingItemsCount ?? '-'}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Extra</span>
            <div className="text-lg font-bold text-orange-400 mt-1">
              {verificationData?.metrics.extraItemsCount ?? '-'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/30">
        {verificationData ? (
          <canvas
            ref={canvasRef}
            className="w-full h-[300px]"
            style={{ display: 'block' }}
          />
        ) : (
          <div className="text-center text-gray-400 py-20">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Verification Summary</p>
            <p className="text-sm mt-2">Awaiting scan to display chart</p>
          </div>
        )}
      </div>
    </div>
  );
};