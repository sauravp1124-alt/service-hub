import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Car,
  FolderTree,
  Wrench,
  FileText,
  TrendingUp,
  UserCheck,
  Building2,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { customersApi, vehiclesApi, categoriesApi, servicesApi, serviceRecordsApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  totalCustomers: number;
  totalVehicles: number;
  totalCategories: number;
  totalServices: number;
  individualCustomers: number;
  businessCustomers: number;
  pendingRecords: number;
  completedRecords: number;
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersRes, vehiclesRes, categories, servicesRes, recordsRes] = await Promise.all([
          customersApi.list({ limit: 1000 }),
          vehiclesApi.list({ limit: 1000 }),
          categoriesApi.list(),
          servicesApi.list({ limit: 1000 }),
          serviceRecordsApi.list({ limit: 1000 }),
        ]);

        const customers = customersRes.customers || [];
        const vehicles = vehiclesRes.vehicles || [];
        const services = servicesRes.services || [];
        const records = recordsRes.service_records || [];

        setStats({
          totalCustomers: customers.length,
          totalVehicles: vehicles.length,
          totalCategories: categories.length,
          totalServices: services.length,
          individualCustomers: customers.filter((c) => c.customer_type === 'individual').length,
          businessCustomers: customers.filter((c) => c.customer_type === 'business').length,
          pendingRecords: records.filter((r) => r.status === 'pending' || r.status === 'in_progress').length,
          completedRecords: records.filter((r) => r.status === 'completed').length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: 'from-primary to-primary/70',
      link: '/customers',
    },
    {
      title: 'Total Vehicles',
      value: stats?.totalVehicles ?? 0,
      icon: Car,
      color: 'from-secondary to-secondary/70',
      link: '/vehicles',
    },
    {
      title: 'Vehicle Categories',
      value: stats?.totalCategories ?? 0,
      icon: FolderTree,
      color: 'from-accent to-accent/70',
      link: '/categories',
    },
    {
      title: 'Service Types',
      value: stats?.totalServices ?? 0,
      icon: Wrench,
      color: 'from-info to-info/70',
      link: '/services',
    },
  ];

  const secondaryStats = [
    {
      title: 'Individual Customers',
      value: stats?.individualCustomers ?? 0,
      icon: UserCheck,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Business Customers',
      value: stats?.businessCustomers ?? 0,
      icon: Building2,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Pending Services',
      value: stats?.pendingRecords ?? 0,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Completed Services',
      value: stats?.completedRecords ?? 0,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  const quickActions = [
    { label: 'Add Customer', icon: Users, path: '/customers/new', color: 'bg-primary hover:bg-primary/90' },
    { label: 'Add Vehicle', icon: Car, path: '/vehicles/new', color: 'bg-secondary hover:bg-secondary/90' },
    { label: 'New Service Record', icon: FileText, path: '/service-records/new', color: 'bg-accent hover:bg-accent/90 text-accent-foreground' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Overview of your vehicle servicing business
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button key={action.path} asChild className={action.color}>
              <Link to={action.path}>
                <Plus className="mr-2 h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Link key={stat.title} to={stat.link} className="group">
            <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-2.5 text-primary-foreground`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stat.value}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {secondaryStats.map((stat) => (
          <Card key={stat.title} className="border transition-all hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-xl ${stat.bgColor} p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stat.value}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Customer Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-success" />
                      Individual
                    </span>
                    <span className="font-medium">{stats?.individualCustomers ?? 0}</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-success transition-all duration-500"
                      style={{
                        width: stats?.totalCustomers
                          ? `${((stats.individualCustomers / stats.totalCustomers) * 100).toFixed(0)}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-secondary" />
                      Business
                    </span>
                    <span className="font-medium">{stats?.businessCustomers ?? 0}</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-secondary transition-all duration-500"
                      style={{
                        width: stats?.totalCustomers
                          ? `${((stats.businessCustomers / stats.totalCustomers) * 100).toFixed(0)}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-warning" />
                      Pending / In Progress
                    </span>
                    <span className="font-medium">{stats?.pendingRecords ?? 0}</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-warning transition-all duration-500"
                      style={{
                        width:
                          stats?.pendingRecords || stats?.completedRecords
                            ? `${((stats.pendingRecords / (stats.pendingRecords + stats.completedRecords)) * 100).toFixed(0)}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Completed
                    </span>
                    <span className="font-medium">{stats?.completedRecords ?? 0}</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-success transition-all duration-500"
                      style={{
                        width:
                          stats?.pendingRecords || stats?.completedRecords
                            ? `${((stats.completedRecords / (stats.pendingRecords + stats.completedRecords)) * 100).toFixed(0)}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
