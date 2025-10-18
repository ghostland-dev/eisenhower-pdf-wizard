import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 p-4">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">Page introuvable</p>
        <p className="text-sm text-muted-foreground max-w-md">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/">
          <Button size="lg" className="gap-2">
            <Home className="h-5 w-5" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
