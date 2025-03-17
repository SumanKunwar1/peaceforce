import type React from "react";
import { type ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaInfoCircle, FaHandHoldingHeart } from "react-icons/fa";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Map,
  Heart,
  Settings,
  CalendarCheck,
  LogOut,
  FileText,
  Sliders,
  Home,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  BookUserIcon,
  BookOpenCheck,
  BookUp2Icon,
  Contact2Icon,
  QuoteIcon,
  BarChart,
  ClipboardType,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "About", href: "/admin/about", icon: Home },
  { name: "Programs", href: "/admin/Programs", icon: Calendar },
  {
    name: "Program Booking",
    href: "/admin/program-booking",
    icon: BookUp2Icon,
  },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Enrollments", href: "/admin/enrollments", icon: BookOpenCheck },
  { name: "Tours", href: "/admin/tours", icon: Map },
  { name: "Tour Bookings", href: "/admin/bookings", icon: BookUserIcon },
  { name: "Support Us", href: "/admin/support-us", icon: FaHandHoldingHeart },
  { name: "Events", href: "/admin/events", icon: CalendarCheck },
  { name: "Event Bookings", href: "/admin/event-bookings", icon: BookUserIcon },
  { name: "Pages", href: "/admin/pages", icon: FileText },
  { name: "Membership", href: "/admin/membership", icon: ClipboardType },
  { name: "Statistics", href: "/admin/stats", icon: BarChart },
  { name: "Enquiries", href: "/admin/enquiries", icon: Contact2Icon },
  { name: "Slider", href: "/admin/slider", icon: Sliders },
  { name: "Testimonials", href: "/admin/testimonials", icon: QuoteIcon },
  { name: "Donations", href: "/admin/donations", icon: Heart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  {
    name: "Footer",
    href: "/admin/footer",
    icon: CalendarCheck,
    dropdownLinks: [
      { name: "Blog", href: "/admin/blogs" },
      { name: "FAQ", href: "/admin/faq", icon: FaInfoCircle },
      { name: "Our Team", href: "/admin/team" },
      { name: "Gallery", href: "/admin/gallery" },
      { name: "Career", href: "/admin/career" },
      { name: "Newsletters", href: "/admin/newsletters" },
    ],
  },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [openFooter, setOpenFooter] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFooter = () => {
    setOpenFooter(!openFooter);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast({
      title: "Logout successful",
      description: "You have been logged out successfully.",
      duration: 4000,
    });
    navigate("/admin");
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 bg-red-600">
            <Link
              to="/admin/dashboard"
              className="text-white text-xl font-bold"
            >
              BTMC Admin
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-white"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;

              if (item.dropdownLinks) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={toggleFooter}
                      className={cn(
                        "flex items-center w-full px-4 py-2 text-gray-600 rounded-lg transition-colors",
                        isActive
                          ? "bg-red-50 text-red-600"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="flex-1 text-left">{item.name}</span>
                      {openFooter ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {openFooter && (
                      <div className="ml-6 space-y-1 mt-1">
                        {item.dropdownLinks.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            className={cn(
                              "block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors",
                              location.pathname === dropdownItem.href
                                ? "bg-red-50 text-red-600"
                                : "text-gray-600"
                            )}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-red-50 text-red-600"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-64" : "ml-0"
        )}
      >
        <header className="h-16 bg-white shadow-sm">
          <div className="flex items-center justify-between h-full px-6">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin User</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80"
                        alt="Admin"
                      />
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Admin User
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Link to="/admin/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
