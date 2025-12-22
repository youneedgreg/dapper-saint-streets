import { motion } from 'framer-motion';
import { Package, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/currency';

const OrderHistory = () => {
  const orders = [
    {
      id: 'DS-20240115-0001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 48500,
      items: [
        { name: 'Classic Oxford Shirt', quantity: 1, price: 24500, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100' },
        { name: 'Slim Fit Chinos', quantity: 1, price: 24000, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=100' },
      ]
    },
    {
      id: 'DS-20240110-0023',
      date: '2024-01-10',
      status: 'Shipped',
      total: 28500,
      items: [
        { name: 'Leather Belt', quantity: 1, price: 28500, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100' },
      ]
    },
    {
      id: 'DS-20240105-0045',
      date: '2024-01-05',
      status: 'Delivered',
      total: 74500,
      items: [
        { name: 'Wool Blend Blazer', quantity: 1, price: 74500, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      ]
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/10 text-green-500';
      case 'Shipped': return 'bg-blue-500/10 text-blue-500';
      case 'Processing': return 'bg-yellow-500/10 text-yellow-500';
      case 'Cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold">Order History</h1>
                <p className="text-muted-foreground mt-1">Track and manage your orders</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search orders..." className="pl-10 w-64" />
              </div>
            </div>

            {/* Orders List */}
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card rounded-lg border border-border overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-4 bg-muted/30 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="font-medium">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-medium">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 space-y-4">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="p-4 border-t border-border flex justify-end gap-3">
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-16 text-center">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="font-display text-xl font-bold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                <Link to="/shop">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistory;
