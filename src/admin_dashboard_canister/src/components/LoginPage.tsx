import { Button } from "@/components/ui/button";
import { useIsAuthenticated, useLogin } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Zap } from "lucide-react";

export function LoginPage() {
  const login = useLogin();
  const { data: isAuthenticated } = useIsAuthenticated();
  if (isAuthenticated) {
    window.location.href = "/";
    // redirect({ to: "/dashboard" });
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-light to-secondary/10 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
                <Shield className="h-10 w-10 text-white" />
              </div>

              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Admin Dashboard
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Sign in to access the Tal3a admin panel
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button
                  onClick={() => login.mutate("ii")}
                  disabled={login.isPending}
                  loading={login.isPending}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                >
                  {!login.isPending && <Shield className="h-5 w-5 mr-3" />}
                  Continue with Internet Identity
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-500 font-medium">
                      Or
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => login.mutate("nfid")}
                  disabled={login.isPending}
                  loading={login.isPending}
                  variant="outline"
                  className="w-full h-12 text-base font-semibold border-2 hover:bg-accent hover:text-dark hover:border-accent"
                >
                  {!login.isPending && <Zap className="h-5 w-5 mr-3" />}
                  Continue with NFID
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have admin access?{" "}
                  <a
                    className="text-primary hover:underline font-medium"
                    href="/request-access"
                  >
                    Request Access
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Secured by Internet Computer blockchain technology
            </p>
          </div>
        </div>
      </div>
    );
  }
}
