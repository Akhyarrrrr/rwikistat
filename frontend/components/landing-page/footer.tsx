import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const socials = [
  { label: "Facebook", icon: <FaFacebookF size={16} /> },
  { label: "LinkedIn", icon: <FaLinkedinIn size={16} /> },
  { label: "YouTube", icon: <FaYoutube size={17} /> },
  { label: "Instagram", icon: <FaInstagram size={17} /> },
];

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-6 border-t border-ink-200 pt-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="w-fit rounded-xl bg-white p-1 ring-1 ring-ink-100">
            <Image src="/logo-horizontal.png" alt="RWikiStat" width={136} height={42} />
          </Link>

          <div className="flex items-center gap-3">
            {socials.map((item) => (
              <a
                key={item.label}
                href="#"
                aria-label={item.label}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-ink-200 text-ink-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-6 text-sm text-ink-500">Copyright &copy; 2024 RWikiStat. All rights reserved.</p>
      </div>
    </footer>
  );
}
