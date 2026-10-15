import Image from "next/image";
import { instagramUrl } from "@/lib/site";
import { conteudoHome as content, type Photo } from "./content";
import "./home.css";

const contact = content.whatsappUrl ?? instagramUrl;
const contactLabel = content.whatsappUrl
  ? "Consultar disponibilidade no WhatsApp"
  : "Consultar disponibilidade no Instagram";

function PhotoSlot({
  photo,
  label,
  className = "",
}: {
  photo: Photo;
  label: string;
  className?: string;
}) {
  return (
    <div className={`photo-slot ${className}${photo ? "" : " is-pending"}`}>
      {photo ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw"
        />
      ) : (
        <div
          className="photo-pending"
          role="img"
          aria-label={`${label}: foto pendente`}
        >
          <span className="pending-line" aria-hidden="true" />
          <span>IMAGEM PENDENTE</span>
          <small>{label}</small>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="home-page" id="inicio">
      <section className="hero" aria-labelledby="hero-title">
        <div
          className={`hero-media${content.hero ? "" : " is-pending"}`}
          style={
            content.hero
              ? { backgroundImage: `url('${content.hero.src}')` }
              : undefined
          }
          role="img"
          aria-label={content.hero?.alt ?? "Foto da loja New Flow pendente"}
        >
          {!content.hero && (
            <div className="hero-photo-note" aria-hidden="true">
              <span>NEW FLOW / 01</span>
              <p>Um espaço para a foto da sua loja.</p>
              <small>Imagem real pendente</small>
            </div>
          )}
        </div>
        <div className="hero-inner container">
          <div className="hero-card">
            <span className="eyebrow">
              <span className="eyebrow-rule" /> NEW FLOW MODA FITNESS
            </span>
            <h1 id="hero-title">
              <em>
                Conforto
                <br />
                Qualidade
                <br />
                Estilo
                <br />
              </em>
              No seu dia a dia
            </h1>
            <p>
              Conheça a New Flow e encontre moda fitness para acompanhar sua
              rotina.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#destaques">
                Conhecer a coleção <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button button-outline"
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver no Instagram <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <span className="hero-side-note" aria-hidden="true">
            MODA QUE ACOMPANHA VOCÊ
          </span>
        </div>
      </section>

      <section
        className="section"
        id="destaques"
        aria-labelledby="featured-title"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">01 / DESCUBRA</span>
              <h2 id="featured-title">
                Peças em <em>destaque.</em>
              </h2>
            </div>
            <p>
              Trabalhamos apenas <br /> com a mais alta qualidade.
            </p>
          </div>
          <div className="roupas-grid">
            {content.roupas.slice(0, 4).map((roupa, index) => (
              <article className="roupa-card" key={index}>
                <PhotoSlot
                  photo={roupa.photo}
                  label={`Foto da peça ${String(index + 1).padStart(2, "0")}`}
                  className="roupa-photo"
                />
                <div className="roupa-meta">
                  <div>
                    <span className="roupa-number">
                      DESTAQUE / {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{roupa.name ?? "Nome da peça a confirmar"}</h3>
                  </div>
                  <a
                    href={contact}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${contactLabel} — ${roupa.name ?? `peça ${index + 1}`}`}
                    className="roupa-link"
                  >
                    ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
          <a
            className="text-link"
            href={contact}
            target="_blank"
            rel="noopener noreferrer"
          >
            {contactLabel} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section
        className="section section-about"
        id="sobre"
        aria-labelledby="about-title"
      >
        <div className="container about-grid">
          <PhotoSlot
            photo={content.store}
            label="Foto da loja"
            className="about-photo"
          />
          <div className="about-copy">
            <span className="section-kicker">02 / NOSSA HISTÓRIA</span>
            <h2 id="about-title">
              Conheça a<br />
              <em>New Flow.</em>
            </h2>
            <p>
              Moda fitness para acompanhar você nos movimentos do dia a dia.
              Conheça nosso espaço e encontre peças que conversam com o seu
              estilo.
            </p>
            <a
              className="text-link"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Acompanhe a New Flow <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="section section-visit"
        id="loja"
        aria-labelledby="visit-title"
      >
        <div className="container visit-grid">
          <div>
            <span className="section-kicker">04 / VENHA NOS CONHECER</span>
            <h2 id="visit-title">
              Visite nossa <em>loja.</em>
            </h2>
            <p>
              Quer saber mais sobre as peças ou planejar uma visita? Fale com a
              New Flow.
            </p>
            <div className="visit-actions">
              {content.mapsUrl && (
                <a
                  className="text-link"
                  href={content.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver localização <span aria-hidden="true">↗</span>
                </a>
              )}
              <a
                className="button button-primary"
                href={contact}
                target="_blank"
                rel="noopener noreferrer"
              >
                Entrar em contato <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="visit-details">
            <div>
              <span>HORÁRIO DE FUNCIONAMENTO</span>
              <p>{content.hours ?? "Horário a confirmar com a loja"}</p>
            </div>
            <div>
              <span>ENDEREÇO</span>
              <p>{content.endereco ?? "Endereço a confirmar com a loja"}</p>
            </div>
          </div>

          {content.mapsEmbedUrl && (
            <iframe
              className="visit-map"
              src={content.mapsEmbedUrl}
              title="Mapa da localização da loja New Flow"
              width="600"
              height="450"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>
      </section>
    </div>
  );
}
