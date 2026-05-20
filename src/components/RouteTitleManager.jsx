"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const BASE_TITLE = "IdeaVault";

const ROUTE_TITLES = {
  "/": "Home",
  "/ideas": "Ideas",
  "/add-idea": "Add Idea",
  "/my-ideas": "My Ideas",
  "/my-interactions": "My Interactions",
  "/login": "Login",
  "/register": "Register",
  "/profile": "My Profile",
  "/profile/update-profile": "Update Profile",
};

const normalizeSegment = (segment) =>
  segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getTitleFromPath = (pathname) => {
  if (ROUTE_TITLES[pathname]) {
    return ROUTE_TITLES[pathname];
  }

  if (pathname.startsWith("/ideas/")) {
    return "Idea Details";
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
