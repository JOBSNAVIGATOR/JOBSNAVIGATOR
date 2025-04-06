import React from "react";

const SelectInputThree = ({
  label,
  name,
  value,
  onChange,
  options,
  register,
  className,
  disabled = false,
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
      {...register}
      name={name}
      value={value}
      onChange={onChange}
      className="border rounded px-2 py-1 dark:bg-zinc-600 bg-gray-300"
      disabled={disabled}
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

export default SelectInputThree;
