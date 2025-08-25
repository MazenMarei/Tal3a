import { useState } from "react";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { Input } from "../components/input";
import { Badge } from "../components/badge";
import {
  Bell,
  Mail,
  Calendar,
  Users,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  Home,
  ArrowLeft,
  Search,
  MapPin,
  Icon,
} from "lucide-react";
import { soccerBall as Football } from "@lucide/lab";
import Navbar from "../components/navbar";
export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const features = [
    {
      icon: Users,
      title: "Advanced Team Management",
      description:
        "Create and manage teams with detailed player statistics and performance tracking",
    },
    {
      icon: Calendar,
      title: "Tournament System",
      description:
        "Organize and participate in multi-stage tournaments with bracket management",
    },
    {
      icon: Zap,
      title: "Real-time Match Updates",
      description:
        "Live scoring, match commentary, and instant notifications for all participants",
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description:
        "Advanced blockchain integration with smart contracts for secure transactions",
    },
  ];

  const upcomingFeatures = [
    "AI-powered match recommendations",
    "Video highlights and replays",
    "Integrated coaching tools",
    "Advanced analytics dashboard",
    "Multi-language support",
    "Mobile app with offline mode",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10">
      {/* Header */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              🚀 Next Generation Features
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              The Future of
              <span className="text-primary"> Sports Management</span>
              <br />
              is Almost Here
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We're building something extraordinary. Advanced team management,
              tournament systems, and AI-powered features that will
              revolutionize how you experience sports in Egypt.
            </p>
            <p className="text-base text-muted-foreground" dir="rtl">
              نحن نبني شيئاً استثنائياً لمستقبل الرياضة في مصر
            </p>
          </div>

          {/* Action Buttons */}
          <Card className="max-w-2xl mx-auto border shadow-lg dark:shadow-2xl bg-card/50 dark:bg-card/30 backdrop-blur">
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
        </div>

        {/* Email Subscription */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border shadow-lg dark:shadow-2xl bg-card">
            <CardContent className="p-8 text-center">
              {!isSubscribed ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Be the First to Know</h3>
                    <p className="text-muted-foreground">
                      Get notified when we launch and receive exclusive early
                      access to premium features.
                    </p>
                  </div>
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 h-12"
                        required
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-primary hover:bg-primary/90 whitespace-nowrap"
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Notify Me
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We'll never spam you. Unsubscribe at any time.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600">
                    You're All Set!
                  </h3>
                  <p className="text-muted-foreground">
                    Thanks for subscribing! We'll notify you as soon as we
                    launch.
                  </p>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    <Mail className="w-3 h-3 mr-1" />
                    Subscribed
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Features */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">What's Coming</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful new features designed to enhance your sports experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-primary">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature List */}
        <div className="mt-16">
          <Card className="border-0 shadow-lg bg-muted/30 dark:bg-muted/10">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">
                    More Features in Development
                  </h3>
                  <div className="space-y-3">
                    {upcomingFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 text-center">
                    <div className="space-y-4">
                      <div className="text-4xl">🚀</div>
                      <h4 className="text-xl font-semibold">
                        Early Access Program
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Join our beta testing program and help shape the future
                        of tal3a
                      </p>
                      <Button variant="outline" className="bg-transparent">
                        Join Beta
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Join the Community</h3>
            <p className="text-muted-foreground">
              Follow our progress and connect with other sports enthusiasts
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="bg-transparent">
              <span className="mr-2">📱</span>
              Telegram
            </Button>
            <Button variant="outline" className="bg-transparent">
              <span className="mr-2">🐦</span>
              Twitter
            </Button>
            <Button variant="outline" className="bg-transparent">
              <span className="mr-2">📘</span>
              Facebook
            </Button>
            <Button variant="outline" className="bg-transparent">
              <span className="mr-2">📸</span>
              Instagram
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 tal3a. Building the future of sports in Egypt.
          </p>
        </div>
      </div>
    </div>
  );
}
