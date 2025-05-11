import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  User,
  Menu,
  LayoutDashboard,
  Settings,
  Mail,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [initials] = useState('US');
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Segments', href: '/segments', icon: Mail },
    { name: 'Campaigns', href: '/campaigns', icon: Mail },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              XENO CRM
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-lg transition-all',
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <div className="flex flex-col h-full py-6">
                    <div className="mb-8 px-4">
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                        XENO CRM
                      </span>
                    </div>
                    <nav className="flex-1 flex flex-col gap-1">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                              'flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                              pathname === item.href
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            )}
                          >
                            <Icon className="h-5 w-5 mr-3" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full h-9 w-9 p-0 hover:bg-gray-50 focus-visible:ring-offset-2"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 shadow-lg rounded-xl">
                <div className="px-2 py-1.5 text-sm font-medium text-gray-700">
                  Demo User
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer px-3 py-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer px-3 py-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer px-3 py-2 text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
