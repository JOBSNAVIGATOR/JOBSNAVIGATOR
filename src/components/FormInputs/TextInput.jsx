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
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      {/* <div className="mt-2"> */}
      <input
        {...register(`${name}`, { required: isRequired })}
        type={type}
        name={name}
        id={name}
        defaultValue={defaultValue}
        autoComplete={name}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-xl focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={label.toLowerCase()}
        min={type === "date" ? min : undefined}
        max={type === "date" ? max : undefined}
      />
      {errors[`${name}`] && (
        <small className="text-sm text-red-600 ">{label} is required</small>
      )}
      {/* </div> */}
    </div>
  );
}
