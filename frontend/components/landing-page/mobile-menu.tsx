"use client";

import { useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { IoClose, IoMenu } from "react-icons/io5";

const navItems = [
  { href: "#fitur", label: "Fitur" },
  { href: "#modul", label: "Modul" },
  { href: "#download", label: "Mobile" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!open || !menu.current || !trigger.current) return;
      if (menu.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [open]);

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (open && key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [open]);

  return (
    <div className="flex md:hidden" ref={menu}>
      <button
        ref={trigger}
        className="inline-flex size-11 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-900 transition-colors hover:border-brand-200 hover:text-brand-700"
        aria-controls="mobile-nav"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">Menu</span>
        {open ? <IoClose size={22} /> : <IoMenu size={22} />}
      </button>

      <Transition
        show={open}
        as="nav"
        id="mobile-nav"
        className="absolute left-4 right-4 top-[4.75rem] rounded-2xl border border-ink-200 bg-white p-3 shadow-xl shadow-ink-900/10"
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-out duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 -translate-y-2"
      >
        <div className="grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-3 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/signin" className="btn-primary mt-2 w-full" onClick={() => setOpen(false)}>
            Belajar Sekarang
          </Link>
        </div>
      </Transition>
    </div>
  );
}
