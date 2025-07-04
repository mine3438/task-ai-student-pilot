import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(signupData.email, signupData.password, signupData.fullName);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please try logging in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-gray-dark">
        <CardHeader className="text-center pb-8 pt-8">
          <CardTitle className="text-3xl font-bold tracking-tight mb-2 text-red-primary">
            StudyFlow
          </CardTitle>
          <CardDescription className="text-lg font-medium text-red-primary/70">
            Master your studies with focused flow
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 p-1 rounded-xl h-12 bg-gray-darker">
              <TabsTrigger 
                value="login" 
                className="font-bold text-base rounded-lg transition-all duration-200 data-[state=active]:shadow-md text-red-primary data-[state=active]:bg-red-secondary data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="font-bold text-base rounded-lg transition-all duration-200 data-[state=active]:shadow-md text-red-primary data-[state=active]:bg-red-secondary data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="login-email" className="text-base font-semibold text-red-primary">
                    Email Address
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className="h-12 rounded-xl border-2 text-base font-medium transition-all duration-200 focus:ring-2 focus:ring-opacity-50 border-gray-600 bg-gray-darker text-red-primary focus:border-red-primary focus:ring-red-primary placeholder:text-red-primary/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="login-password" className="text-base font-semibold text-red-primary">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="h-12 rounded-xl border-2 text-base font-medium pr-12 transition-all duration-200 focus:ring-2 focus:ring-opacity-50 border-gray-600 bg-gray-darker text-red-primary focus:border-red-primary focus:ring-red-primary placeholder:text-red-primary/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-red-primary/10 text-red-primary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 font-bold text-base tracking-wide rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white border-0 bg-red-secondary hover:bg-red-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-6">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="signup-name" className="text-base font-semibold text-red-primary">
                    Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                    className="h-12 rounded-xl border-2 text-base font-medium transition-all duration-200 focus:ring-2 focus:ring-opacity-50 border-gray-600 bg-gray-darker text-red-primary focus:border-red-primary focus:ring-red-primary placeholder:text-red-primary/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-email" className="text-base font-semibold text-red-primary">
                    Email Address
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                    className="h-12 rounded-xl border-2 text-base font-medium transition-all duration-200 focus:ring-2 focus:ring-opacity-50 border-gray-600 bg-gray-darker text-red-primary focus:border-red-primary focus:ring-red-primary placeholder:text-red-primary/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-password" className="text-base font-semibold text-red-primary">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      className="h-12 rounded-xl border-2 text-base font-medium pr-12 transition-all duration-200 focus:ring-2 focus:ring-opacity-50 border-gray-600 bg-gray-darker text-red-primary focus:border-red-primary focus:ring-red-primary placeholder:text-red-primary/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-red-primary/10 text-red-primary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-confirm" className="text-base font-semibold text-red-primary">
                    Confirm Password
                  </Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    required
                    className="h-12 rounded-xl border-2 text-base font-medium transition-all duration-200 focus:ring-2 focus:ring-opacity-50 border-gray-600 bg-gray-darker text-red-primary focus:border-red-primary focus:ring-red-primary placeholder:text-red-primary/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 font-bold text-base tracking-wide rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white border-0 bg-red-secondary hover:bg-red-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
