import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/Button";
import { MapPin, Store } from "lucide-react";
import ShippingSection from "@/components/ShippingSection";
import AddressCard from "./AddressCard";
import NewAddressForm from "./NewAddressForm";
import ShippingModal from "./ShippingModal"; // <-- IMPORT DEL MODAL

export interface Address {
  id: string;
  alias: string;
  postalCode: string;
  street: string;
  number: string;
  deliveryType: "D" | "S";
}

interface ShippingSelectorProps {
  onShippingCalculated: (cost: number, address: Address | null) => void;
}

export const ShippingSelector = ({
  onShippingCalculated,
}: ShippingSelectorProps) => {
  const [addresses, setAddresses] = useLocalStorage<Address[]>(
    "bermelha_addresses",
    [],
  );

  const [selectedId, setSelectedId] = useLocalStorage<string | null>(
    "bermelha_selected_address",
    null,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isAddingHome, setIsAddingHome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newAlias, setNewAlias] = useState("");
  const [newCP, setNewCP] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const homeAddresses = addresses.filter((a) => a.deliveryType === "D");
  const branchAddresses = addresses.filter((a) => a.deliveryType === "S");
  const selectedAddress = addresses.find((a) => a.id === selectedId);

  useEffect(() => {
    const fetchRate = async () => {
      const selected = addresses.find((a) => a.id === selectedId);
      if (!selected) {
        onShippingCalculated(0, null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const simulatedCost = selected.deliveryType === "D" ? 5500 : 3500;
        onShippingCalculated(simulatedCost, selected);
      } catch (err) {
        setError("Error al cotizar el envío. Verificá tu código postal.");
        onShippingCalculated(0, null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, [selectedId, addresses]);

  const handleAddHomeAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const generateId = () => {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };
    try {
      const newAddress: Address = {
        id: generateId(),
        alias: newAlias,
        postalCode: newCP,
        street: newStreet,
        number: newNumber,
        deliveryType: "D",
      };
      setAddresses([...addresses, newAddress]);
      setSelectedId(newAddress.id);
      setIsAddingHome(false);
      setNewAlias("");
      setNewCP("");
      setNewStreet("");
      setNewNumber("");
    } catch (error) {
      alert(error);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = addresses.filter((a) => a.id !== id);
    setAddresses(filtered);
    if (selectedId === id) {
      setSelectedId(null);
      onShippingCalculated(0, null);
    }
  };

  const handleSelectAndClose = (id: string) => {
    setSelectedId(id);
    setIsOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-2 mb-4">
      {selectedAddress ? (
        <div className="w-full py-2 rounded-md flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-label-xl sm:text-label-md text-primary font-bold">
              {selectedAddress.alias}
            </p>
            <p className="text-body-md sm:text-body-sm text-on-surface-variant m-0">
              {selectedAddress.deliveryType === "D"
                ? "A Domicilio"
                : "Retiro Sucursal"}{" "}
              • CP: {selectedAddress.postalCode}
            </p>
          </div>
          <Button
            variant="secondary"
            label="Cambiar"
            onClick={() => setIsOpen(true)}
          />
        </div>
      ) : (
        <Button
          variant="secondary"
          label="Seleccionar método de envío"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center border-primary text-primary"
        />
      )}

      {isLoading && (
        <p className="text-body-sm text-primary animate-pulse text-center mt-2">
          Cotizando envío con Correo Argentino...
        </p>
      )}
      {error && (
        <p className="text-body-sm text-red-500 text-center">{error}</p>
      )}

      {/* MODAL DE SELECCIÓN DE ENVÍO */}

      <ShippingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Método de entrega"
      >
        <ShippingSection
          title="A DOMICILIO"
          icon={<MapPin size={20} className="text-primary" />}
        >
          {homeAddresses.length > 0 && (
            <div className="flex flex-col gap-3">
              {homeAddresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  id={addr.id}
                  alias={addr.alias}
                  street={addr.street}
                  number={addr.number}
                  postalCode={addr.postalCode}
                  selectedId={selectedId}
                  handleSelectAndClose={handleSelectAndClose}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {!isAddingHome ? (
            <Button
              variant="secondary"
              label="+ Agregar nuevo domicilio"
              onClick={() => setIsAddingHome(true)}
              className="w-full justify-center ghost-border border-dashed"
            />
          ) : (
            <NewAddressForm
              handleAddHomeAddress={handleAddHomeAddress}
              setIsAddingHome={setIsAddingHome}
              newAlias={newAlias}
              setNewAlias={setNewAlias}
              newCP={newCP}
              setNewCP={setNewCP}
              newStreet={newStreet}
              setNewStreet={setNewStreet}
              newNumber={newNumber}
              setNewNumber={setNewNumber}
            />
          )}
        </ShippingSection>

        {/* SECCIÓN 2: A SUCURSAL */}
        <ShippingSection
          title="A SUCURSAL"
          icon={<Store size={20} className="text-primary" />}
        >
          {branchAddresses.length > 0 && (
            <div className="flex flex-col gap-3">
              {branchAddresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  id={addr.id}
                  alias={addr.alias}
                  street={addr.street}
                  number={addr.number}
                  postalCode={addr.postalCode}
                  selectedId={selectedId}
                  handleSelectAndClose={handleSelectAndClose}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <Button
            variant="secondary"
            label="+ Agregar nueva sucursal"
            onClick={() =>
              alert("La búsqueda de sucursales estará disponible pronto.")
            }
            className="w-full justify-center ghost-border border-dashed"
          />
        </ShippingSection>
      </ShippingModal>
    </div>
  );
};
