import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { FormInput, CustomSelect } from "./FormFields";
import sucursalesData from "@/data/sucursalesCA.json";
import PROVINCIAS_OPCIONES from "@/data/provincias.json";

export interface BranchAddressData {
  alias: string;
  deliveryType: "S";
  postalCode: string;
  nombreApellido: string;
  email: string;
  telefono: string;
  provincia: string;
  localidad: string;
  sucursalNombre: string;
  codSucursal: string;
}

interface NewBranchFormProps {
  onSaveBranchAddress: (addressData: BranchAddressData) => void;
  setIsAddingBranch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NewBranchForm = ({
  onSaveBranchAddress,
  setIsAddingBranch,
}: NewBranchFormProps) => {
  const [nombreApellido, setNombreApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [alias, setAlias] = useState("");

  const [codProv, setCodProv] = useState("");
  const [sucursalesOpciones, setSucursalesOpciones] = useState<any[]>([]);
  const [selectedSucId, setSelectedSucId] = useState("");

  const [localidad, setLocalidad] = useState("");
  const [cp, setCp] = useState("");

  useEffect(() => {
    setSelectedSucId("");
    setLocalidad("");
    setCp("");

    if (codProv && (sucursalesData as any)[codProv]) {
      const provinciaObj = (sucursalesData as any)[codProv];
      const listaSucursales = provinciaObj.datos?.sucursales || [];

      const opt = listaSucursales.map((suc: any) => ({
        value: suc.codigoSucursal || "",
        label: suc.descripcion || "Sin descripción",
        localidad: suc.nombreProvincia || "",
        cp: suc.cp || "Sin CP",
      }));

      setSucursalesOpciones(opt);
    } else {
      setSucursalesOpciones([]);
    }
  }, [codProv]);

  const handleSelectSucursal = (codSuc: string) => {
    setSelectedSucId(codSuc);
    const sucElegida = sucursalesOpciones.find((s) => s.value === codSuc);
    if (sucElegida) {
      setLocalidad(sucElegida.localidad);
      setCp(sucElegida.cp);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sucElegida = sucursalesOpciones.find(
      (s) => s.value === selectedSucId,
    );
    const provElegida = PROVINCIAS_OPCIONES.find((p) => p.value === codProv);

    const newBranchAddress: BranchAddressData = {
      alias: alias || `Sucursal Correo - ${sucElegida?.label || ""}`,
      deliveryType: "S",
      postalCode: cp,
      nombreApellido,
      email: "",
      telefono,
      provincia: provElegida?.label || "",
      localidad: localidad,
      sucursalNombre: sucElegida ? sucElegida.label : "",
      codSucursal: selectedSucId,
    };

    onSaveBranchAddress(newBranchAddress);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="surface-high ghost-border p-5 rounded-md flex flex-col gap-4 w-full mt-2"
    >
      <p className="text-label-md text-on-surface-variant m-0 font-bold tracking-wide">
        NUEVA RETIRO EN SUCURSAL
      </p>

      {/* SECCIÓN 1: DATOS REQUERIDOS DESTINATARIO */}
      <div className="flex flex-col gap-3">
        <FormInput
          required
          name="nombreApellido"
          placeholder="Nombre y Apellido de quien retira *"
          value={nombreApellido}
          onChange={(e) => setNombreApellido(e.target.value)}
        />
        <FormInput
          required
          name="telefono"
          type="tel"
          placeholder="Teléfono *"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-on-surface-variant font-medium pl-1">
            Provincia
          </label>
          <CustomSelect
            required
            name="provincia"
            placeholder="Seleccione Provincia *"
            options={PROVINCIAS_OPCIONES}
            selectedValue={codProv}
            onSelect={(val) => setCodProv(val)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-on-surface-variant font-medium pl-1">
            Sucursal Correo Argentino
          </label>
          <CustomSelect
            required
            name="sucursal"
            placeholder="Busque sucursal por nombre o dirección *"
            options={sucursalesOpciones}
            selectedValue={selectedSucId}
            onSelect={handleSelectSucursal}
            disabled={!codProv}
          />
        </div>
      </div>

      {selectedSucId && (
        <div className="grid grid-cols-3 gap-3 bg-surface-variant/30 p-3 rounded-md animate-fadeIn">
          <div className="col-span-2">
            <p className="text-[11px] text-on-surface-variant m-0 font-semibold">
              LOCALIDAD DESTINO
            </p>
            <p className="text-body-md m-0 text-on-surface">{localidad}</p>
          </div>
          <div>
            <p className="text-[11px] text-on-surface-variant m-0 font-semibold">
              CP
            </p>
            <p className="text-body-md m-0 text-on-surface">{cp}</p>
          </div>
        </div>
      )}

      <FormInput
        placeholder="Alias (Ej: Correo cerca de la oficina) - Opcional"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
      />

      {/* ACCIONES */}
      <div className="flex gap-3 mt-2">
        <Button
          variant="primary"
          label="Guardar"
          type="submit"
          className="flex-1 justify-center"
        />
        <Button
          variant="secondary"
          label="Cancelar"
          onClick={() => setIsAddingBranch(false)}
          className="flex-1 justify-center"
        />
      </div>
    </form>
  );
};
