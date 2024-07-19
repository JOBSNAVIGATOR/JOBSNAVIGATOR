import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function TextInput({
  label,
  name,
  register,
  errors,
  isRequired = true,
  type = "text",
  className = "sm:col-span-2",
  defaultValue = "",
  min,
  max,
}) {
  return (
    <div className={className}>
      <LabelInputContainer>
        <Label
          htmlFor={name}
          className="block mb-2 text-md font-medium text-neutral-800 dark:text-neutral-200 "
        >
          {label}
        </Label>
        {/* <div className="mt-2"> */}
        <Input
          {...register(`${name}`, { required: isRequired })}
          type={type}
          name={name}
          id={name}
          defaultValue={defaultValue}
          autoComplete={name}
          className=""
          placeholder={label.toLowerCase()}
          min={type === "date" ? min : undefined}
          max={type === "date" ? max : undefined}
        />
      </LabelInputContainer>

      {errors[`${name}`] && (
        <small className="text-sm text-red-600 ">{label} is required</small>
      )}
      {/* </div> */}
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
