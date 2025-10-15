"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Cat } from "@/components/Nav";

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const base = "relative px-1 py-2 text-gray-700 hover:text-gray-900 dark:text-slate-200 dark:hover:text-white transition-colors focus:outline-none focus-visible:text-sky-600";
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={base}>
      <span className={`relative group inline-block ${active ? "font-medium" : ""}`}>
        {label}
        <span
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-[2px] bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 transition-all duration-300 ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </span>
    </Link>
  );
}

export default function NavClient({ cats }: { cats: Cat[] }) {
  const pathname = usePathname() || "/";
  const first = pathname.split("/")[1] || "";

  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-4 lg:gap-6 text-sm">
        <li className="relative">
          <NavLink href="/" label="Home" active={pathname === "/"} />
        </li>
        {cats.map((c) => (
          <li key={c.id} className="relative">
            <NavLink href={`/${c.slug}`} label={c.name} active={first === c.slug} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

