import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration - replace with actual auth
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created",
        description: "Welcome to Dapper Sainte.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <Link to="/" className="block mb-16">
            <span className="font-display text-2xl tracking-wider">Dapper Sainte</span>
          </Link>

          <div className="mb-12">
            <h1 className="font-display text-3xl md:text-4xl mb-3">Create Account</h1>
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  First Name
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="h-12 bg-transparent border-border focus:border-foreground transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  Last Name
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="h-12 bg-transparent border-border focus:border-foreground transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="h-12 bg-transparent border-border focus:border-foreground transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="h-12 bg-transparent border-border focus:border-foreground transition-colors pr-12"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="underline underline-offset-2">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="underline underline-offset-2">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right - Image */}
      <motion.div 
        className="hidden lg:block lg:w-1/2 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="font-display text-4xl text-white mb-4">
            Join the Movement
          </h2>
          <p className="text-white/70 text-sm max-w-md">
            Create your account to unlock exclusive access, early drops, and personalized recommendations.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
