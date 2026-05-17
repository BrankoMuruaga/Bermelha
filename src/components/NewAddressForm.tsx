import React from "react";
import { Button } from "./Button";

interface NewAddressFormProps {
  handleAddHomeAddress: (e: React.FormEvent) => void;
  newAlias: string;
  setNewAlias: React.Dispatch<React.SetStateAction<string>>;
  newStreet: string;
  setNewStreet: React.Dispatch<React.SetStateAction<string>>;
  newNumber: string;
  setNewNumber: React.Dispatch<React.SetStateAction<string>>;
  newCP: string;
  setNewCP: React.Dispatch<React.SetStateAction<string>>;
  setIsAddingHome: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewAddressForm = ({
  handleAddHomeAddress,
  newAlias,
  setNewAlias,
  newStreet,
  setNewStreet,
  newNumber,
  setNewNumber,
  newCP,
  setNewCP,
  setIsAddingHome,
}: NewAddressFormProps) => {
  return (
    <form
      onSubmit={handleAddHomeAddress}
      className="surface-high ghost-border p-5 rounded-md flex flex-col gap-4 w-full mt-2"
    >
      <p className="text-label-md text-on-surface-variant m-0">
        NUEVA DIRECCIÓN
      </p>
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder="Alias (Ej: Casa, Trabajo)"
          value={newAlias}
          onChange={(e) => setNewAlias(e.target.value)}
          className="col-span-2 p-3 bg-surface-container-lowest rounded-md text-body-md ghost-border focus:ring-2 focus:ring-primary/30 outline-none transition-smooth"
        />
        <input
          required
          placeholder="Calle"
          value={newStreet}
          onChange={(e) => setNewStreet(e.target.value)}
          className="col-span-2 p-3 bg-surface-container-lowest rounded-md text-body-md ghost-border focus:ring-2 focus:ring-primary/30 outline-none transition-smooth"
        />
        <input
          required
          type="number"
          placeholder="Altura"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          className="col-span-1 p-3 bg-surface-container-lowest rounded-md text-body-md ghost-border focus:ring-2 focus:ring-primary/30 outline-none transition-smooth"
        />
        <input
          required
          type="number"
          placeholder="Código Postal"
          value={newCP}
          onChange={(e) => setNewCP(e.target.value)}
          className="col-span-1 p-3 bg-surface-container-lowest rounded-md text-body-md ghost-border focus:ring-2 focus:ring-primary/30 outline-none transition-smooth"
        />
      </div>
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
