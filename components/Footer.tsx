import Container from "./Container";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-slate-800 py-8 text-sm">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-600 dark:text-slate-400">© {year} ACTU Dubai. All rights reserved.</p>
          <nav className="flex flex-wrap items-center gap-4 text-gray-700 dark:text-slate-300">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}

