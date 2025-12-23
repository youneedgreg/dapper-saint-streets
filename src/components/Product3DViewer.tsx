import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw, ZoomIn, ZoomOut, Move3D, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product3DViewerProps {
  productName: string;
  images360: string[];
  onClose: () => void;
}

// Dummy 360 images for different angles (simulating a full rotation)
const dummy360Images = [
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop",
];

const Product3DViewer = ({ productName, images360, onClose }: Product3DViewerProps) => {
  const images = images360.length > 0 ? images360 : dummy360Images;
  const [currentFrame, setCurrentFrame] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  // Preload images
  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // Auto-rotation
  useEffect(() => {
    if (isAutoRotating && !isDragging) {
      autoRotateRef.current = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % images.length);
      }, 150);
    }
    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [isAutoRotating, isDragging, images.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const sensitivity = 10;
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame(prev => {
        const newFrame = prev + direction;
        if (newFrame < 0) return images.length - 1;
        if (newFrame >= images.length) return 0;
        return newFrame;
      });
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    const sensitivity = 10;
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame(prev => {
        const newFrame = prev + direction;
        if (newFrame < 0) return images.length - 1;
        if (newFrame >= images.length) return 0;
        return newFrame;
      });
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
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
        ref={containerRef}
        className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="relative"
          style={{ transform: `scale(${zoom})` }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <img 
            src={images[currentFrame]} 
            alt={`${productName} - angle ${currentFrame + 1}`}
            className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl pointer-events-none"
            draggable={false}
          />
          
          {/* Frame indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="flex gap-1">
              {images.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentFrame ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-4 p-4 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
        >
          <ZoomOut className="w-4 h-4 mr-2" /> Zoom Out
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAutoRotating(!isAutoRotating)}
        >
          {isAutoRotating ? (
            <><Pause className="w-4 h-4 mr-2" /> Pause</>
          ) : (
            <><Play className="w-4 h-4 mr-2" /> Auto Rotate</>
          )}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { setCurrentFrame(0); setZoom(1); setIsAutoRotating(true); }}
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setZoom(z => Math.min(2, z + 0.2))}
        >
          <ZoomIn className="w-4 h-4 mr-2" /> Zoom In
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground pb-4">
        Drag left/right to rotate • Use buttons to zoom
      </p>
    </motion.div>
  );
};

export default Product3DViewer;
