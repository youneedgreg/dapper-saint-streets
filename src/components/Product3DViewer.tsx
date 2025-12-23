import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw, ZoomIn, ZoomOut, Move3D } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product3DViewerProps {
  productName: string;
  productImage: string;
  onClose: () => void;
}

const Product3DViewer = ({ productName, productImage, onClose }: Product3DViewerProps) => {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setRotation(prev => prev + deltaX * 0.5);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Move3D className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-semibold">{productName} - 360° View</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div 
        className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <motion.div
          className="relative"
          style={{ 
            transform: `perspective(1000px) rotateY(${rotation}deg) scale(${zoom})`,
            transformStyle: 'preserve-3d'
          }}
        >
          <img 
            src={productImage} 
            alt={productName}
            className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl pointer-events-none"
            draggable={false}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20 rounded-lg pointer-events-none"
            style={{ transform: `rotateY(${rotation * 0.1}deg)` }}
          />
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-4 p-4 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
        >
          <ZoomOut className="w-4 h-4 mr-2" /> Zoom Out
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setRotation(0)}
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setZoom(z => Math.min(2, z + 0.1))}
        >
          <ZoomIn className="w-4 h-4 mr-2" /> Zoom In
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground pb-4">
        Drag to rotate • Use buttons to zoom
      </p>
    </motion.div>
  );
};

export default Product3DViewer;
