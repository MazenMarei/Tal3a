import { useState } from "react";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { Input } from "../components/input";
import { Badge } from "../components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import Navbar from "../components/navbar";
import {
  Bike,
  Dumbbell,
  Users,
  Shield,
  Globe,
  Star,
  MapPin,
  Calendar,
  Smartphone,
  Monitor,
  ArrowRight,
  Icon,
} from "lucide-react";
import { soccerBall as Football } from "@lucide/lab";
import Logo_1 from "../assets/Logo_1.svg";

export default function Landing() {
  const [email, setEmail] = useState("");

  function comingSoonPage() {
    window.location.href = "/coming-soon";
  }
  const features = [
    {
      icon: Shield,
      title: "Decentralized & Trusted",
      description:
        "Built on blockchain technology for transparent and secure event management",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Connect with like-minded athletes and build lasting sports communities",
    },
    // {
    //   icon: Zap,
    //   title: "Instant Payments",
    //   description:
    //     "Fast, secure crypto payments with EGP conversion for local convenience",
    // },
    {
      icon: Globe,
      title: "Local Focus",
      description:
        "Designed specifically for Egyptian sports enthusiasts with Arabic support",
    },
  ];

  const sports = [
    {
      name: "Football",
      icon: Football,
      events: "150+ events",
      color: "bg-primary",
    },
    {
      name: "Cycling",
      icon: Bike,
      events: "80+ events",
      color: "bg-secondary",
    },
    {
      name: "Fitness",
      icon: Dumbbell,
      events: "120+ events",
      color: "bg-accent",
    },
  ];

  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Football Enthusiast",
      location: "Cairo",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "Tal3a transformed how I find and join football matches. The community is amazing and payments are seamless!",
    },
    {
      name: "Fatima Al-Zahra",
      role: "Cycling Coach",
      location: "Alexandria",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "As a coach, I love how easy it is to organize cycling events and manage participants. The platform is intuitive and reliable.",
    },
    {
      name: "Omar Mahmoud",
      role: "Fitness Trainer",
      location: "Giza",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "The best platform for fitness bootcamps in Egypt. Great community, easy payments, and excellent organization tools.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500+", label: "Events Monthly" },
    { number: "25+", label: "Cities" },
    { number: "4.9", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-background hover:cursor-default">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:text-white hover:cursor-default">
                  🚀 Now Live in Egypt
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Join Real-World
                  <span className="text-primary"> Sports Events</span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  Discover, join, and host sports activities in your city. Built
                  on Web3 technology for transparent, secure, and
                  community-driven experiences.
                </p>
                <p className="text-base text-muted-foreground" dir="rtl">
                  انضم إلى الأحداث الرياضية الحقيقية. لامركزي. موثوق.
                </p>
              </div>

              {/* <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div> */}

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-2xl lg:text-3xl font-bold text-primary">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-card rounded-2xl shadow-2xl p-6 border">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>AH</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Ahmed Hassan</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Cairo, Egypt
                      </div>
                    </div>
                  </div>
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Friday Football Match</h3>
                        <Badge className="bg-primary text-white">50 EGP</Badge>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Today • 6:00 PM
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          New Cairo Sports Club
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          18/22 joined
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-4 bg-primary hover:bg-primary/90"
                        onClick={comingSoonPage}
                      >
                        Join Event
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl transform rotate-3 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Why Choose Tal3a?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of sports community management with our
              innovative Web3 platform
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section id="sports" className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Popular Sports</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of athletes across Egypt in your favorite sports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sports.map((sport, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all group"
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div
                    className={`w-16 h-16 ${sport.color} rounded-2xl flex items-center justify-center mx-auto  transition-transform`}
                  >
                    {Array.isArray(sport.icon) ? (
                      <Icon
                        iconNode={Football}
                        className="w-8 h-8 text-white"
                      />
                    ) : (
                      <sport.icon className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{sport.name}</h3>
                    <p className="text-muted-foreground">{sport.events}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent   transition-colors"
                    onClick={comingSoonPage}
                  >
                    Explore Events
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              What Our Community Says
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied athletes across Egypt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={testimonial.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Ready to Transform Your Sports Experience?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Join thousands of athletes across Egypt. Start discovering,
                joining, and hosting amazing sports events today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 whitespace-nowrap"
              >
                Get Started
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-white/90">
                <Smartphone className="w-5 h-5" />
                <span className="text-sm">Mobile App</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Monitor className="w-5 h-5" />
                <span className="text-sm">Desktop Platform</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure & Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={Logo_1} alt="Tal3a Logo" className="h-8" />
              </div>
              <p className="text-muted-foreground">
                The future of sports community management in Egypt.
                Decentralized, trusted, and community-driven.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Find Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Host Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Join Groups
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Safety
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Tal3a. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>🇪🇬 Made in Egypt</span>
              <span>•</span>
              <span>العربية | English</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
