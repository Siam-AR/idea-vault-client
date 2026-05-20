"use client";

import { useAuth } from "@/lib/auth-context";
import { Avatar, Button, Card } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProfilePage = () => {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="px-4 py-8 md:py-10 min-h-screen flex items-center justify-center">
                <p className="text-sm text-slate-600">Loading profile...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="px-4 py-8 md:py-10 min-h-screen">
            <Card className="mx-auto flex max-w-xl flex-col items-center gap-5 border p-6 md:p-8 text-center shadow-sm">
                <Avatar className="h-20 md:h-24 w-20 md:w-24">
                    <Avatar.Image
                        alt={user?.name ?? "Profile avatar"}
                        src={user?.image}
                        referrerPolicy="no-referrer"
                    />
                    <Avatar.Fallback>{user?.name?.charAt(0) ?? "U"}</Avatar.Fallback>
                </Avatar>

                <div className="space-y-1">
                    <h1 className="text-xl md:text-2xl font-bold">My Profile</h1>
                    <h2 className="text-base md:text-lg font-semibold">{user?.name ?? "Guest"}</h2>
                    <p className="text-xs md:text-sm text-slate-500">
                        {user?.email ?? "No email found"}
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Link href="/profile/update-profile">
                        <Button color="primary" size="md">Update Profile</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default ProfilePage;