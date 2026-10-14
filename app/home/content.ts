export type Photo = { src: string; alt: string } | null;
type Piece = { name: string | null; photo: Photo };

type HomeContent = {
  hero: Photo;
  store: Photo;
  pieces: Piece[];
  looks: Photo[];
  address: string | null;
  hours: string | null;
  mapsUrl: string | null;
  mapsEmbedUrl: string | null;
  whatsappUrl: string | null;
};

// As fotos dos looks vieram do perfil público @newflowmodafitness.
// PENDENTE: inserir fotos reais da loja e confirmar os dados de visita e contato.
export const homeContent: HomeContent = {
  hero: null, // Ex.: { src: "/images/loja-hero.jpg", alt: "Interior da loja New Flow" }
  store: null, // Ex.: { src: "/images/loja.jpg", alt: "Espaço da New Flow" }
  pieces: [
    {
      name: "Macacão preto",
      photo: {
        src: "/images/look-preto.jpg",
        alt: "Modelo com macacão fitness preto e tênis branco",
      },
    },
    {
      name: "Top branco e short preto",
      photo: {
        src: "/images/look-branco.jpg",
        alt: "Modelo com top branco, short preto e tênis branco ao ar livre",
      },
    },
    {
      name: "Top e legging cinza",
      photo: {
        src: "/images/look-cinza.jpg",
        alt: "Detalhe de top e legging fitness em tom cinza",
      },
    },
  ], // Mantenha no máximo quatro peças; os nomes são descrições visuais.
  looks: [
    {
      src: "/images/look-lima.jpg",
      alt: "Look com short verde-lima, jaqueta translúcida e tênis branco",
    },
    {
      src: "/images/look-externo.jpg",
      alt: "Look com top branco, short preto e jaqueta leve em área externa",
    },
    {
      src: "/images/look-misto.jpg",
      alt: "Look com top e short cinza visto de costas",
    },
  ],
  address: "Travessa Jordão Galindo, 39 - Centro, Angra dos Reis - RJ",
  hours: "9h00 até as 18h30",
  mapsUrl: "https://maps.app.goo.gl/u8nUbYby4YEdYGXJ7",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.395275217982!2d-44.31869521373776!3d-23.009254566866048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9c4f4fb24c5349%3A0x98fb5df17173dcf2!2sNew%20Flow%20Intimidade%20e%20Fitness!5e0!3m2!1sen!2sbr!4v1791902015502!5m2!1sen!2sbr",
  whatsappUrl: null, // Link wa.me confirmado; sem ele, os contatos usam Instagram.
};
