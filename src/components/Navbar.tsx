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
  const { user, logout, isAuthenticated, isAdmin, isFounder, isInvestor } =
    useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const navLinkClass = (active: boolean) =>
    `whitespace-nowrap font-medium transition-all duration-200 px-2 lg:px-3 py-1.5 rounded-full text-sm lg:text-base ${
      active
        ? isDarkMode
          ? "text-[#1591DC] bg-[#2C5EAD]/20"
          : "text-[#1591DC] bg-[#C4E2F5]/40"
        : isDarkMode
          ? "text-slate-400 hover:text-white"
          : "text-slate-600 hover:text-[#1591DC]"
    }`;

  const role = user?.role;

  const guestLinks = (
    <>
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
    </>
  );

  const founderLinks = (
    <>
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
        <Link
          href="/my-interactions"
          className={navLinkClass(isActive("/my-interactions"))}
        >
          My Interactions
        </Link>
      </li>
      <li>
        <Link
          href="/received-interests"
          className={navLinkClass(isActive("/received-interests"))}
        >
          Received Interests
        </Link>
      </li>
    </>
  );

  const investorLinks = (
    <>
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
      <li>
        <Link
          href="/saved-ideas"
          className={navLinkClass(isActive("/saved-ideas"))}
        >
          My Bookmarks
        </Link>
      </li>
      <li>
        <Link
          href="/my-interactions"
          className={navLinkClass(isActive("/my-interactions"))}
        >
          My Interactions
        </Link>
      </li>
      <li>
        <Link
          href="/my-interests"
          className={navLinkClass(isActive("/my-interests"))}
        >
          My Interests
        </Link>
      </li>
    </>
  );

  const adminLinks = (
    <>
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
      <li>
        <Link href="/admin" className={navLinkClass(isActive("/admin"))}>
          Admin Dashboard
        </Link>
      </li>
      <li>
        <Link
          href="/my-interactions"
          className={navLinkClass(isActive("/my-interactions"))}
        >
          My Interactions
        </Link>
      </li>
    </>
  );

  const handleSignOut = () => {
    logout();
  };

  const bgClass = isDarkMode
    ? "bg-[#090D16]/80 backdrop-blur-md text-white shadow-lg shadow-black/20"
    : "bg-white/80 backdrop-blur-md text-slate-900 shadow-sm";
  const borderClass = isDarkMode ? "border-white/10" : "border-[#C4E2F5]/70";
  const themeButtonClass = isDarkMode
    ? "bg-slate-800 hover:bg-slate-700"
    : "bg-slate-100 hover:bg-slate-200";

  return (
    <div
      className={`${bgClass} py-4 sticky top-0 z-50 border-b ${borderClass}`}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
          <div className="w-10 h-10 bg-linear-to-br from-[var(--brand-deep)] to-[var(--brand-mid)] rounded-lg flex items-center justify-center text-white">
            V
          </div>
          <span>IdeaVault</span>
        </Link>

        {/* Center Navigation */}
        <div className="flex-1 overflow-x-auto mx-4 hidden-scrollbar flex justify-center">
          <ul className="flex items-center gap-1 lg:gap-2 min-w-max">
            {!isAuthenticated && guestLinks}

            {isAuthenticated && role === "FOUNDER" && founderLinks}
            {isAuthenticated && role === "INVESTOR" && investorLinks}
            {isAuthenticated && role === "ADMIN" && adminLinks}
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Removed */}

          {/* User Dropdown or Auth Links */}
          {isAuthenticated && user ? (
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="transition-transform" size="sm">
                    <Avatar.Image
                      referrerPolicy="no-referrer"
                      alt={user?.name || "User"}
                      src={user?.image}
                    />
                    <Avatar.Fallback>
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
                  <span className="hidden sm:inline font-medium">
                    {user?.name}
                  </span>
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
                      <p className="text-sm leading-5 font-medium">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted">
                        {(user as User | null)?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <Dropdown.Menu aria-label="User Actions">
                  <DropdownItem
                    id="profile"
                    textValue="Profile"
                    href="/profile"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <Label>Profile</Label>
                      <MdPerson className="size-3.5 text-muted" />
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    id="logout"
                    textValue="Logout"
                    variant="danger"
                    onClick={handleSignOut}
                  >
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
                <Button
                  variant="ghost"
                  size="sm"
                  className={isDarkMode ? "text-white" : ""}
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-[var(--action-primary)] hover:bg-[var(--action-hover)] text-white"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>


    </div>
  );
};

export default Navbar;
