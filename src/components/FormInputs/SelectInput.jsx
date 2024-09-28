// import React from "react";

// export default function SelectInput({
//   label,
//   name,
//   register,
//   className = "sm:col-span-2",
//   options = [],
//   multiple = false,
// }) {
//   return (
//     <div className={className}>
//       <label
//         htmlFor={name}
//         className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-50 mb-2 "
//       >
//         {label}
//       </label>
//       <div className="mt-2">
//         <select
//           {...register(`${name}`)}
//           id={name}
//           multiple={multiple}
//           name={name}
//           className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-700 sm:text-sm sm:leading-6 dark:bg-slate-700 dark:text-slate-100"
//         >
//           {options.map((option, i) => {
//             return (
//               <option
//                 key={i}
//                 value={option.id}
//                 className="text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-lime-100 dark:hover:bg-slate-700"
//               >
//                 {option.title}
//               </option>
//             );
//           })}
//         </select>
//       </div>
//     </div>
//   );
// }

import React from "react";

const SelectInput = ({
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

export default SelectInput;
