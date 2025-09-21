import { Button } from "./ui/button";
import { Home, ArrowLeft } from "lucide-react";

interface NotFoundPageProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export function NotFoundPage({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or you don't have permission to access it.",
  showBackButton = true,
  showHomeButton = true,
}: NotFoundPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground text-lg">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showBackButton && (
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          )}

          {showHomeButton && (
            <a href="/">
              <Button className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
