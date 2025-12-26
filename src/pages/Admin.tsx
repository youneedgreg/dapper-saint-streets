import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  DollarSign,
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

const productsData: any[] = [];
const ordersData: any[] = [];
const customerData: any[] = [];
const lookbookItems: any[] = [];

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

  const handleLookbookSubmit = (data: any) => {
    toast({
      title: editingLookbookItem ? "Lookbook Item Updated" : "Lookbook Item Added",
      description: `${data.title} has been ${editingLookbookItem ? 'updated' : 'added'} successfully. Connect Supabase to persist.`,
    });
    setEditingLookbookItem(null);
  };

  const stats = [
    { label: 'Total Revenue', value: '—', change: 'Connect data', icon: DollarSign, color: 'text-muted-foreground' },
    { label: 'Total Orders', value: '—', change: 'Connect data', icon: ShoppingCart, color: 'text-muted-foreground' },
    { label: 'Total Products', value: productsData.length.toString(), change: 'Connect data', icon: Package, color: 'text-muted-foreground' },
    { label: 'Total Customers', value: '—', change: 'Connect data', icon: Users, color: 'text-muted-foreground' },
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

          <div className="mb-6 bg-muted/40 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Live data is not connected yet. Wire up Supabase and real analytics to populate these sections.
            </p>
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
                    {ordersData.length === 0
                      ? renderEmptyRow(5, 'No orders yet. Connect Supabase to start tracking real orders.')
                      : null}
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
                    {productsData.length === 0
                      ? renderEmptyRow(6, 'No products found. Add your first product or connect Supabase to load catalog data.')
                      : null}
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
                    {lookbookItems.length === 0
                      ? renderEmptyRow(6, 'No lookbook items yet. Connect Supabase to manage lookbook content.')
                      : null}
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
                  {ordersData.length === 0
                    ? renderEmptyRow(6, 'Orders will appear once Supabase is connected and customers start checking out.')
                    : null}
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
                  {customerData.length === 0
                    ? renderEmptyRow(5, 'Customers will show up after you connect Supabase auth and orders.')
                    : null}
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
