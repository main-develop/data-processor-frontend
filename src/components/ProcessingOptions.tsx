import type { Errors, ProcessingOptionsState } from "./App";
import { Field, Input, Label, Checkbox } from "@headlessui/react";
import CustomListbox from "./ui/CustomListbox";
import { CheckIcon } from "@heroicons/react/20/solid";
import type { DatasetMetadata } from "./App";
import clsx from "clsx";
import { useProcessingOptionsData } from "../hooks/useProcessingOptionsData";
import AggregationListbox from "./ui/AggregationListbox";

interface ProcessingOptionsProperties {
  processingOptions: ProcessingOptionsState;
  setProcessingOptions: React.Dispatch<
    React.SetStateAction<ProcessingOptionsState>
  >;
  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
  metadata: DatasetMetadata;
}

export default function ProcessingOptions({
  processingOptions,
  setProcessingOptions,
  errors,
  setErrors,
  metadata,
}: ProcessingOptionsProperties) {
  const {
    processingType,
    condition,
    isSampleData,
    groupByColumn,
    aggregateColumn,
    aggregateFunction,
  } = processingOptions;

  const updateOption = (key: keyof ProcessingOptionsState, value: any) => {
    setProcessingOptions((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const aggregationFunctions = ["sum", "mean", "count", "min", "max"];
  const { availableProcessingTypes, numericColumns, categoricalColumns } =
    useProcessingOptionsData(metadata);

  return (
    <div className="relative">
      <div className="section-gradient-shadow"></div>
      <section className="mb-20 p-6 rounded-xl shadow-md glassmorphism">
        <h2 className="text-xl font-semibold mb-4">Processing Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field className="mx-auto w-full">
            <Label className="block text-gray-100 opacity-60 mb-2 select-none">
              Processing type
            </Label>
            <CustomListbox
              value={processingType}
              options={availableProcessingTypes}
              onChange={(value) => updateOption("processingType", value)}
            ></CustomListbox>
          </Field>
          {processingType === "Filter data" && (
            <Field>
              <Label className="block text-white/90 opacity-60 mb-2 select-none">
                Condition
              </Label>
              <Input
                id="condition"
                type="text"
                placeholder="e.g., price > 100"
                value={condition}
                onChange={(value) =>
                  updateOption("condition", value.target.value)
                }
                className={clsx(
                  "block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white/90 placeholder-[#e5e7eb66] placeholder:select-none outline-none",
                  "focus:not-data-[focus]:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/10 [transition-property:all] ease-in-out duration-500"
                )}
              />
              {errors.condition && (
                <p className="text-red-500 text-sm mt-2">{errors.condition}</p>
              )}
            </Field>
          )}
          {processingType === "Aggregate data" && (
            <>
              <AggregationListbox
                label="Group By Column"
                value={groupByColumn}
                options={categoricalColumns}
                onChange={(value: string) =>
                  updateOption("groupByColumn", value)
                }
                error={errors.groupByColumn}
              />
              <AggregationListbox
                label="Aggregation Column"
                value={aggregateColumn}
                options={numericColumns}
                onChange={(value: string) =>
                  updateOption("aggregateColumn", value)
                }
                error={errors.aggregateColumn}
              />
              <AggregationListbox
                label="Aggregation Function"
                value={aggregateFunction}
                options={aggregationFunctions}
                onChange={(value: string) =>
                  updateOption("aggregateFunction", value)
                }
                error={errors.aggregateFunction}
              />
            </>
          )}
        </div>
        <Field className="mt-4 flex items-center">
          <Checkbox
            checked={isSampleData}
            onChange={(value) => updateOption("isSampleData", value)}
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
