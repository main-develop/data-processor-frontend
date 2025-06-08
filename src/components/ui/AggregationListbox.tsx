import { Field, Label } from "@headlessui/react";
import CustomListbox from "./CustomListbox";

interface AggregationListboxProperties {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  error?: string;
}

export default function AggregationListbox({
  label,
  value,
  options,
  onChange,
  error,
}: AggregationListboxProperties) {
  return (
    <div>
      <Field>
        <Label className="block text-white/90 opacity-60 mb-2 select-none">
          {label}
        </Label>
      </Field>
      <CustomListbox
        value={value}
        options={options}
        onChange={onChange}
      ></CustomListbox>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
