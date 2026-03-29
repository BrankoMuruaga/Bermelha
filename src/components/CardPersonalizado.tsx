import { Button } from "@/components/Button";

export default function CustomOrdersBanner() {
  return (
    <section className="bg-surface-container-low rounded-md py-10 px-7 sm:p-20 flex items-center justify-between gap-8 overflow-hidden relative shadow-ambient-sm">
      {/* Texto */}
      <article className="flex flex-col gap-4 z-10 text-center justify-center items-center">
        <h2 className="text-headline-md text-on-surface">
          Pedidos Personalizados
        </h2>
        <p className="text-body-md text-on-surface-variant text-pretty max-w-[95%] 2xl:max-w-[70%]">
          ¿Tienes una idea especial en mente? Desde personajes específicos hasta
          réplicas de tus mascotas, creamos el amigurumi de tus sueños con la
          mejor calidad y todo nuestro cariño.
        </p>
        <div className="flex gap-3 flex-wrap justify-center items-center">
          <Button
            variant="primary"
            label="Cotizar mi idea"
            onClick={() => (window.location.href = "/personalizado")}
          />
          <Button
            variant="secondary"
            label="Ver galería de trabajos"
            onClick={() => {
              document.getElementById("catalogo")?.scrollIntoView();
            }}
          />
        </div>
      </article>

      {/* Sparkles decorativos */}
      <img
        src="./sparkles.svg"
        alt="Sparkle"
        className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10"
      />
    </section>
  );
}
