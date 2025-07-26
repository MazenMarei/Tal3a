import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { Home, ArrowLeft, Search, MapPin, Icon } from "lucide-react";
import { soccerBall as Football } from "@lucide/lab";
import Logo_2 from "../assets/Logo_2.svg";
import Navbar from "../components/navbar";
export default function NotFound() {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8 text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <img src={Logo_2} alt="Tal3a Logo" />
            </div>
          </div>

          {/* 404 Illustration */}
          <div className="space-y-6">
            <div className="text-8xl lg:text-9xl font-bold text-primary/20 dark:text-primary/30">
              404
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Oops! Page Not Found
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                The sports event you're looking for seems to have been cancelled
                or moved to a different field.
              </p>
              <p className="text-sm text-muted-foreground" dir="rtl">
                عذراً، الصفحة المطلوبة غير موجودة
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <Card className="border shadow-lg dark:shadow-2xl bg-card/50 dark:bg-card/30 backdrop-blur">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleGoHome}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
                  size="lg"
                >
                  <Home className="w-5 h-5 mr-3" />
                  Go to Home
                </Button>
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="w-full h-12 border-2 hover:bg-muted/50 bg-transparent"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  Go Back
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Or try searching for what you need:
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Search className="w-3 h-3 mr-1" />
                    Find Events
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    Browse Locations
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Icon iconNode={Football} className="w-3 h-3 mr-1" />
                    Sports Categories
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Suggestions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Popular Right Now
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon iconNode={Football} className="w-3 h-3 mr-1" />
                  </div>
                  <h4 className="font-medium text-sm">Football Events</h4>
                  <p className="text-xs text-muted-foreground">150+ active</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                  </div>
                  <h4 className="font-medium text-sm">Cairo Events</h4>
                  <p className="text-xs text-muted-foreground">80+ today</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Search className="w-4 h-4 text-accent" />
                  </div>
                  <h4 className="font-medium text-sm">Browse All</h4>
                  <p className="text-xs text-muted-foreground">500+ events</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground">
            Need help? Contact our support team or check our{" "}
            <button className="text-primary hover:underline">
              help center
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
