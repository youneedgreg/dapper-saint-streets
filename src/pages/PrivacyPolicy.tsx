import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
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
            <h1 className="font-display text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <p className="text-muted-foreground mb-8">Last updated: January 2024</p>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact us for support. This includes your name, email address, 
                shipping address, and payment information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect to process transactions, send you order updates, 
                provide customer support, and improve our services. We may also use your information 
                to send promotional communications with your consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share your information with service 
                providers who assist us in operating our website, conducting our business, or serving 
                you, as long as those parties agree to keep this information confidential.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">4. Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the Internet is 100% secure, and we cannot 
                guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-4">5. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at 
                privacy@dappersaint.com.
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
