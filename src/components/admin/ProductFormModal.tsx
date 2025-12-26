import { useState, useRef } from 'react';
import { X, Upload, Plus, Minus, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { uploadImage, isSupabaseUrl } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  category: string;
  images: string[];
  colors: { name: string; hex: string; image: string }[];
  sizes: string[];
  tags: string[];
  stock: number;
  isNew: boolean;
  isBestseller: boolean;
  isActive: boolean;
}

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductFormData | null;
  onSubmit: (data: ProductFormData) => void;
}

const defaultProduct: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  originalPrice: null,
  category: '',
  images: [],
  colors: [],
  sizes: [],
  tags: [],
  stock: 0,
  isNew: false,
  isBestseller: false,
  isActive: true,
};

const categories = ['Shirts', 'Jackets', 'Pants', 'Accessories', 'Footwear'];
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductFormModal = ({ open, onOpenChange, product, onSubmit }: ProductFormModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>(product || defaultProduct);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000', image: '' });
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [isDraggingColors, setIsDraggingColors] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingColor, setUploadingColor] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.colors.some(color => !color.name.trim() || !color.hex.trim() || !color.image.trim())) {
      alert('Each color must include a name, hex value, and image URL.');
      return;
    }
    onSubmit(formData);
    onOpenChange(false);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  // Drag-drop handlers for product images
  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImages(true);
  };

  const handleImageDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImages(false);
  };

  const handleImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImages(false);

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) {
      toast({
        title: 'Invalid files',
        description: 'Please drop image files only',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImages(true);
    try {
      const uploadPromises = files.map(file =>
        uploadImage('product-images', file, `products/${formData.name || 'uncategorized'}`)
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedUrls]
      });
      toast({
        title: 'Success',
        description: `${files.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) {
      toast({
        title: 'Invalid files',
        description: 'Please choose image files only',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImages(true);
    try {
      const uploadPromises = files.map(file =>
        uploadImage('product-images', file, `products/${formData.name || 'uncategorized'}`)
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData({ ...formData, images: [...formData.images, ...uploadedUrls] });
      toast({
        title: 'Success',
        description: `${files.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploadingImages(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // Drag-drop handlers for color images
  const handleColorImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingColors(true);
  };

  const handleColorImageDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingColors(false);
  };

  const handleColorImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingColors(false);

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) {
      toast({
        title: 'Invalid files',
        description: 'Please drop an image file',
        variant: 'destructive',
      });
      return;
    }

    if (files.length > 1) {
      toast({
        title: 'Too many files',
        description: 'Please drop only one image at a time for color variants',
        variant: 'destructive',
      });
      return;
    }

    setUploadingColor(true);
    try {
      const url = await uploadImage('product-images', files[0], `products/${formData.name || 'uncategorized'}/colors`);
      setNewColor({ ...newColor, image: url });
      toast({
        title: 'Success',
        description: 'Color image uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload color image',
        variant: 'destructive',
      });
    } finally {
      setUploadingColor(false);
    }
  };

  const handleColorImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please choose an image file',
        variant: 'destructive',
      });
      return;
    }

    setUploadingColor(true);
    try {
      const url = await uploadImage('product-images', file, `products/${formData.name || 'uncategorized'}/colors`);
      setNewColor({ ...newColor, image: url });
      toast({
        title: 'Success',
        description: 'Color image uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload color image',
        variant: 'destructive',
      });
    } finally {
      setUploadingColor(false);
      if (colorInputRef.current) colorInputRef.current.value = '';
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const toggleSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.includes(size)
        ? formData.sizes.filter(s => s !== size)
        : [...formData.sizes, size]
    });
  };

  const addColor = () => {
    const trimmedName = newColor.name.trim();
    if (!trimmedName || !newColor.hex.trim() || !newColor.image.trim()) return;
    if (formData.colors.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) return;

    setFormData({
      ...formData,
      colors: [...formData.colors, { name: trimmedName, hex: newColor.hex.trim(), image: newColor.image.trim() }]
    });
    setNewColor({ name: '', hex: '#000000', image: '' });
  };

  const removeColor = (index: number) => {
    setFormData({ ...formData, colors: formData.colors.filter((_, i) => i !== index) });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  name: e.target.value,
                  slug: generateSlug(e.target.value)
                })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (KES) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (KES)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice || ''}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? parseInt(e.target.value) : null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            
            {/* Drag and drop area */}
            <div
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
              onDrop={handleImageDrop}
              onClick={() => imageInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDraggingImages
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                {uploadingImages ? 'Uploading images...' : 'Drag & drop images here'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 5MB. Images will be saved to Supabase storage.
              </p>
              {uploadingImages && (
                <Loader className="w-4 h-4 mx-auto mt-2 animate-spin" />
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            {/* URL input as alternative */}
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste image URL here"
              />
              <Button type="button" variant="outline" onClick={addImage}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Image preview */}
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt=""
                      className="w-16 h-16 object-cover rounded border border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Error';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {isSupabaseUrl(img) && (
                      <span className="absolute bottom-1 right-1 bg-green-500 w-3 h-3 rounded-full border border-white" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>Sizes</Label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 border rounded text-sm transition-colors ${
                    formData.sizes.includes(size)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label>Colors (image required when added)</Label>
            <div className="grid md:grid-cols-3 gap-2">
              <Input
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                placeholder="Color name"
              />
              <Input
                type="color"
                value={newColor.hex}
                onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addColor}
                disabled={uploadingColor || !newColor.name.trim() || !newColor.image.trim()}
              >
                {uploadingColor ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Drag and drop for color image */}
            <div
              onDragOver={handleColorImageDragOver}
              onDragLeave={handleColorImageDragLeave}
              onDrop={handleColorImageDrop}
              onClick={() => colorInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                isDraggingColors
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {newColor.image ? (
                  <>
                    <img
                      src={newColor.image}
                      alt="Color preview"
                      className="w-8 h-8 object-cover rounded border border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=Error';
                      }}
                    />
                    <span className="text-sm text-muted-foreground">Color image ready</span>
                  </>
                ) : uploadingColor ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Uploading color image...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Drop color image or click to browse</span>
                  </>
                )}
              </div>
              <input
                ref={colorInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleColorImageSelect}
              />
            </div>

            {/* Color variants list */}
            {formData.colors.length > 0 && (
              <div className="grid gap-2">
                {formData.colors.map((color, idx) => (
                  <div key={`${color.name}-${idx}`} className="flex items-center justify-between border border-border rounded px-3 py-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="w-6 h-6 rounded-full border border-border shrink-0" style={{ backgroundColor: color.hex }} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{color.name}</span>
                        <img
                          src={color.image}
                          alt={color.name}
                          className="w-6 h-6 object-cover rounded border border-border mt-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/24?text=X';
                          }}
                        />
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeColor(idx)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted rounded text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked })}
              />
              <Label htmlFor="isNew">New Arrival</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isBestseller"
                checked={formData.isBestseller}
                onCheckedChange={(checked) => setFormData({ ...formData, isBestseller: checked })}
              />
              <Label htmlFor="isBestseller">Bestseller</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>


          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
