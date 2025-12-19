import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, Truck, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency';

const steps = [
  { id: 1, name: 'Shipping', icon: Truck },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Review', icon: Package },
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { items, totalPrice } = useCart();

  const shipping = 15;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Back link */}
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          {/* Progress steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline text-sm font-medium">{step.name}</span>
                  </button>
                  {idx < steps.length - 1 && (
                    <div className={cn(
                      "w-8 md:w-16 h-0.5 mx-2",
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form section */}
            <div className="lg:col-span-2">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-lg p-6 md:p-8"
              >
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-display text-2xl font-bold mb-6">Shipping Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="123 Street Name" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="New York" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="NY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" placeholder="10001" />
                      </div>
                    </div>

                    <Button onClick={() => setCurrentStep(2)} className="w-full" size="lg">
                      Continue to Payment
                    </Button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-display text-2xl font-bold mb-6">Payment Information</h2>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={() => setCurrentStep(1)} variant="outline" className="flex-1" size="lg">
                        Back
                      </Button>
                      <Button onClick={() => setCurrentStep(3)} className="flex-1" size="lg">
                        Review Order
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-display text-2xl font-bold mb-6">Review Your Order</h2>
                    
                    <div className="space-y-4">
                      {items.map(item => (
                        <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4 py-4 border-b border-border last:border-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.selectedColor} / {item.selectedSize}
                            </p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border space-y-2">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping Address</span>
                        <span>123 Street Name, New York, NY 10001</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Payment Method</span>
                        <span>•••• 4242</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={() => setCurrentStep(2)} variant="outline" className="flex-1" size="lg">
                        Back
                      </Button>
                      <Button className="flex-1" size="lg">
                        Place Order
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 sticky top-24">
                <h3 className="font-display text-xl font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {items.slice(0, 3).map(item => (
                    <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-sm text-muted-foreground">+{items.length - 3} more items</p>
                  )}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-gradient-gold">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
