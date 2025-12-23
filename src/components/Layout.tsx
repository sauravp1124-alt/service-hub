import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  Car,
  FolderTree,
  Wrench,
  FileText,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import logo from '@/assets/logo.jpg';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/vehicles', label: 'Vehicles', icon: Car },
  { path: '/categories', label: 'Categories', icon: FolderTree },
  { path: '/services', label: 'Services', icon: Wrench },
  { path: '/service-records', label: 'Service Records', icon: FileText },
  { path: '/payments', label: 'Payments', icon: CreditCard },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-sidebar transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex items-center gap-3 border-b border-sidebar-border p-6">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-sidebar-accent shadow-lg">
              <img src={logo} alt="Swami Samarth" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="truncate text-lg font-bold text-sidebar-foreground">
                Swami Samarth
              </h1>
              <p className="text-xs text-sidebar-foreground/70">Vehicle Servicing</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'gradient-primary text-primary-foreground shadow-md'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-primary-foreground' : ''}`} />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User Section */}
          <div className="border-t border-sidebar-border p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user?.user_metadata?.name || user?.email || 'User'}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-foreground hover:bg-muted"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg" />
            <span className="font-semibold text-foreground">Swami Samarth</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
