import Link from "next/link";
import { instagramUrl } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link
          className="footer-brand"
          href="/#inicio"
          aria-label="New Flow, voltar ao início"
        >
          NEW FLOW<span>MODA FITNESS</span>
        </Link>
        <span>Movimento e estilo, do seu jeito.</span>
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
          Instagram ↗
        </a>
      </div>
    </footer>
  );
}
