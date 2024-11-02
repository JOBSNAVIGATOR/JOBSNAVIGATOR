import React from "react";

const SelectInputTwo = ({
  label,
  name,
  options,
  register,
  className,
  disabled = false,
  onChange, // Add the onChange prop
  value, // Add the value prop
}) => (
  <div className={className}>
    {label && (
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-50 mb-2"
      >
        {label}
      </label>
    )}
    <select
      id={name}
      {...register(name)} // Correctly use the register function
      className="border rounded px-2 py-1 dark:bg-zinc-600 bg-gray-300"
      disabled={disabled}
      onChange={onChange} // Attach the custom onChange handler
      value={value} // Set the value prop to reflect the current status
    >
      <option value="">Select {label}</option> {/* Placeholder option */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-lime-100 dark:hover:bg-slate-700"
        >
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectInputTwo;
