export function generateCandidateCode(candidateData, sequenceNumber = "") {
  // 1. Fixed part of the code
  const prefix = "JOBSNVG";

  // 2. Current Date in DDMMYYYY format
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = today.getFullYear();
  const date = `${day}${month}${year}`;

  // 3. Name initials (first letter of first and last name)
  const nameInitials = candidateData.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  // 4. Sequence number (should be incremented for each candidate)
  const sequence = sequenceNumber;

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

  // Combine all parts to generate the candidate code
  const candidateCode = `${prefix}-${date}-${nameInitials}-${sequence}-${sector}-${domainInitials}-${level}-${locationInitials}`;

  return candidateCode;
}

// Example usage
// const candidateData = {
//   name: "Ujjwal Jindal",
//   currentCtc: "6",
//   sector: "IT",
//   domain: "Software Development",
//   currentJobLocation: "Delhi",
// };

// const sequenceNumber = 1; // Replace this with the actual sequence number logic
// const candidateCode = generateCandidateCode(candidateData, sequenceNumber);

// console.log(candidateCode);
// Outputs: JOBSNVG-24092024-UJ-1-IT-SD-2-DLI
