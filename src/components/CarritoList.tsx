import CarritoItem from "./CarritoItem";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagenPrincipal: string;
  centimetros: number;
  quantity: number;
}

const CarritoList = ({ productos }: { productos: Producto[] }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <ul className="w-full bg-surface-container-lowest rounded-md px-6 shadow-ambient-sm">
        {productos.map((producto) => (
          <CarritoItem key={producto.id} producto={producto} />
        ))}
      </ul>
    </div>
  );
};

export default CarritoList;
