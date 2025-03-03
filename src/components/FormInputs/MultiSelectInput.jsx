// import React, { useState, useRef, useEffect } from "react";

// export default function MultiSelectInput({
//   label,
//   name,
//   register,
//   className = "sm:col-span-2",
//   options = [],
//   multiple = false,
//   disabled = false,
// }) {
//   const [selectedValues, setSelectedValues] = useState(multiple ? [] : "");
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleSelectChange = (value) => {
//     if (multiple) {
//       if (selectedValues.includes(value)) {
//         setSelectedValues(selectedValues.filter((v) => v !== value));
//       } else {
//         setSelectedValues([...selectedValues, value]);
//       }
//     } else {
//       setSelectedValues(value);
//       setIsOpen(false); // Close dropdown on single select
//     }
//   };

//   return (
//     <div className={`relative z-10 mb-5 group ${className}`} ref={dropdownRef}>
//       {/* Dropdown Trigger */}
//       <div
//         className={`block w-full pl-2 pr-6 py-2 text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:text-gray-700 disabled:border-gray-300 disabled:cursor-not-allowed cursor-pointer`}
//         onClick={() => !disabled && setIsOpen(!isOpen)}
//       >
//         {multiple
//           ? selectedValues.length > 0
//             ? options
//                 .filter((option) => selectedValues.includes(option.value))
//                 .map((option) => option.label)
//                 .join(", ")
//             : "Select options"
//           : selectedValues
//           ? options.find((option) => option.value === selectedValues)?.label
//           : "Select an option"}
//       </div>

//       {/* Floating Label */}
//       <label
//         htmlFor={name}
//         className="peer-focus:font-semibold peer-focus:tracking-wider absolute text-xl font-semibold text-black duration-300 transform -translate-y-8 scale-100 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-8 peer-focus:text-blue-600"
//       >
//         {label}
//       </label>

//       {/* Dropdown Menu */}
//       {isOpen && (
//         <div className="absolute left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg mt-1 max-h-60 overflow-auto">
//           {options.map((option) => (
//             <label
//               key={option.value}
//               className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
//             >
//               {multiple ? (
//                 <input
//                   type="checkbox"
//                   value={option.value}
//                   checked={selectedValues.includes(option.value)}
//                   onChange={() => handleSelectChange(option.value)}
//                   className="mr-2"
//                 />
//               ) : (
//                 <input
//                   type="radio"
//                   name={name}
//                   value={option.value}
//                   checked={selectedValues === option.value}
//                   onChange={() => handleSelectChange(option.value)}
//                   className="mr-2"
//                 />
//               )}
//               {option.label}
//             </label>
//           ))}
//         </div>
//       )}

//       {/* Hidden Input for Form Handling */}
//       <input
//         type="hidden"
//         {...register(name)}
//         value={multiple ? selectedValues.join(",") : selectedValues}
//       />
//     </div>
//   );
// }

// import React, { useState, useRef, useEffect } from "react";

// export default function MultiSelectInput({
//   label,
//   name,
//   register,
//   className = "sm:col-span-2",
//   options = [],
//   multiple = true,
//   disabled = false,
// }) {
//   const [selectedValues, setSelectedValues] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleSelectChange = (value) => {
//     if (selectedValues.includes(value)) {
//       setSelectedValues(selectedValues.filter((v) => v !== value));
//     } else {
//       setSelectedValues([...selectedValues, value]);
//     }
//   };

//   return (
//     <div className={`relative z-10 mb-5 group ${className}`} ref={dropdownRef}>
//       <div
//         className="block w-full pl-2 pr-6 py-2 text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:text-gray-700 disabled:border-gray-300 disabled:cursor-not-allowed cursor-pointer"
//         onClick={() => !disabled && setIsOpen(!isOpen)}
//       >
//         {selectedValues.length > 0
//           ? options
//               .filter((option) => selectedValues.includes(option.value))
//               .map((option) => option.label)
//               .join(", ")
//           : "Select an option"}
//       </div>

//       {/* Floating Label */}
//       <label
//         htmlFor={name}
//         className="peer-focus:font-semibold peer-focus:tracking-wider absolute text-xl font-semibold text-black duration-300 transform -translate-y-8 scale-100 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-8 peer-focus:text-blue-600"
//       >
//         {label}
//       </label>

//       {isOpen && multiple && (
//         <div className="absolute left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg mt-1 max-h-60 overflow-auto">
//           {options.map((option) => (
//             <label
//               key={option.value}
//               className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
//             >
//               <input
//                 type="checkbox"
//                 value={option.value}
//                 checked={selectedValues.includes(option.value)}
//                 onChange={() => handleSelectChange(option.value)}
//                 className="mr-2"
//               />
//               {option.label}
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";

export default function MultiSelectInput({
  label,
  name,
  register,
  setValue, // <-- Add setValue from React Hook Form
  watch, // <-- Watch for form changes
  className = "sm:col-span-2",
  options = [],
  multiple = true,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Initialize selected values from React Hook Form
  const selectedValues = watch(name) || (multiple ? [] : "");

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectChange = (value) => {
    let newValues;
    if (multiple) {
      newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
    } else {
      newValues = value;
      setIsOpen(false);
    }

    setValue(name, newValues); // ✅ Update React Hook Form
  };

  return (
    <div className={`relative z-10 mb-5 group ${className}`} ref={dropdownRef}>
      <div
        className={`block w-full pl-2 pr-6 py-2 text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:text-gray-700 disabled:border-gray-300 disabled:cursor-not-allowed cursor-pointer`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {multiple
          ? selectedValues.length > 0
            ? options
                .filter((option) => selectedValues.includes(option.value))
                .map((option) => option.label)
                .join(", ")
            : "Select options"
          : selectedValues
          ? options.find((option) => option.value === selectedValues)?.label
          : "Select an option"}
      </div>

      {/* Floating Label */}
      <label
        htmlFor={name}
        className="peer-focus:font-semibold peer-focus:tracking-wider absolute text-xl font-semibold text-black duration-300 transform -translate-y-8 scale-100 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-8 peer-focus:text-blue-600"
      >
        {label}
      </label>

      {isOpen && (
        <div className="absolute left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg mt-1 max-h-60 overflow-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                value={option.value}
                checked={
                  multiple
                    ? selectedValues.includes(option.value)
                    : selectedValues === option.value
                }
                onChange={() => handleSelectChange(option.value)}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}

      {/* ✅ Hidden Input for Form Submission */}
      <input
        type="hidden"
        {...register(name)}
        value={multiple ? selectedValues.join(",") : selectedValues}
      />
    </div>
  );
}
