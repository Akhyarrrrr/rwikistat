"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBookOpen, FaComments, FaTerminal, FaUser, FaUsers } from "react-icons/fa6";
import { IoIdCardOutline, IoLogOutOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { RiRobot2Line } from "react-icons/ri";
import { UserAuth } from "@/app/context/authContext";
import { closeSidebar } from "@/components/utils";

const navItems = [
  { href: "/compiler", label: "R Compiler", icon: <FaTerminal /> },
  { href: "/modul", label: "Modul", icon: <FaBookOpen /> },
  { href: "/forum", label: "Forum", icon: <FaComments /> },
  { href: "/chatbot", label: "Chatbot", icon: <RiRobot2Line /> },
  { href: "/userId", label: "User ID", icon: <IoIdCardOutline /> },
  { href: "/profile", label: "Profile", icon: <FaUser /> },
];

export default function Sidebar() {
  const { user, userData, logOut } = UserAuth();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    user
      .getIdTokenResult()
      .then((idTokenResult) => setIsAdmin(Boolean(idTokenResult.claims?.admin || userData?.role === "admin")))
      .catch(() => setIsAdmin(userData?.role === "admin"));
  }, [user, userData?.role]);

  const items = isAdmin
    ? [...navItems, { href: "/verified", label: "Manage User", icon: <FaUsers /> }]
    : navItems;

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <aside className="Sidebar fixed inset-y-0 left-0 z-[10000] flex w-[280px] flex-col border-r border-white/80 bg-white/95 p-4 shadow-2xl shadow-ink-950/10 backdrop-blur-xl transition-transform duration-300 md:sticky md:top-0 md:h-[100dvh] md:shadow-none">
        <style>{`:root { --Sidebar-width: 280px; } .Sidebar { transform: translateX(calc(-100% + (var(--SideNavigation-slideIn, 0) * 100%))); } .Sidebar-overlay { transform: translateX(calc(-100% + (var(--SideNavigation-slideIn, 0) * 100%))); } @media (min-width: 768px) { .Sidebar { transform: none; } .Sidebar-overlay { transform: translateX(-100%); } }`}</style>

        <Link href="/compiler" onClick={closeSidebar} className="flex items-center rounded-2xl bg-white p-2 ring-1 ring-ink-100">
          <Image src="/logo-horizontal.png" alt="RWikiStat" width={150} height={46} priority />
        </Link>

        <nav className="mt-7 grid gap-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-brand-700 text-white shadow-lg shadow-brand-900/15"
                    : "text-ink-600 hover:bg-brand-50 hover:text-brand-800"
                }`}
              >
                <span
                  className={`inline-flex size-10 items-center justify-center rounded-xl transition-colors ${
                    active ? "bg-white/15 text-white" : "bg-white text-brand-700 ring-1 ring-ink-100 group-hover:ring-brand-100"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-ink-200 bg-white p-3 shadow-sm">
          {!user ? null : (
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <Image src={user.photoURL} alt="Foto profil" width={42} height={42} className="size-11 rounded-xl object-cover" />
              ) : (
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700">
                  {(user.displayName || user.email || "U").slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="truncate text-sm font-semibold text-ink-950">{user.displayName || "Pengguna"}</p>
                  {userData?.verified ? <MdVerified size={16} className="shrink-0 text-brand-600" /> : null}
                </div>
                <p className="truncate text-xs text-ink-500">{userData?.email || user.email}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex size-10 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label="Keluar"
              >
                <IoLogOutOutline size={22} />
              </button>
            </div>
          )}
        </div>
      </aside>

      <button
        className="Sidebar-overlay fixed inset-0 z-[9998] block bg-ink-950/35 opacity-[var(--SideNavigation-slideIn,0)] backdrop-blur-sm transition-all duration-300 md:hidden"
        onClick={closeSidebar}
        aria-label="Tutup sidebar"
      />
    </>
  );
}
