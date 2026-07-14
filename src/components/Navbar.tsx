"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Avatar,
  Button,
  Dropdown,
  Label,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDarkMode, MdLightMode, MdLogout, MdPerson } from "react-icons/md";
import { useTheme } from "@/lib/theme-context";
import type { User } from "@/types";

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname();

  const handleSignOut = () => {
    logout();
  };

  const isActive = (href: string) => pathname === href;

  const navLinkClass = (active: boolean) => `font-medium transition-colors ${
    active
      ? isDarkMode
        ? "text-purple-400"
        : "text-purple-600"
      : isDarkMode
      ? "hover:text-purple-400"
      : "hover:text-purple-600"
  }`;

  const bgClass = isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900";
  const borderClass = isDarkMode ? "border-slate-800" : "border-slate-200";
  const themeButtonClass = isDarkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200";

  return (
    <div className={`${bgClass} py-4 sticky top-0 z-50 border-b ${borderClass}`}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
          <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
            V
          </div>
          <span>IdeaVault</span>
        </Link>

        {/* Center Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link href="/" className={navLinkClass(isActive("/"))}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/ideas" className={navLinkClass(isActive("/ideas"))}>
              Ideas
            </Link>
          </li>

          {/* Private Routes - Only for logged in users */}
          {isAuthenticated && (
            <>
              <li>
                <Link href="/add-idea" className={navLinkClass(isActive("/add-idea"))}>
                  Add Idea
                </Link>
              </li>
              <li>
                <Link href="/my-ideas" className={navLinkClass(isActive("/my-ideas"))}>
                  My Ideas
                </Link>
              </li>
              <li>
                <Link href="/my-interactions" className={navLinkClass(isActive("/my-interactions"))}>
                  My Interactions
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${themeButtonClass}`}>
            {isDarkMode ? (
              <MdDarkMode className="text-white text-xl" />
            ) : (
              <MdLightMode className="text-yellow-500 text-xl" />
            )}
          </button>

          {/* User Dropdown or Auth Links */}
          {isAuthenticated && user ? (
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="transition-transform" size="sm">
                    <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                    <Avatar.Fallback>{user?.name?.charAt(0)?.toUpperCase()}</Avatar.Fallback>
                  </Avatar>
                  <span className="hidden sm:inline font-medium">{user?.name}</span>
                </div>
              </DropdownTrigger>
              <Dropdown.Popover>
                <div className="px-3 pt-3 pb-1">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <Avatar.Image
                        referrerPolicy="no-referrer"
                        alt={user?.name || "User"}
                        src={user?.image}
                      />
                      <Avatar.Fallback delayMs={600}>
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col gap-0">
                      <p className="text-sm leading-5 font-medium">{user?.name}</p>
                      <p className="text-xs leading-none text-muted">{(user as User | null)?.email}</p>
                    </div>
                  </div>
                </div>
                <Dropdown.Menu aria-label="User Actions">
                  <DropdownItem id="profile" textValue="Profile" href="/profile">
                    <div className="flex w-full items-center justify-between gap-2">
                      <Label>Profile</Label>
                      <MdPerson className="size-3.5 text-muted" />
                    </div>
                  </DropdownItem>
                  <DropdownItem id="logout" textValue="Logout" variant="danger" onClick={handleSignOut}>
                    <div className="flex w-full items-center justify-between gap-2">
                      <Label>Logout</Label>
                      <MdLogout className="size-3.5 text-danger" />
                    </div>
                  </DropdownItem>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className={isDarkMode ? "text-white" : ""}>
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-linear-to-r from-purple-500 to-pink-500 text-white">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center justify-between px-4 mt-4">
        <ul className="flex gap-4 text-sm">
          <li>
            <Link href="/" className="font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link href="/ideas" className="font-medium">
              Ideas
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link href="/add-idea" className="font-medium">
                  Add
                </Link>
              </li>
              <li>
                <Link href="/my-ideas" className="font-medium">
                  My Ideas
                </Link>
              </li>
              <li>
                <Link href="/my-interactions" className="font-medium">
                  Interactions
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
