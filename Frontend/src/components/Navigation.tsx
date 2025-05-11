import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  ShoppingCart,
  Layers,
  History,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import XenoLogo from "./XenoLogo";

const Navigation: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Add Customers",
      path: "/add-customers",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      name: "Add Orders",
      path: "/add-orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Segment Builder",
      path: "/segment-builder",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      name: "Campaign History",
      path: "/campaign-history",
      icon: <History className="h-5 w-5" />,
    },
  ];

  const NavItems = () => (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${
              isActive
                ? "bg-xeno-secondary text-xeno-primary font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          {link.icon}
          <span>{link.name}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex justify-between items-center px-6 py-3 lg:py-2 mx-auto max-w-7xl">
        {/* Logo Section */}
        <div className="flex items-center">
          <XenoLogo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-xeno-secondary text-xeno-primary font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-8 h-9 w-56 bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 h-9 px-2.5 mr-2"
          >
            Sign In
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px] pt-10">
              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <XenoLogo />
                </div>
                <nav className="space-y-2">
                  <NavItems />
                </nav>
                <div className="mt-8 pt-8 border-t">
                  <Button className="w-full bg-xeno-primary hover:bg-xeno-primary/90 flex items-center justify-center gap-1">
                    Request Demo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-auto pt-8">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="User avatar" />
                      <AvatarFallback className="bg-xeno-primary text-primary-foreground">
                        XC
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Xeno User</p>
                      <p className="text-xs text-gray-500">user@xeno.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

const UserMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger className="outline-none">
      <Avatar>
        <AvatarImage src="/placeholder.svg" alt="User avatar" />
        <AvatarFallback className="bg-xeno-primary text-primary-foreground">
          XC
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuItem
        asChild
        className="cursor-pointer flex items-center gap-2"
      >
        <Link to="/profile">
          <User className="h-4 w-4" />
          <span>Profile</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem
        asChild
        className="cursor-pointer flex items-center gap-2"
      >
        <Link to="/settings">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-500 focus:text-red-500">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default Navigation;
