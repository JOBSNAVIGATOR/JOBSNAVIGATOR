export function generateInitials(fullName = "") {
  // Split the full name into an array of words
  const words = fullName.split(/\s+/);

  // Get the first letter of each word and join them
  const initials = words.map((word) => word.charAt(0)).join("");

  // Ensure the initials are in uppercase
  return initials.toUpperCase();
}

// Example usage:
// const fullName = "Ujjwal Jindal";
// const initials = generateInitials(fullName);
// console.log(initials); // Output: "UJ"
