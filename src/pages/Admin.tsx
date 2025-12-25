import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  BarChart3,
  Image
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency';
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
import { AnalyticsChat } from '@/components/admin/AnalyticsChat';
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

const mockOrders = [
  { id: '#1001', customer: 'John Doe', date: '2024-01-15', total: 48500, status: 'Completed' },
  { id: '#1002', customer: 'Jane Smith', date: '2024-01-15', total: 28500, status: 'Processing' },
  { id: '#1003', customer: 'Mike Johnson', date: '2024-01-14', total: 74500, status: 'Shipped' },
  { id: '#1004', customer: 'Sarah Wilson', date: '2024-01-14', total: 19500, status: 'Pending' },
  { id: '#1005', customer: 'Chris Brown', date: '2024-01-13', total: 59500, status: 'Completed' },
];

const mockCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 5, spent: 145000 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 3, spent: 89000 },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', orders: 8, spent: 234000 },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', orders: 2, spent: 52000 },
];

const mockLookbookItems = [
  { id: '1', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop', title: 'Urban Edge', collection: 'Essentials', description: 'Street style essentials', product_ids: ['1', '4'], display_order: 1, is_active: true },
  { id: '2', image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop', title: 'Street Royalty', collection: 'Premium', description: 'Premium street wear', product_ids: ['2', '5'], display_order: 2, is_active: true },
  { id: '3', image_url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1200&auto=format&fit=crop', title: 'Dark Dynasty', collection: 'Signature', description: 'Signature dark collection', product_ids: ['3', '6'], display_order: 3, is_active: true },
];

const salesData = [
  { name: 'Jan', sales: 4000, revenue: 24000 },
  { name: 'Feb', sales: 3000, revenue: 21000 },
  { name: 'Mar', sales: 2000, revenue: 14000 },
  { name: 'Apr', sales: 2780, revenue: 19460 },
  { name: 'May', sales: 1890, revenue: 13230 },
  { name: 'Jun', sales: 2390, revenue: 16730 },
  { name: 'Jul', sales: 3490, revenue: 24430 },
];

const productSalesData = [
  { name: 'Urban Edge', value: 35, color: '#3b82f6' },
  { name: 'Street Royalty', value: 28, color: '#8b5cf6' },
  { name: 'Dark Dynasty', value: 22, color: '#ec4899' },
  { name: 'Others', value: 15, color: '#6b7280' },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [lookbookModalOpen, setLookbookModalOpen] = useState(false);
  const [editingLookbookItem, setEditingLookbookItem] = useState<any>(null);
  const { toast } = useToast();

  const handleProductSubmit = (data: any) => {
    // This will connect to Supabase once you set it up
    toast({
      title: editingProduct ? "Product Updated" : "Product Added",
      description: `${data.name} has been ${editingProduct ? 'updated' : 'added'} successfully. Connect Supabase to persist.`,
    });
    setEditingProduct(null);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    toast({
      title: "Delete Product",
      description: "Connect Supabase to enable product deletion.",
      variant: "destructive",
    });
  };

  const handleLookbookSubmit = (data: any) => {
    toast({
      title: editingLookbookItem ? "Lookbook Item Updated" : "Lookbook Item Added",
      description: `${data.title} has been ${editingLookbookItem ? 'updated' : 'added'} successfully. Connect Supabase to persist.`,
    });
    setEditingLookbookItem(null);
  };

  const handleEditLookbookItem = (item: any) => {
    setEditingLookbookItem(item);
    setLookbookModalOpen(true);
  };

  const handleDeleteLookbookItem = (itemId: string) => {
    toast({
      title: "Delete Lookbook Item",
      description: "Connect Supabase to enable lookbook item deletion.",
      variant: "destructive",
    });
  };

  const stats = [
    { label: 'Total Revenue', value: 'KSh 4,825,000', change: '+12.5%', icon: DollarSign, color: 'text-green-500' },
    { label: 'Total Orders', value: '156', change: '+8.2%', icon: ShoppingCart, color: 'text-blue-500' },
    { label: 'Total Products', value: products.length.toString(), change: '+2', icon: Package, color: 'text-purple-500' },
    { label: 'Total Customers', value: '89', change: '+15.3%', icon: Users, color: 'text-primary' },
  ];

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
                      <span className="text-sm text-green-500 font-medium">{stat.change}</span>
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
                    {mockOrders.slice(0, 5).map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="text-muted-foreground">{order.date}</TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            order.status === 'Completed' && "bg-green-500/10 text-green-500",
                            order.status === 'Processing' && "bg-blue-500/10 text-blue-500",
                            order.status === 'Shipped' && "bg-purple-500/10 text-purple-500",
                            order.status === 'Pending' && "bg-yellow-500/10 text-yellow-500"
                          )}>
                            {order.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
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
                    {products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <span className="font-medium">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground ml-2 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>In Stock</TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            product.isNew ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          )}>
                            {product.isNew ? 'New' : 'Active'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
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
                    {mockLookbookItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded"
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
                        <TableCell>{item.collection}</TableCell>
                        <TableCell>{item.display_order}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            item.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                          )}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditLookbookItem(item)}>
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
                  {mockOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="text-muted-foreground">{order.date}</TableCell>
                      <TableCell>{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          order.status === 'Completed' && "bg-green-500/10 text-green-500",
                          order.status === 'Processing' && "bg-blue-500/10 text-blue-500",
                          order.status === 'Shipped' && "bg-purple-500/10 text-purple-500",
                          order.status === 'Pending' && "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCustomers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>{formatPrice(customer.spent)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="font-display text-2xl font-bold mt-1">₭487.5K</p>
                      <p className="text-xs text-green-500 mt-2">↑ 23% from last month</p>
                    </div>
                    <DollarSign className="w-10 h-10 text-primary opacity-20" />
                  </div>
                </div>
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                      <p className="font-display text-2xl font-bold mt-1">47</p>
                      <p className="text-xs text-green-500 mt-2">↑ 12% from last month</p>
                    </div>
                    <ShoppingCart className="w-10 h-10 text-primary opacity-20" />
                  </div>
                </div>
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Customers</p>
                      <p className="font-display text-2xl font-bold mt-1">4</p>
                      <p className="text-xs text-green-500 mt-2">↑ 1 new customer</p>
                    </div>
                    <Users className="w-10 h-10 text-primary opacity-20" />
                  </div>
                </div>
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Order Value</p>
                      <p className="font-display text-2xl font-bold mt-1">₭10.4K</p>
                      <p className="text-xs text-green-500 mt-2">↑ 15% from last month</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-primary opacity-20" />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Sales & Revenue Chart */}
                <div className="md:col-span-2 bg-card rounded-lg border border-border p-6">
                  <h3 className="font-display text-lg font-bold mb-4">Sales & Revenue Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="Sales Count" />
                      <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} name="Revenue (₭)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Product Sales Distribution */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-display text-lg font-bold mb-4">Product Sales Mix</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={productSalesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productSalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Analytics Chat & Top Products */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Chat */}
                <div className="md:col-span-2 h-96">
                  <AnalyticsChat />
                </div>

                {/* Top Products */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-display text-lg font-bold mb-4">Top Products</h3>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product, idx) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <span className="text-sm font-bold text-primary w-6">{idx + 1}</span>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {Math.floor(Math.random() * 50 + 10)} sold
                        </span>
                      </div>
                    ))}
                  </div>
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
