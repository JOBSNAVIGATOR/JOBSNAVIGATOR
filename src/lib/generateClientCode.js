export function generateClientCode(clientData, sequenceNumber = "") {
  // 1. Fixed part of the code
  const prefix = "JOBSNVG EP";

  // 2. Sequence number (should be incremented for each candidate)
  const sequence = sequenceNumber;

  // Date of joining in YYYYMMDD format
  const dateOfJoining = new Date(clientData.dateOfJoining);
  const joiningDateStr = `${dateOfJoining.getFullYear()}${String(
    dateOfJoining.getMonth() + 1
  ).padStart(2, "0")}${String(dateOfJoining.getDate()).padStart(2, "0")}`;

  const functionalArea = clientData.functionalArea;

  // 4. Sector
  const sector = clientData.sector;

  // 5. Domain initials (e.g., "Software Development" -> "SD")
  const domain = clientData.domain;

  // Company name abbreviation
  const companyName = clientData.currentCompanyName.toUpperCase();

  // 7. Level based on current CTC
  const ctc = parseFloat(clientData.currentCtc);
  const quotient = Math.floor(ctc / 5);
  const remainder = ctc % 5;
  const level = remainder === 0 ? quotient : quotient + 1;

  // 8. Location shorthand (e.g., "Delhi" -> "DLI")
  const locationInitials = clientData.currentJobLocation
    .substring(0, 3)
    .toUpperCase();

  // Designation
  const designation = clientData.designation.toUpperCase();

  // Combine all parts to generate the client code
  const clientCode = `${prefix} ${sequence} ${joiningDateStr} ${functionalArea} ${domain} ${level} ${locationInitials} ${sector} ${companyName} ${designation}`;
  console.log("client code", clientCode);

  return clientCode;
}
