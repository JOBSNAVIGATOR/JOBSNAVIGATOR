export function generateNewCandidateCode(candidateData) {
  // 5. Sector
  const sector = candidateData.sectorName;

  // 6. Domain initials (e.g., "Software Development" -> "SD")
  const domainInitials = candidateData.domainName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  // 7. Level based on current CTC
  const ctc = parseFloat(candidateData.currentCtc);
  const quotient = Math.floor(ctc / 5);
  const remainder = ctc % 5;
  const level = remainder === 0 ? quotient : quotient + 1;

  // 8. Location shorthand (e.g., "Delhi" -> "DLI")
  const locationInitials = candidateData.currentJobLocation
    .substring(0, 3)
    .toUpperCase();

  // Combine the updated parts (Sector, Domain, Level, Location)
  const updatedCandidateCodePart = `${sector}-${domainInitials}-${level}-${locationInitials}`;

  return updatedCandidateCodePart;
}

// Example usage
// const candidateData = {
//   sector: "IT",
//   domain: "Software Development",
//   currentCtc: "6",
//   currentJobLocation: "Delhi",
// };

// const newCode = generateNewCandidateCode(candidateData);
// console.log(newCode); // Outputs: IT-SD-2-DLI
