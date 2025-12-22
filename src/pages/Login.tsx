import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - replace with actual auth
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back",
        description: "You have successfully logged in.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Image */}
      <motion.div 
        className="hidden lg:block lg:w-1/2 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="font-display text-4xl text-white mb-4">
            Welcome Back
          </h2>
          <p className="text-white/70 text-sm max-w-md">
            Sign in to access your account, track orders, and continue your journey with Dapper Saint.
          </p>
        </div>
      </motion.div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Logo */}
          <Link to="/" className="block mb-16">
            <span className="font-display text-2xl tracking-wider">Dapper Saint</span>
          </Link>

          <div className="mb-12">
            <h1 className="font-display text-3xl md:text-4xl mb-3">Sign In</h1>
            <p className="text-muted-foreground text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
                Create one
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 bg-transparent border-border focus:border-foreground transition-colors pr-12"
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

            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="underline underline-offset-2">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="underline underline-offset-2">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
