import { Button } from "@/components/Button";

const PageNotFound = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] gap-8 w-full px-6 text-center">
      <div className="flex flex-col gap-3 max-w-md">
        <h1 className="text-6xl font-bold text-primary m-0">404</h1>
        <h2 className="text-headline-md text-on-surface m-0">
          ¡Ups! Se nos enredó la lana
        </h2>
        <p className="text-body-lg text-on-surface-variant m-0">
          La página que estás buscando no existe, cambió de lugar o todavía está
          en pleno proceso de tejido.
        </p>
      </div>

      <div className="surface-high ghost-border p-6 rounded-md flex flex-col items-center gap-5 mt-2 max-w-sm w-full">
        <p className="text-body-md text-on-surface font-semibold m-0">
          ¿Te perdiste buscando algún muñeco en especial?
        </p>
        <Button
          variant="primary"
          onClick={() => (window.location.href = "/")}
          className="w-full justify-center"
        >
          Volver al inicio
        </Button>
      </div>
    </section>
  );
};

export default PageNotFound;
