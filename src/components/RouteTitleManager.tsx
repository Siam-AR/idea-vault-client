"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import React from "react";

const BASE_TITLE = "Community Spark";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Home",
  "/ideas": "Projects",
  "/about": "About",
  "/contact": "Contact",
  "/resources": "Resources",
  "/add-idea": "Add Project",
  "/my-ideas": "My Projects",
  "/my-interactions": "My Contributions",
  "/login": "Login",
  "/register": "Register",
  "/profile": "My Profile",
  "/profile/update-profile": "Update Profile",
};

const normalizeSegment = (segment: string) =>
  segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getTitleFromPath = (pathname: string) => {
  if (ROUTE_TITLES[pathname]) {
    return ROUTE_TITLES[pathname];
  }

  if (pathname.startsWith("/ideas/")) {
    return "Project Details";
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return ROUTE_TITLES["/"];
  }

  return normalizeSegment(segments[segments.length - 1]);
};

export default function RouteTitleManager() {
  const pathname = usePathname();

  useEffect(() => {
    const pageTitle = getTitleFromPath(pathname);
    document.title = `${pageTitle} | ${BASE_TITLE}`;
  }, [pathname]);

  return null;
}
