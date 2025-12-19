import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

const sizeData = {
  tops: {
    headers: ['Size', 'Chest (in)', 'Length (in)', 'Shoulder (in)'],
    rows: [
      ['XS', '34-36', '26', '16'],
      ['S', '36-38', '27', '17'],
      ['M', '38-40', '28', '18'],
      ['L', '40-42', '29', '19'],
      ['XL', '42-44', '30', '20'],
      ['XXL', '44-46', '31', '21'],
    ]
  },
  bottoms: {
    headers: ['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)'],
    rows: [
      ['28', '28', '34', '30'],
      ['30', '30', '36', '31'],
      ['32', '32', '38', '32'],
      ['34', '34', '40', '32'],
      ['36', '36', '42', '33'],
    ]
  },
  accessories: {
    headers: ['Size', 'Head Circumference (in)'],
    rows: [
      ['S', '21-22'],
      ['M', '22-23'],
      ['L', '23-24'],
      ['One Size', '21-24'],
    ]
  }
};

const SizeGuideModal = ({ isOpen, onClose, category }: SizeGuideModalProps) => {
  const getDefaultTab = () => {
    if (!category) return 'tops';
    const lower = category.toLowerCase();
    if (['hoodies', 't-shirts', 'sweaters', 'jackets'].includes(lower)) return 'tops';
    if (['pants'].includes(lower)) return 'bottoms';
    if (['accessories'].includes(lower)) return 'accessories';
    return 'tops';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card rounded-lg shadow-xl z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Ruler className="w-6 h-6 text-primary" />
                <h2 className="font-display text-2xl font-bold">Size Guide</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <Tabs defaultValue={getDefaultTab()} className="w-full">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="tops" className="flex-1">Tops</TabsTrigger>
                  <TabsTrigger value="bottoms" className="flex-1">Bottoms</TabsTrigger>
                  <TabsTrigger value="accessories" className="flex-1">Accessories</TabsTrigger>
                </TabsList>

                {Object.entries(sizeData).map(([key, data]) => (
                  <TabsContent key={key} value={key}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            {data.headers.map(header => (
                              <th
                                key={header}
                                className="py-3 px-4 text-left font-semibold text-foreground"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.rows.map((row, idx) => (
                            <tr key={idx} className="border-b border-border/50 last:border-0">
                              {row.map((cell, cellIdx) => (
                                <td
                                  key={cellIdx}
                                  className="py-3 px-4 text-muted-foreground"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">How to Measure</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <strong>Chest:</strong> Measure around the fullest part of your chest</li>
                        <li>• <strong>Waist:</strong> Measure around your natural waistline</li>
                        <li>• <strong>Hip:</strong> Measure around the fullest part of your hips</li>
                        <li>• <strong>Inseam:</strong> Measure from crotch to ankle</li>
                      </ul>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SizeGuideModal;
