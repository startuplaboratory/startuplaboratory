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
    <header className="glass border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
            <FlaskConical className="h-5 w-5" />
            <span className="font-heading font-semibold tracking-tight">
              STARTUP LAB
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/#how-it-works"
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive('/') ? 'text-foreground' : 'text-muted-foreground'
              }`}
              data-testid="nav-how-it-works"
            >
              How it works
            </Link>
            <Link
              to="/ideas"
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive('/ideas') ? 'text-foreground' : 'text-muted-foreground'
              }`}
              data-testid="nav-ideas"
            >
              Ideas
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive('/about') ? 'text-foreground' : 'text-muted-foreground'
              }`}
              data-testid="nav-about"
            >
              About
            </Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    className="h-9 px-4 text-sm rounded-lg"
                    data-testid="nav-start-analysis"
                  >
                    Dashboard
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" data-testid="user-menu-trigger">
                      <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-medium">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-lg">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">{user.credits} credits</p>
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
                    <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
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
                    className="h-9 px-4 text-sm rounded-lg"
                    data-testid="nav-login"
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    className="h-9 px-4 text-sm rounded-lg"
                    data-testid="nav-start-analysis-guest"
                  >
                    Get Started
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
