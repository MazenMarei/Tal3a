import { useState } from "react";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { Badge } from "../components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import {
  ClubIcon as Football,
  Users,
  Heart,
  Globe,
  Shield,
  Zap,
  Award,
  MapPin,
  Calendar,
  Star,
  Quote,
  Linkedin,
  Twitter,
  Mail,
  ChevronRight,
  Play,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/navbar";

export function AboutUsPage() {
  const [activeTab, setActiveTab] = useState("story");

  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "500+", label: "Events Monthly", icon: Calendar },
    { number: "25+", label: "Cities Covered", icon: MapPin },
    { number: "4.9", label: "User Rating", icon: Star },
  ];

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description:
        "We believe in building strong, inclusive sports communities that bring people together across Egypt.",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description:
        "Blockchain technology ensures every transaction and interaction is secure and transparent.",
    },
    {
      icon: Globe,
      title: "Local Impact",
      description:
        "Designed specifically for Egyptian sports culture with Arabic support and local payment methods.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "Constantly pushing boundaries with cutting-edge Web3 technology and user-centric design.",
    },
  ];

  const team = [
    {
      name: "Ahmed El-Masry",
      role: "Co-Founder & CEO",
      bio: "Former professional footballer turned tech entrepreneur. 10+ years in sports management and blockchain technology.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "ahmed@tal3a.eg",
      },
    },
    {
      name: "Fatima Hassan",
      role: "Co-Founder & CTO",
      bio: "Blockchain engineer with expertise in smart contracts. Previously led tech teams at major fintech companies.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "fatima@tal3a.eg",
      },
    },
    {
      name: "Omar Mahmoud",
      role: "Head of Product",
      bio: "UX/UI expert passionate about creating intuitive sports experiences. Former design lead at top Egyptian startups.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "omar@tal3a.eg",
      },
    },
    {
      name: "Nour Al-Din",
      role: "Community Manager",
      bio: "Sports enthusiast and community builder. Manages relationships with sports clubs and event organizers across Egypt.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "nour@tal3a.eg",
      },
    },
  ];

  const testimonials = [
    {
      name: "Mohamed Ali",
      role: "Football Coach",
      location: "Cairo",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face",
      text: "tal3a has transformed how I organize training sessions and tournaments. The platform is incredibly user-friendly and the community is fantastic.",
    },
    {
      name: "Sarah Ahmed",
      role: "Cycling Enthusiast",
      location: "Alexandria",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face",
      text: "I've met so many amazing people through tal3a. The events are well-organized and the payment system is seamless.",
    },
    {
      name: "Khaled Hassan",
      role: "Fitness Trainer",
      location: "Giza",
      avatar:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=60&h=60&fit=crop&crop=face",
      text: "As a trainer, tal3a helps me reach more clients and manage my fitness bootcamps efficiently. Highly recommended!",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 lg:py-24 cursor-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:text-white">
                  🇪🇬 Made in Egypt
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Building the Future of
                  <span className="text-primary"> Sports Communities</span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  We're on a mission to connect athletes, organize events, and
                  build stronger sports communities across Egypt using
                  cutting-edge Web3 technology.
                </p>
                <p className="text-base text-muted-foreground" dir="rtl">
                  نحن نبني مستقبل المجتمعات الرياضية في مصر
                </p>
              </div>

              {/* <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Our Story
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent">
                  <Users className="w-5 h-5 mr-2" />
                  Meet the Team
                </Button>
              </div> */}
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-lg bg-card/50 backdrop-blur"
                  >
                    <CardContent className="p-6 text-center">
                      <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-primary">
                        {stat.number}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {[
              { id: "story", label: "Our Story" },
              { id: "values", label: "Our Values" },
              { id: "team", label: "Meet the Team" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                } hover:cursor-pointer`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Our Story */}
          {activeTab === "story" && (
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">Our Story</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  tal3a was born from a simple observation: Egypt has incredible
                  sports talent and passion, but organizing and participating in
                  sports events was fragmented and inefficient.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">The Problem We Saw</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
                      <p className="text-muted-foreground">
                        Athletes struggled to find quality events and teammates
                        in their area
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
                      <p className="text-muted-foreground">
                        Event organizers had limited tools for managing
                        registrations and payments
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
                      <p className="text-muted-foreground">
                        Trust issues with payments and event quality were common
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Our Solution</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-muted-foreground">
                        A unified platform connecting athletes, coaches, and
                        event organizers
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-muted-foreground">
                        Blockchain-powered transparency and secure payment
                        processing
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-muted-foreground">
                        Community-driven ratings and reviews for quality
                        assurance
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="p-8 text-center">
                  <Quote className="w-12 h-12 text-primary mx-auto mb-4" />
                  <blockquote className="text-xl lg:text-2xl font-medium mb-4">
                    "We believe that sports have the power to unite communities,
                    build character, and create lasting friendships. Our mission
                    is to make these connections easier and more meaningful."
                  </blockquote>
                  <cite className="text-muted-foreground">
                    — tal3a Founding Team
                  </cite>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Our Values */}
          {activeTab === "values" && (
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">Our Values</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  These core principles guide everything we do and shape how we
                  build our platform and community.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-8 space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <value.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-muted/30 rounded-2xl p-8 lg:p-12">
                <div className="text-center space-y-6">
                  <h3 className="text-2xl font-bold">
                    Our Commitment to Egypt
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    We're proud to be an Egyptian company building for Egyptian
                    athletes. Our platform supports Arabic language, local
                    payment methods, and is designed with Egyptian sports
                    culture in mind.
                  </p>
                  <div className="flex items-center justify-center gap-8 pt-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🇪🇬</div>
                      <div className="text-sm font-medium">Made in Egypt</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏆</div>
                      <div className="text-sm font-medium">
                        For Egyptian Athletes
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🤝</div>
                      <div className="text-sm font-medium">
                        Community Driven
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Meet the Team */}
          {activeTab === "team" && (
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Meet the Team
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  We're a passionate team of athletes, engineers, and community
                  builders working to revolutionize sports in Egypt.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarImage
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                        />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-primary font-medium">
                          {member.role}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {member.bio}
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* 
              <Card className="border-0 shadow-lg bg-primary/5">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Join Our Team</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    We're always looking for passionate individuals who share
                    our vision of building better sports communities. Check out
                    our open positions and join us in revolutionizing sports in
                    Egypt.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90">
                    View Open Positions
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card> */}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">
              What Our Community Says
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from the athletes, coaches, and organizers who make tal3a
              special
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <Quote className="w-8 h-8 text-primary" />
                  <p className="text-muted-foreground italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
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
                Ready to Join Our Community?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Be part of Egypt's fastest-growing sports community. Connect
                with athletes, join events, and build lasting friendships
                through sports.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Users className="w-5 h-5 mr-2" />
                Join tal3a
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Football className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">tal3a</span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Building the future of sports communities in Egypt. Connecting
              athletes, organizing events, and creating lasting friendships
              through the power of sports and technology.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>🇪🇬 Made in Egypt</span>
              <span>•</span>
              <span>العربية | English</span>
              <span>•</span>
              <span>© 2024 tal3a</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
