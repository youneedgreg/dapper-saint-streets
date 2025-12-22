import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-neutral dark:prose-invert max-w-none"
          >
            <h1 className="font-display text-4xl font-bold mb-8">Terms of Service</h1>
            
            <p className="text-muted-foreground mb-8">Last updated: January 2024</p>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Dapper Saint, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by these terms, 
                please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">2. Products and Pricing</h2>
              <p className="text-muted-foreground leading-relaxed">
                All prices are listed in Kenyan Shillings (KES). We reserve the right to modify 
                prices at any time without prior notice. Product availability is subject to change.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">3. Orders and Payment</h2>
              <p className="text-muted-foreground leading-relaxed">
                By placing an order, you warrant that you are legally capable of entering into 
                binding contracts. We accept M-Pesa and major credit cards. All payments are 
                processed securely.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">4. Shipping and Delivery</h2>
              <p className="text-muted-foreground leading-relaxed">
                We ship throughout Kenya. Delivery times vary based on location. We are not 
                responsible for delays caused by customs or other factors beyond our control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">5. Returns and Refunds</h2>
              <p className="text-muted-foreground leading-relaxed">
                We accept returns within 14 days of delivery for unworn items in original 
                condition with tags attached. Refunds will be processed within 7-10 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">6. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these terms, contact us at legal@dappersaint.com.
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
