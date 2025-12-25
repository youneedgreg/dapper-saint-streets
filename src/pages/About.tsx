import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Newsletter from '@/components/Newsletter';

const About = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <CartDrawer />
    <main>
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div className="max-w-3xl mx-auto text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs tracking-[0.3em] uppercase text-primary mb-4 block">Our Story</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">Don't blend in, Rule the <span className="text-gradient-gold">Scene</span></h1>
            <p className="text-lg text-muted-foreground">Born from a passion for premium craftsmanship and urban culture, Dapper Sainte redefines what streetwear can be.</p>
          </motion.div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop" alt="Our studio" className="rounded-lg" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <h2 className="font-display text-3xl font-bold">The Vision</h2>
              <p className="text-muted-foreground">We believe that true style knows no boundaries. Dapper Sainte was founded on the principle that luxury and street culture can coexist—creating pieces that are as refined as they are bold.</p>
              <p className="text-muted-foreground">Every garment is crafted with meticulous attention to detail, using only the finest materials sourced from around the world. From Egyptian cotton to Japanese denim, quality is never compromised.</p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ value: '2024', label: 'Founded' }, { value: '2k+', label: 'Happy Customers' }, { value: '4+', label: 'Countries' }, { value: '100%', label: 'Premium Quality' }].map(stat => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="font-display text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Newsletter />
    </main>
    <Footer />
  </div>
);

export default About;
