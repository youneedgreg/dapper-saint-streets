import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll be in touch soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div className="max-w-2xl mx-auto text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs tracking-[0.3em] uppercase text-primary mb-4 block">Get in Touch</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground">Have a question? We'd love to hear from you.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg"><Mail className="w-5 h-5 text-primary" /></div>
                <div><h3 className="font-semibold mb-1">Email</h3><p className="text-muted-foreground text-sm">hello@dappersaint.com</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg"><Phone className="w-5 h-5 text-primary" /></div>
                <div><h3 className="font-semibold mb-1">Phone</h3><p className="text-muted-foreground text-sm">+1 (555) 123-4567</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg"><MapPin className="w-5 h-5 text-primary" /></div>
                <div><h3 className="font-semibold mb-1">Location</h3><p className="text-muted-foreground text-sm">Los Angeles, CA</p></div>
              </div>
            </motion.div>
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <Input placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="bg-secondary border-border" />
              <Input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="bg-secondary border-border" />
              <Textarea placeholder="Your Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} className="bg-secondary border-border" />
              <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground">Send Message</Button>
            </motion.form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
