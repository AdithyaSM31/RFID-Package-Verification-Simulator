import React, { useRef, useEffect, useState } from 'react';
import { Item, Scanner } from '../types';

interface PackageCanvasProps {
  placedItems: Item[];
  scanner: Scanner;
  orderConfirmed: boolean;
  scanMode: boolean;
  onCanvasClick: (x: number, y: number) => void;
  onScannerMove: (x: number, y: number) => void;
}

export const PackageCanvas: React.FC<PackageCanvasProps> = ({
  placedItems,
  scanner,
  orderConfirmed,
  scanMode,
  onCanvasClick,
  onScannerMove,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const PACKAGE_BOUNDS = { x1: 50, y1: 50, x2: 700, y2: 650 };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw package boundary
    ctx.strokeStyle = 'black';
    ctx.setLineDash([5, 2]);
    ctx.lineWidth = 3;
    ctx.strokeRect(
      PACKAGE_BOUNDS.x1,
      PACKAGE_BOUNDS.y1,
      PACKAGE_BOUNDS.x2 - PACKAGE_BOUNDS.x1,
      PACKAGE_BOUNDS.y2 - PACKAGE_BOUNDS.y1
    );
    ctx.setLineDash([]);

    // Draw items
    placedItems.forEach((item) => {
      const color = item.detected ? '#2ecc71' : 'white';
      const outlineColor = item.detected ? 'darkgreen' : 'gray';

      // Draw item rectangle
      ctx.fillStyle = color;
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 1;
      ctx.fillRect(
        item.x - item.size / 2,
        item.y - item.size / 2,
        item.size,
        item.size
      );
      ctx.strokeRect(
        item.x - item.size / 2,
        item.y - item.size / 2,
        item.size,
        item.size
      );

      // Draw item name
      ctx.fillStyle = color;
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.name, item.x, item.y + item.size / 2 + 12);

      // Draw RFID tag
      ctx.font = '8px Arial';
      ctx.fillText(item.rfidTag, item.x, item.y - item.size / 2 - 8);
    });

    // Draw scanner if active
    if (scanner.active) {
      ctx.strokeStyle = '#1abc9c';
      ctx.setLineDash([4, 2]);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(scanner.x, scanner.y, scanner.range, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [placedItems, scanner]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (scanMode) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    onCanvasClick(x, y);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!scanMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if clicking on scanner
    const distance = Math.sqrt((x - scanner.x) ** 2 + (y - scanner.y) ** 2);
    if (distance <= scanner.range) {
      setIsDragging(true);
      setDragOffset({ x: x - scanner.x, y: y - scanner.y });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !scanMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - dragOffset.x;
    const y = event.clientY - rect.top - dragOffset.y;

    onScannerMove(x, y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const getStatusText = () => {
    if (!orderConfirmed) {
      return 'Package Contents (Disabled until order is confirmed)';
    } else if (scanMode) {
      return 'Package Contents (Auto-scanning in progress...)';
    } else {
      return 'Package Contents (Click to Place Items)';
    }
  };

  const getStatusColor = () => {
    if (!orderConfirmed) return 'text-gray-500';
    return 'text-white';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
      <div className="mb-4">
        <h3 className={`text-lg font-bold ${getStatusColor()}`}>
          {getStatusText()}
        </h3>
      </div>
      <canvas
        ref={canvasRef}
        width={750}
        height={700}
        className={`border-2 border-slate-700/50 rounded-lg ${scanMode ? 'cursor-wait' : orderConfirmed ? 'cursor-crosshair' : 'cursor-not-allowed'} shadow-inner`}
        onClick={handleCanvasClick}
      />
    </div>
  );
};