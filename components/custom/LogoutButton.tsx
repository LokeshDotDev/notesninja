"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (!session) {
    return null;
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
    >
      Sign Out
    </button>
  );
}
