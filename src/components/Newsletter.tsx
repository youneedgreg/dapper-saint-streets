import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast.success('Welcome to the inner circle!');
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase text-background/60 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Newsletter
          </motion.p>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join the Inner Circle
          </motion.h2>

          <motion.p
            className="text-background/60 mb-10 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Be the first to know about exclusive drops and limited editions.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-transparent border-2 border-background/30 text-background placeholder:text-background/40 focus:border-background rounded-none uppercase text-xs tracking-widest"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 px-12 bg-background text-foreground hover:bg-background/90 text-xs tracking-[0.2em] uppercase font-bold rounded-none"
              disabled={isSubmitted}
            >
              {isSubmitted ? 'Subscribed' : 'Sign Up →'}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
