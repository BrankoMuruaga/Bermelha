import React, { useState } from "react";
import { Button } from "./Button";
import { FormInput, CustomSelect } from "./FormFields";
import PROVINCIAS_OPCIONES from "../data/provincias.json";

interface NewAddressFormProps {
  setIsAddingHome: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveAddress: (addressData: {
    alias: string;
    street: string;
    number: string;
    pisoDepto: string;
    postalCode: string;
    provincia: string;
    localidad: string;
    nombreApellido: string;
    telefono: string;
  }) => void;
}

const NewAddressForm = ({
  setIsAddingHome,
  onSaveAddress,
}: NewAddressFormProps) => {
  const [nombreApellido, setNombreApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [provinciaCod, setProvinciaCod] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [pisoDepto, setPisoDepto] = useState("");
  const [newCP, setNewCP] = useState("");
  const [newAlias, setNewAlias] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const provElegida = PROVINCIAS_OPCIONES.find(
      (p) => p.value === provinciaCod,
    );

    onSaveAddress({
      alias: newAlias || `Domicilio ${newStreet} ${newNumber}`,
      street: newStreet,
      number: newNumber,
      pisoDepto,
      postalCode: newCP,
      provincia: provElegida?.label || "",
      localidad,
      nombreApellido,
      telefono,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="surface-high ghost-border p-5 rounded-md flex flex-col gap-4 w-full mt-2"
    >
      <p className="text-label-md text-on-surface-variant m-0 font-bold tracking-wide">
        DATOS PARA ENVÍO A DOMICILIO
      </p>

      {/* SECCIÓN 1: IDENTIFICACIÓN DEL DESTINATARIO */}
      <div className="flex flex-col gap-3">
        <FormInput
          required
          name="nombreApellido"
          placeholder="Nombre y Apellido de quien recibe *"
          value={nombreApellido}
          onChange={(e) => setNombreApellido(e.target.value)}
        />
        <FormInput
          required
          name="telefono"
          type="tel"
          placeholder="Teléfono de contacto *"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>

      {/* SECCIÓN 2: UBICACIÓN GEOGRÁFICA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-on-surface-variant font-medium pl-1">
            Provincia *
          </label>
          <CustomSelect
            required
            name="provincia"
            placeholder="Seleccione Provincia"
            options={PROVINCIAS_OPCIONES}
            selectedValue={provinciaCod}
            onSelect={(val) => setProvinciaCod(val)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-on-surface-variant font-medium pl-1">
            Localidad / Ciudad *
          </label>
          <FormInput
            required
            name="localidad"
            placeholder="Ej: Hurlingham"
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
          />
        </div>
      </div>

      {/* SECCIÓN 3: DIRECCIÓN FÍSICA ESPECÍFICA */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <FormInput
            required
            name="street"
            placeholder="Calle *"
            value={newStreet}
            onChange={(e) => setNewStreet(e.target.value)}
          />
        </div>
        <div>
          <FormInput
            required
            name="number"
            type="text"
            placeholder="Altura *"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <FormInput
            name="pisoDepto"
            placeholder="Piso / Depto (Opcional)"
            value={pisoDepto}
            onChange={(e) => setPisoDepto(e.target.value)}
          />
        </div>
        <div>
          <FormInput
            required
            name="cp"
            type="number"
            placeholder="CP *"
            value={newCP}
            onChange={(e) => setNewCP(e.target.value)}
          />
        </div>
      </div>

      <FormInput
        name="alias"
        placeholder="Alias de la dirección (Ej: Mi Casa, Trabajo) - Opcional"
        value={newAlias}
        onChange={(e) => setNewAlias(e.target.value)}
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
          onClick={() => setIsAddingHome(false)}
          className="flex-1 justify-center"
        />
      </div>
    </form>
  );
};

export default NewAddressForm;
