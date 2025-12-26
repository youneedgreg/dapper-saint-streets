import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  BarChart3,
  Image,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency';
import { supabase } from '@/lib/supabase';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import ProductFormModal from '@/components/admin/ProductFormModal';
import LookbookFormModal from '@/components/admin/LookbookFormModal';
import { useToast } from '@/hooks/use-toast';

const sidebarLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { name: 'Products', icon: Package, id: 'products' },
  { name: 'Lookbook', icon: Image, id: 'lookbook' },
  { name: 'Orders', icon: ShoppingCart, id: 'orders' },
  { name: 'Customers', icon: Users, id: 'customers' },
  { name: 'Analytics', icon: BarChart3, id: 'analytics' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [lookbookModalOpen, setLookbookModalOpen] = useState(false);
  const [editingLookbookItem, setEditingLookbookItem] = useState<any>(null);
  const [productsData, setProductsData] = useState<any[]>([]);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [lookbookItems, setLookbookItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [productsRes, ordersRes, lookbookRes, profilesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('lookbook_items').select('*').order('display_order', { ascending: true }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (lookbookRes.error) throw lookbookRes.error;
      if (profilesRes.error) throw profilesRes.error;

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      const lookbooks = lookbookRes.data || [];
      const profiles = profilesRes.data || [];

      const customersWithStats = profiles.map(profile => {
        const profileOrders = orders.filter((order: any) => order.user_id === profile.id);
        const spent = profileOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

        return {
          ...profile,
          orders_count: profileOrders.length,
          spent,
        };
      });

      setProductsData(products);
      setOrdersData(orders);
      setLookbookItems(lookbooks);
      setCustomerData(customersWithStats);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load admin data';
      setError(message);
      toast({
        title: 'Failed to load admin data',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProductSubmit = (data: any) => {
    // This will connect to Supabase once you set it up
    toast({
      title: editingProduct ? "Product Updated" : "Product Added",
      description: `${data.name} has been ${editingProduct ? 'updated' : 'added'} successfully. Connect Supabase to persist.`,
    });
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!productId) return;
    const { error: deleteError } = await supabase.from('products').delete().eq('id', productId);

    if (deleteError) {
      toast({
        title: 'Delete failed',
        description: deleteError.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Product deleted',
      description: 'The product has been removed.',
    });
    loadData();
  };

  const handleLookbookSubmit = (data: any) => {
    toast({
      title: editingLookbookItem ? "Lookbook Item Updated" : "Lookbook Item Added",
      description: `${data.title} has been ${editingLookbookItem ? 'updated' : 'added'} successfully. Connect Supabase to persist.`,
    });
    setEditingLookbookItem(null);
  };

  const handleDeleteLookbookItem = async (itemId: string) => {
    if (!itemId) return;
    const { error: deleteError } = await supabase.from('lookbook_items').delete().eq('id', itemId);

    if (deleteError) {
      toast({
        title: 'Delete failed',
        description: deleteError.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Lookbook item deleted',
      description: 'The item has been removed.',
    });
    loadData();
  };

  const totalRevenue = useMemo(
    () => ordersData.reduce((sum, order) => sum + (order.total || 0), 0),
    [ordersData]
  );

  const customerLookup = useMemo(() => {
    const map: Record<string, any> = {};
    customerData.forEach((customer) => {
      map[customer.id] = customer;
    });
    return map;
  }, [customerData]);

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = [
    { label: 'Total Revenue', value: totalRevenue > 0 ? formatPrice(totalRevenue) : '—', change: 'Live', icon: DollarSign, color: 'text-green-500' },
    { label: 'Total Orders', value: ordersData.length.toString(), change: 'Live', icon: ShoppingCart, color: 'text-blue-500' },
    { label: 'Total Products', value: productsData.length.toString(), change: 'Live', icon: Package, color: 'text-purple-500' },
    { label: 'Total Customers', value: customerData.length.toString(), change: 'Live', icon: Users, color: 'text-primary' },
  ];

  const renderEmptyRow = (colSpan: number, message: string) => (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center text-muted-foreground py-10">
        {message}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="block">
              <h1 className={cn(
                "font-display font-bold transition-all",
                sidebarOpen ? "text-xl" : "text-sm text-center"
              )}>
                {sidebarOpen ? (
                  <>DAPPER<span className="text-gradient-gold ml-1">SAINTE</span></>
                ) : (
                  <span className="text-gradient-gold">DS</span>
                )}
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarLinks.map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => setActiveTab(link.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      activeTab === link.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <link.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span className="font-medium">{link.name}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Toggle */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {sidebarOpen ? '← Collapse' : '→'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-20"
      )}>
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold capitalize">{activeTab}</h1>
              <p className="text-muted-foreground">Manage your store</p>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">View Store</Button>
            </Link>
          </div>

          <div className="mb-6 bg-muted/40 border border-border rounded-lg p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              {error ? `Error loading data: ${error}` : 'Showing live data from Supabase. Refresh after making changes to keep this view in sync.'}
            </p>
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh data'}
            </Button>
          </div>

          {/* Dashboard content */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card rounded-lg p-6 border border-border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className={cn("w-8 h-8", stat.color)} />
                      <span className="text-sm text-muted-foreground font-medium">{stat.change}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="bg-card rounded-lg border border-border">
                <div className="p-6 border-b border-border">
                  <h2 className="font-display text-xl font-bold">Recent Orders</h2>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && renderEmptyRow(5, 'Loading orders...')}
                    {!loading && ordersData.length === 0 && renderEmptyRow(5, 'No orders yet.')}
                    {!loading && ordersData.slice(0, 5).map(order => {
                      const customer = customerLookup[order.user_id];
                      const customerName = customer
                        ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Customer'
                        : 'Guest';
                      const statusClass = cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        order.status === 'delivered' && 'bg-green-500/10 text-green-500',
                        order.status === 'processing' && 'bg-blue-500/10 text-blue-500',
                        order.status === 'shipped' && 'bg-purple-500/10 text-purple-500',
                        order.status === 'pending' && 'bg-yellow-500/10 text-yellow-500',
                        order.status === 'cancelled' && 'bg-destructive/10 text-destructive'
                      );

                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_number || order.id}</TableCell>
                          <TableCell>{customerName}</TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                          <TableCell>{formatPrice(order.total || 0)}</TableCell>
                          <TableCell>
                            <span className={statusClass}>{order.status || 'pending'}</span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {/* Products content */}
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search products..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button onClick={() => { setEditingProduct(null); setProductModalOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <ProductFormModal
                open={productModalOpen}
                onOpenChange={setProductModalOpen}
                product={editingProduct}
                onSubmit={handleProductSubmit}
              />

              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && renderEmptyRow(6, 'Loading products...')}
                    {!loading && productsData.length === 0 && renderEmptyRow(6, 'No products found.')}
                    {!loading && productsData.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images?.[0] || 'https://via.placeholder.com/64?text=Img'}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Img';
                              }}
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category || product.category_id || '—'}</TableCell>
                        <TableCell>
                          <span className="font-medium">{formatPrice(product.price)}</span>
                          {product.original_price && (
                            <span className="text-sm text-muted-foreground ml-2 line-through">
                              {formatPrice(product.original_price)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{product.stock ?? '—'}</TableCell>
                        <TableCell>
                          <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            product.is_new ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                          )}>
                            {product.is_new ? 'New' : 'Active'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setEditingProduct(product); setProductModalOpen(true); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {/* Lookbook content */}
          {activeTab === 'lookbook' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search lookbook..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button onClick={() => { setEditingLookbookItem(null); setLookbookModalOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lookbook Item
                </Button>
              </div>

              <LookbookFormModal
                open={lookbookModalOpen}
                onOpenChange={setLookbookModalOpen}
                lookbookItem={editingLookbookItem}
                onSubmit={handleLookbookSubmit}
              />

              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Collection</TableHead>
                      <TableHead>Display Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && renderEmptyRow(6, 'Loading lookbook items...')}
                    {!loading && lookbookItems.length === 0 && renderEmptyRow(6, 'No lookbook items yet.')}
                    {!loading && lookbookItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img
                            src={item.image_url || 'https://via.placeholder.com/80?text=Img'}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Img';
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            {item.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.collection || '—'}</TableCell>
                        <TableCell>{item.display_order ?? 0}</TableCell>
                        <TableCell>
                          <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            item.is_active ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                          )}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => { setEditingLookbookItem(item); setLookbookModalOpen(true); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => handleDeleteLookbookItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {/* Orders content */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg border border-border"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">All Orders</h2>
                <div className="flex items-center gap-4">
                  <Input placeholder="Search orders..." className="w-64" />
                  <Button variant="outline">Export</Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && renderEmptyRow(6, 'Loading orders...')}
                  {!loading && ordersData.length === 0 && renderEmptyRow(6, 'No orders yet.')}
                  {!loading && ordersData.map(order => {
                    const customer = customerLookup[order.user_id];
                    const customerName = customer
                      ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Customer'
                      : 'Guest';
                    const statusClass = cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      order.status === 'delivered' && 'bg-green-500/10 text-green-500',
                      order.status === 'processing' && 'bg-blue-500/10 text-blue-500',
                      order.status === 'shipped' && 'bg-purple-500/10 text-purple-500',
                      order.status === 'pending' && 'bg-yellow-500/10 text-yellow-500',
                      order.status === 'cancelled' && 'bg-destructive/10 text-destructive'
                    );

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_number || order.id}</TableCell>
                        <TableCell>{customerName}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                        <TableCell>{formatPrice(order.total || 0)}</TableCell>
                        <TableCell>
                          <span className={statusClass}>{order.status || 'pending'}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </motion.div>
          )}

          {/* Customers content */}
          {activeTab === 'customers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg border border-border"
            >
              <div className="p-6 border-b border-border">
                <h2 className="font-display text-xl font-bold">Customers</h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && renderEmptyRow(5, 'Loading customers...')}
                  {!loading && customerData.length === 0 && renderEmptyRow(5, 'No customers yet.')}
                  {!loading && customerData.map(customer => {
                    const name = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Customer';
                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell className="text-muted-foreground">{customer.phone || '—'}</TableCell>
                        <TableCell>{customer.orders_count ?? 0}</TableCell>
                        <TableCell>{customer.spent ? formatPrice(customer.spent) : '—'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </motion.div>
          )}

          {/* Analytics content */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-card rounded-lg border border-border p-6">
                  <h3 className="font-display text-lg font-bold mb-2">Analytics coming soon</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect Supabase and your analytics events to unlock charts, funnels, and the AI assistant here.
                    Follow SUPABASE_SETUP.md to configure credentials and start streaming real metrics.
                  </p>
                </div>

                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-display text-lg font-bold mb-2">Top products</h3>
                  <p className="text-sm text-muted-foreground">
                    Product performance will appear once sales data is connected. No sample data is shown.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings content */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl space-y-6"
            >
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-display text-lg font-bold mb-6">Store Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Store Name</label>
                    <Input defaultValue="Dapper Sainte" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Store Email</label>
                    <Input defaultValue="hello@dappersainte.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <Input defaultValue="Kenya Shillings (KES)" />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
