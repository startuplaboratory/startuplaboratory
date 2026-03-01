import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { ChevronRight, LogOut, LayoutDashboard, User, FlaskConical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <FlaskConical className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">
              STARTUP LAB
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/#how-it-works"
              className={`text-sm font-medium transition-colors hover:text-violet-600 ${
                isActive('/') ? 'text-foreground' : 'text-muted-foreground'
              }`}
              data-testid="nav-how-it-works"
            >
              How it works
            </Link>
            <Link
              to="/ideas"
              className={`text-sm font-medium transition-colors hover:text-violet-600 ${
                isActive('/ideas') ? 'text-violet-600' : 'text-muted-foreground'
              }`}
              data-testid="nav-ideas"
            >
              Ideas
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-violet-600 ${
                isActive('/about') ? 'text-foreground' : 'text-muted-foreground'
              }`}
              data-testid="nav-about"
            >
              About
            </Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    className="btn-gradient h-10 px-5 rounded-full text-sm"
                    data-testid="nav-start-analysis"
                  >
                    Dashboard
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" data-testid="user-menu-trigger">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-mono bg-violet-100 text-violet-700 px-2 py-0.5 rounded">
                          {user.credits} credits
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} data-testid="menu-dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    {user.plan_type === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} data-testid="menu-admin">
                        <User className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout" className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="h-10 px-5 text-sm font-medium rounded-full"
                    data-testid="nav-login"
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    className="btn-gradient h-10 px-5 rounded-full text-sm"
                    data-testid="nav-start-analysis-guest"
                  >
                    Get Started
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
