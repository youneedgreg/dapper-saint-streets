import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <Link to="/" className="block mb-16 text-center">
          <span className="font-display text-2xl tracking-wider">Dapper Sainte</span>
        </Link>

        {!isSubmitted ? (
          <>
            <div className="mb-12 text-center">
              <h1 className="font-display text-3xl md:text-4xl mb-3">Reset Password</h1>
              <p className="text-muted-foreground text-sm">
                Enter your email and we'll send you instructions to reset your password.
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-6 text-foreground" strokeWidth={1} />
            <h2 className="font-display text-2xl mb-4">Check Your Email</h2>
            <p className="text-muted-foreground text-sm mb-8">
              We've sent password reset instructions to <span className="text-foreground">{email}</span>
            </p>
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
