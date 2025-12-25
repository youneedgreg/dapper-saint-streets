import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, ImageIcon, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

interface LookbookItem {
  id: string;
  image_url: string;
  title: string;
  collection: string;
  description?: string;
  product_ids?: string[];
  display_order: number;
  is_active: boolean;
}

interface LookbookFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lookbookItem?: LookbookItem | null;
  onSubmit: (data: Partial<LookbookItem>) => void;
}

const LookbookFormModal = ({ 
  open, 
  onOpenChange, 
  lookbookItem, 
  onSubmit 
}: LookbookFormModalProps) => {
  const [formData, setFormData] = useState({
    image_url: '',
    title: '',
    collection: '',
    description: '',
    product_ids: [] as string[],
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (lookbookItem) {
      setFormData({
        image_url: lookbookItem.image_url || '',
        title: lookbookItem.title || '',
        collection: lookbookItem.collection || '',
        description: lookbookItem.description || '',
        product_ids: lookbookItem.product_ids || [],
        display_order: lookbookItem.display_order || 0,
        is_active: lookbookItem.is_active ?? true,
      });
    } else {
      setFormData({
        image_url: '',
        title: '',
        collection: '',
        description: '',
        product_ids: [],
        display_order: 0,
        is_active: true,
      });
    }
  }, [lookbookItem, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      is_active: e.target.checked,
    }));
  };

  const handleProductToggle = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter(id => id !== productId)
        : [...prev.product_ids, productId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {lookbookItem ? 'Edit Lookbook Item' : 'Add Lookbook Item'}
          </DialogTitle>
          <DialogDescription>
            {lookbookItem 
              ? 'Update the lookbook item details below.'
              : 'Add a new item to your lookbook collection.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Image Preview */}
          {formData.image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Invalid+Image+URL';
                }}
              />
            </div>
          )}

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url">
              Image URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter a direct URL to an image (Unsplash, Imgur, or your own hosting)
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Urban Edge"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Collection */}
          <div className="space-y-2">
            <Label htmlFor="collection">
              Collection <span className="text-destructive">*</span>
            </Label>
            <Input
              id="collection"
              name="collection"
              placeholder="Essentials"
              value={formData.collection}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Optional description for the lookbook item..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              name="display_order"
              type="number"
              min="0"
              placeholder="0"
              value={formData.display_order}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first in the lookbook
            </p>
          </div>

          {/* Is Active */}
          <div className="flex items-center space-x-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleCheckboxChange}
              className="w-4 h-4 rounded border-border"
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Active (visible on the site)
            </Label>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <Label>Linked Products (Optional)</Label>
            <p className="text-xs text-muted-foreground">
              Select products to show in the styled looks when this lookbook item is clicked
            </p>
            <div className="border border-border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
              {products.length > 0 ? (
                products.map(product => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductToggle(product.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left",
                      formData.product_ids.includes(product.id)
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted/30 hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                      formData.product_ids.includes(product.id)
                        ? "border-primary bg-primary"
                        : "border-border"
                    )}>
                      {formData.product_ids.includes(product.id) && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-2">No products available</p>
              )}
            </div>
            {formData.product_ids.length > 0 && (
              <p className="text-xs text-primary font-medium">
                {formData.product_ids.length} product{formData.product_ids.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {lookbookItem ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LookbookFormModal;
