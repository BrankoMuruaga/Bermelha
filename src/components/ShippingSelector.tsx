import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/Button";
import { MapPin, Store } from "lucide-react";
import ShippingSection from "@/components/ShippingSection";
import AddressCard from "./AddressCard";
import NewAddressForm from "./NewAddressForm";
import ShippingModal from "./ShippingModal";
import { NewBranchForm, type BranchAddressData } from "./NewBranchForm";

export interface BaseAddress {
  id: string;
  alias: string;
  postalCode: string;
  nombreApellido: string;
  telefono: string;
  email: string;
  deliveryType: "D" | "S";
  provincia: string;
  localidad: string;
}

export interface HomeAddress extends BaseAddress {
  deliveryType: "D";
  pisoDepto?: string;
  street: string;
  number: string;
}

export interface BranchAddress extends BaseAddress {
  deliveryType: "S";
  sucursalNombre: string;
  codSucursal: string;
}

export type Address = HomeAddress | BranchAddress;

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
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const homeAddresses = addresses.filter(
    (a): a is HomeAddress => a.deliveryType === "D",
  );
  const branchAddresses = addresses.filter(
    (a): a is BranchAddress => a.deliveryType === "S",
  );
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
        const response = await fetch("/api/envio/correoargentino/costo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cp: selected.postalCode,
            type: selected.deliveryType,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error al cotizar el envío: ${response.statusText}`);
        }

        const data = await response.json();
        onShippingCalculated(data.cost, selected);
      } catch (err) {
        console.error(err);
        setError("" + err);
        onShippingCalculated(0, null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, [selectedId, addresses]);

  const generateId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleAddHomeAddress = (homeData: {
    alias: string;
    street: string;
    number: string;
    pisoDepto: string;
    postalCode: string;
    provincia: string;
    localidad: string;
    nombreApellido: string;
    telefono: string;
  }) => {
    const newAddress: HomeAddress = {
      id: generateId(),
      deliveryType: "D",
      email: "",
      ...homeData,
    };

    setAddresses([...addresses, newAddress]);
    setSelectedId(newAddress.id);
    setIsAddingHome(false);
  };

  const handleAddBranchAddress = (branchData: BranchAddressData) => {
    const newAddress: BranchAddress = {
      id: generateId(),
      alias: branchData.alias,
      postalCode: branchData.postalCode,
      deliveryType: "S",
      nombreApellido: branchData.nombreApellido,
      telefono: branchData.telefono,
      email: branchData.email,
      provincia: branchData.provincia,
      localidad: branchData.localidad,
      sucursalNombre: branchData.sucursalNombre,
      codSucursal: branchData.codSucursal,
    };

    setAddresses([...addresses, newAddress]);
    setSelectedId(newAddress.id);
    setIsAddingBranch(false);
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
    <div className="w-full flex flex-col justify-between items-center">
      {selectedAddress ? (
        <div className="w-full py-2 rounded-md flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-label-xl sm:text-label-md text-primary font-bold">
              {selectedAddress.alias}
            </p>
            <p className="text-body-md sm:text-body-sm text-on-surface-variant m-0">
              {selectedAddress.deliveryType === "D"
                ? `A Domicilio: ${(selectedAddress as HomeAddress).street} ${(selectedAddress as HomeAddress).number}`
                : `Retiro: ${(selectedAddress as BranchAddress).sucursalNombre}`}{" "}
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

      <ShippingModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setIsAddingHome(false);
          setIsAddingBranch(false);
        }}
        title="Método de entrega"
      >
        {/* SECCIÓN 1: A DOMICILIO */}
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
              onClick={() => {
                setIsAddingHome(true);
                setIsAddingBranch(false);
              }}
              className="w-full justify-center ghost-border border-dashed"
            />
          ) : (
            <NewAddressForm
              onSaveAddress={handleAddHomeAddress}
              setIsAddingHome={setIsAddingHome}
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
                  street={addr.sucursalNombre}
                  number=""
                  postalCode={addr.postalCode}
                  selectedId={selectedId}
                  handleSelectAndClose={handleSelectAndClose}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {!isAddingBranch ? (
            <Button
              variant="secondary"
              label="+ Agregar nueva sucursal"
              onClick={() => {
                setIsAddingBranch(true);
                setIsAddingHome(false);
              }}
              className="w-full justify-center ghost-border border-dashed"
            />
          ) : (
            <NewBranchForm
              onSaveBranchAddress={handleAddBranchAddress}
              setIsAddingBranch={setIsAddingBranch}
            />
          )}
        </ShippingSection>
      </ShippingModal>
    </div>
  );
};
