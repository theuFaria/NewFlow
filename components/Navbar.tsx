import Link from "next/link";
import { instagramUrl } from "@/lib/site";

const links = [
  { label: "Início", href: "/home" },
  // { label: "Destaques", href: "/#destaques" },
  { label: "Sobre", href: "/#sobre" },
  // { label: "Inspiração", href: "/#inspiracao" },
  { label: "Loja", href: "/catalogo" },
];

export default function Navbar() {
  return (
    <nav className="site-nav" aria-label="Navegação principal">
      <div className="container nav-inner">
        <Link
          className="nav-brand"
          href="/#inicio"
          aria-label="New Flow Moda Fitness, início"
        >
          NEW FLOW<span>MODA FITNESS</span>
        </Link>
        <ul className="nav-links">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
        <a
          className="nav-contact"
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram <span aria-hidden="true">↗</span>
        </a>
      </div>
    </nav>
  );
}
