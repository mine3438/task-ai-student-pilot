
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-red-primary tracking-tight">404</h1>
          <div className="w-24 h-1 bg-red-secondary mx-auto rounded-full"></div>
          <h2 className="text-3xl font-semibold text-red-primary">Page Not Found</h2>
          <p className="text-lg text-red-primary/70 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off. 
            Let's get you back on track.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 text-red-primary border-2 border-red-secondary hover:bg-red-primary hover:text-white rounded-xl font-semibold transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2 px-6 py-3 bg-red-secondary hover:bg-red-dark text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
