"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { pageApi } from "@/lib/pageApi";
import type { IPageData } from "@/types/page";
import { NavItems } from "@/config/navigation"; // Update this path to match your actual file location

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pages, setPages] = useState<IPageData[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await pageApi.getPublishedPages();
        if (Array.isArray(response?.pages)) {
          setPages(response?.pages);
        } else {
          console.error("Unexpected response format:", response);
          setPages([]);
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
        setPages([]);
      }
    };
    fetchPages();
  }, []);

  // Filter pages that should appear in the header
  const headerPages = pages.filter((page) => page.location === "header");

  // Get parent pages - these are both static nav items and dynamic pages with parentPage="none"
  const getParentPages = () => {
    // Get dynamic parent pages (those with parentPage="none")
    const dynamicParentPages = headerPages.filter(
      (page) => page.parentPage === "none"
    );

    // Combine NavItems with dynamic parent pages, avoiding duplicates
    return [
      ...NavItems,
      ...dynamicParentPages.filter(
        (page) => !NavItems.some((item) => item.path === `/${page.slug}`)
      ),
    ];
  };

  const getChildPages = (parentId: string) => {
    return headerPages.filter((page) => {
      // For NavItems, parentPage should match the path
      if (NavItems.some((item) => item.path === parentId)) {
        return page.parentPage === parentId;
      } else {
        // For dynamic pages, parentPage should match the _id
        return page.parentPage === parentId;
      }
    });
  };

  const renderNavItems = () => {
    const parentPages = getParentPages();

    return parentPages.map((item) => {
      // Get child pages for this parent
      const childPages = getChildPages("path" in item ? item.path : item._id);

      const itemPath = "path" in item ? item.path : `/${item.slug}`;
      const itemLabel = "label" in item ? item.label : item.title;
      const itemId = "path" in item ? item.path : item._id;
      const isActive = location.pathname === itemPath;

      if (childPages.length > 0) {
        // This is a parent with children - render as a triggerAsChild dropdown
        return (
          <NavigationMenuItem key={itemId}>
            <NavigationMenuTrigger className="bg-[#fffafa]">
              <div className="flex items-center px-4 py-2 rounded-md font-bold text-base transition-all duration-200 cursor-pointer">
                <Link
                  to={itemPath}
                  className={`mr-2 ${
                    isActive
                      ? "text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {itemLabel}
                </Link>
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {childPages.map((childPage) => (
                  <li key={childPage._id}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/${childPage.slug}`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {childPage.title}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {childPage.metaDescription}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        );
      } else {
        // This is a parent with no children - render as regular link
        return (
          <NavigationMenuItem key={itemId}>
            <NavigationMenuLink asChild>
              <Link
                to={itemPath}
                className={`px-4 py-2 rounded-md font-bold text-base transition-all duration-200 ${
                  isActive
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                {itemLabel}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        );
      }
    });
  };

  // Handle click on mobile parent item with children
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleMobileSubmenu = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const renderMobileNavItems = () => {
    const parentPages = getParentPages();

    return parentPages.map((item) => {
      // Get child pages for this parent
      const childPages = getChildPages("path" in item ? item.path : item._id);

      const itemPath = "path" in item ? item.path : `/${item.slug}`;
      const itemLabel = "label" in item ? item.label : item.title;
      const itemId = "path" in item ? item.path : item._id;
      const isActive = location.pathname === itemPath;
      const isExpanded = expandedItems.has(itemId);

      if (childPages.length > 0) {
        // Parent with children - render as collapsible section with clickable parent
        return (
          <div key={itemId} className="space-y-2">
            <div className="flex items-center justify-between">
              <Link
                to={itemPath}
                className={`${
                  isActive
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                } px-3 py-2 rounded-md text-base font-bold flex-grow`}
                onClick={() => setIsOpen(false)}
              >
                {itemLabel}
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleMobileSubmenu(itemId);
                }}
                className="px-3 py-2"
                aria-expanded={isExpanded}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            {isExpanded && (
              <div className="pl-4 space-y-2">
                {childPages.map((childPage) => (
                  <Link
                    key={childPage._id}
                    to={`/${childPage.slug}`}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === `/${childPage.slug}`
                        ? "bg-green-50 text-green-600"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {childPage.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      } else {
        // Parent with no children - render as regular link
        return (
          <Link
            key={itemId}
            to={itemPath}
            className={`${
              isActive
                ? "bg-green-50 text-green-600"
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
            } block px-3 py-2 rounded-md text-base font-bold`}
            onClick={() => setIsOpen(false)}
          >
            {itemLabel}
          </Link>
        );
      }
    });
  };

  return (
    <nav className="bg-gradient-to-r from-white via-green-50 to-white shadow-lg sticky top-0 z-50">
      <div className="mx-auto sm:mx-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between py-4 md:py-4">
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            >
              <img
                src="/logo.png"
                alt="PeaceForce Logo"
                className="w-auto h-14"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>{renderNavItems()}</NavigationMenuList>
            </NavigationMenu>
            <Link
              to="/support"
              className="ml-4 px-6 py-2 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition-colors"
            >
              Support Us
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {renderMobileNavItems()}
            <Link
              to="/support"
              className="block px-3 py-2 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Support Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
