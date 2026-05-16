import { mailContact, footer } from "@/data/config"; // Agrupé las importaciones

export default function Footer() {
  const { subtitulo, secciones } = footer;
  const { comprar, ayuda, redes } = secciones; // Extraje 'redes' para que el código quede más limpio abajo

  return (
    <footer className="bg-surface-container-lowest rounded-t-md ghost-border border-t mt-16">
      <div className="mx-auto px-10 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Contacto */}
        <div className="flex flex-col gap-4">
          <img src="./Bermelha-logo.svg" alt="Bermelha" className="w-28" />
          <p className="text-body-md text-on-surface-variant">{subtitulo}</p>

          {/* Email de contacto agregado acá */}
          <div className="mt-2">
            <p className="text-label-md text-primary mb-1">CONTACTO</p>
            <a
              href={`mailto:${mailContact}`}
              className="text-body-md text-on-surface hover:text-primary transition-smooth"
            >
              {mailContact}
            </a>
          </div>
        </div>

        {/* Comprar */}
        <div className="flex flex-col gap-3">
          <p className="text-label-md text-primary">COMPRAR</p>
          {comprar.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="text-body-md text-on-surface-variant hover:text-primary transition-smooth"
            >
              {item.title}
            </a>
          ))}
        </div>

        {/* Ayuda */}
        <div className="flex flex-col gap-3">
          <p className="text-label-md text-primary">AYUDA</p>
          {ayuda.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="text-body-md text-on-surface-variant hover:text-primary transition-smooth"
            >
              {item.title}
            </a>
          ))}
        </div>

        {/* Redes */}
        <div className="flex flex-col gap-3">
          <p className="text-label-md text-primary">SÍGUENOS</p>
          {redes.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-md text-on-surface-variant hover:text-primary transition-smooth"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t ghost-border py-4 text-center">
        <p className="text-body-sm text-on-surface-variant">
          © {new Date().getFullYear()} Bermelha.
        </p>
      </div>
    </footer>
  );
}
