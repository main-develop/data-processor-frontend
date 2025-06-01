import { AnimatePresence, motion } from "framer-motion";
import {
  Field,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Checkbox,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { processingTypes } from "./App";
import clsx from "clsx";

interface ProcessingOptionsProperties {
  processingType: string;
  setProcessingType: React.Dispatch<React.SetStateAction<string>>;
  errors: {
    file?: string;
    processingType?: string;
    condition?: string;
    submission?: string;
    graph?: string;
  };
  setErrors: React.Dispatch<
    React.SetStateAction<{
      file?: string;
      processingType?: string;
      condition?: string;
      submission?: string;
      graph?: string;
    }>
  >;
  condition: string;
  setCondition: React.Dispatch<React.SetStateAction<string>>;
  isSampleData: boolean;
  setIsSampleData: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProcessingOptions({
  processingType,
  setProcessingType,
  errors,
  setErrors,
  condition,
  setCondition,
  isSampleData,
  setIsSampleData,
}: ProcessingOptionsProperties) {
  return (
    <div className="relative">
      <div className="section-gradient-shadow"></div>
      <section className="mb-28 p-6 rounded-xl shadow-md glassmorphism">
        <h2 className="text-xl font-semibold mb-4">Processing Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field className={"mx-auto w-full"}>
            <Label
              className={"block text-gray-100 opacity-60 mb-2 select-none"}
            >
              Processing type
            </Label>
            <Listbox value={processingType} onChange={setProcessingType}>
              {({ open }) => (
                <div className="relative">
                  <ListboxButton className="block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white/90 outline-none">
                    {processingType}
                    <ChevronDownIcon
                      className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/80"
                      aria-hidden="true"
                    />
                  </ListboxButton>
                  <AnimatePresence>
                    {open && (
                      <ListboxOptions
                        modal={false}
                        static
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { duration: 0.35, ease: "easeOut" },
                        }}
                        exit={{
                          opacity: 0,
                          transition: { duration: 0.3, ease: "easeIn" },
                        }}
                        transition
                        className={clsx(
                          "absolute z-50 mt-1 w-full rounded-xl border border-white/5 bg-[#2a2828] px-1 pt-0 pb-1 outline-none",
                          "origin-top transform"
                        )}
                      >
                        {processingTypes.map((item) => (
                          <ListboxOption
                            key={item.id}
                            value={item.processingType}
                            className="group mt-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 select-none hover:bg-[#242323] aria-selected:bg-[#242323]"
                          >
                            <CheckIcon className="invisible size-4 fill-white/90 group-aria-selected:visible" />
                            <div className="text-sm/6 text-white/90">
                              {item.processingType}
                            </div>
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </Listbox>
            {errors.processingType && (
              <p className="text-red-500 text-sm mt-2">
                {errors.processingType}
              </p>
            )}
          </Field>
          <Field>
            <Label className="block text-white/90 opacity-60 mb-2 select-none">
              Condition
            </Label>
            <Input
              id="condition"
              type="text"
              placeholder="e.g., column_name > value"
              value={condition}
              onChange={(e) => {
                setCondition(e.target.value);
                setErrors((prev) => ({ ...prev, condition: undefined }));
              }}
              className={clsx(
                "block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white/90 placeholder-[#e5e7eb66] placeholder:select-none outline-none",
                "focus:not-data-[focus]:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/10 [transition-property:all] ease-in-out duration-500"
              )}
            />
            {errors.condition && (
              <p className="text-red-500 text-sm mt-2">{errors.condition}</p>
            )}
          </Field>
        </div>
        <Field className="mt-4 flex items-center">
          <Checkbox
            checked={isSampleData}
            onChange={setIsSampleData}
            className="group size-5 rounded-md mr-2 bg-transparent p-[3px] ring-1 ring-white/15 ring-inset data-[checked]:bg-green-600/40 outline-none [transition-property:all] ease-in-out duration-500"
          >
            <CheckIcon className="hidden size-4 fill-white/90 group-aria-checked:block" />
          </Checkbox>
          <Label className={"pt-1 text-gray-100 opacity-60 select-none"}>
            Sample data only (faster processing)
          </Label>
        </Field>
      </section>
    </div>
  );
}
