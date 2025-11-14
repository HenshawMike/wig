import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signInWithGoogle, login, signup } = useAuth();

  const isLogin = type === 'login';
  const title = isLogin ? 'Welcome back' : 'Create an account';
  const buttonText = isLogin ? 'Sign In' : 'Sign Up';
  const linkText = isLogin ? 'Create an account' : 'Already have an account?';
  const linkHref = isLogin ? '/signup' : '/login';
  const linkActionText = isLogin ? 'Sign up' : 'Sign in';

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      // Error is already handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      
      navigate('/');
    } catch (error) {
      // Error is already handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-0 m-0">
      <div className="w-full h-full max-w-none mx-0 bg-background shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left side - Full screen image (hidden on mobile, visible on md+) */}
        <div className="hidden md:block relative w-full h-full">
          <img 
            src="/images/logo*.jpg" 
            alt="Domtornyluxe Hairmpire"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: 0.9,
              objectFit: 'cover',
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
            }}
          />
        </div>
        
        {/* Right side - Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-[350px]">
            {/* Circular Logo */}
            <div className="flex justify-center mb-9">
              <div className="w-32 h-32 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-accent/30 p-1 bg-background">
                <img 
                  src="/images/logo*.jpg" 
                  alt="Domtornyluxe Hairmpire Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLogin 
                  ? 'Enter your email and password to sign in to your account.'
                  : 'Enter your information to create an account.'
                }
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <div className="mr-2 h-4 w-4 animate-spin" />
                )}
                {buttonText}
              </Button>
            </form>
            
            <div className="relative my-4">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <FcGoogle className="h-4 w-4" />
                {isLogin ? 'Sign in' : 'Sign up'} with Google
              </Button>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {isLogin ? 'New to our store?' : 'Already have an account?'}
                </span>
              </div>
            </div>
            
            <Button variant="outline" type="button" className="w-full" asChild>
              <Link to={linkHref}>
                {linkActionText}
              </Link>
            </Button>
            
            <p className="mt-6 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}