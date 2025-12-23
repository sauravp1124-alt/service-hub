import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Car,
  Users,
  Wrench,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import logo from '@/assets/logo.jpg';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Manage individual and business customers with detailed profiles',
    },
    {
      icon: Car,
      title: 'Vehicle Tracking',
      description: 'Track all vehicles with complete service history',
    },
    {
      icon: Wrench,
      title: 'Service Records',
      description: 'Create and manage detailed service records',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security for your data',
    },
  ];

  const benefits = [
    'Easy customer registration',
    'Quick vehicle lookup',
    'Detailed service tracking',
    'Payment management',
    'Comprehensive reports',
    'Mobile-friendly design',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Swami Samarth" className="h-10 w-10 rounded-xl" />
            <span className="text-xl font-bold">
              <span className="text-gradient">Shree Swami Samarth</span>
            </span>
          </div>
          <Button asChild className="gradient-primary">
            <Link to="/login">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-8 h-32 w-32 overflow-hidden rounded-3xl shadow-2xl ring-4 ring-primary/20">
            <img src={logo} alt="Swami Samarth" className="h-full w-full object-cover" />
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            <span className="text-gradient">Shree Swami Samarth</span>
            <br />
            <span className="text-foreground">Vehicle Servicing</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Complete vehicle servicing management solution for your service center.
            Manage customers, vehicles, services, and payments all in one place.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gradient-primary text-lg px-8">
              <Link to="/login">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Everything You Need
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-xl gradient-primary p-3 text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-12 text-3xl font-bold md:text-4xl">
              Why Choose Us?
            </h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-success" />
                  <span className="text-left font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="relative container mx-auto px-4 text-center text-primary-foreground">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg opacity-90">
            Sign in to access your vehicle servicing management dashboard
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/login">
              Sign In Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg" />
            <span className="font-semibold">Shree Swami Samarth Services</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
