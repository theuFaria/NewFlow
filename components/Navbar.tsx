import Link from "next/link";
import { instagramUrl } from "@/lib/site";
import CartTrigger from "@/components/cart/CartTrigger";

const links = [
  { label: "Início", href: "/#inicio" },
  { label: "Destaques", href: "/#destaques" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Loja", href: "/catalogo" },
  { label: "Localização", href: "/#loja" },
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
          <span>NEW FLOW</span> <span>MODA FITNESS</span>
        </Link>
        <ul className="nav-links">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
        <CartTrigger />
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
