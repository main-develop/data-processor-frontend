import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

interface CustomListboxProperties {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function CustomListbox({
  value,
  options,
  onChange,
}: CustomListboxProperties): React.JSX.Element {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <ListboxButton className="block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white/90 outline-none">
            {value || "Select column"}
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
                  "absolute max-h-32 overflow-y-auto overscroll-none z-50 mt-1 w-full rounded-xl border border-white/5 bg-[#2a2828] px-1 pt-0 pb-1 outline-none",
                  "origin-top transform"
                )}
              >
                {options.map((option) => (
                  <ListboxOption
                    key={option}
                    value={option}
                    className="group mt-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 select-none hover:bg-[#242323] aria-selected:bg-[#242323]"
                  >
                    <CheckIcon className="invisible size-4 fill-white/90 group-aria-selected:visible" />
                    <div className="text-sm/6 text-white/90">{option}</div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            )}
          </AnimatePresence>
        </div>
      )}
    </Listbox>
  );
}
