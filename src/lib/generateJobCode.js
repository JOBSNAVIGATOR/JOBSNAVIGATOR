export function generateJobCode(jobData, sequenceNumber = "") {
  // 1. Sector
  const sector = jobData.sectorName;

  // 2. Domain initials (e.g., "Software Development" -> "SD")
  const domain = jobData.domainName;

  // 3. Level based on current CTC
  const ctc = parseFloat(jobData.jobSalary);
  const quotient = Math.floor(ctc / 5);
  const remainder = ctc % 5;
  const level = remainder === 0 ? quotient : quotient + 1;

  // 4. Location shorthand (e.g., "Delhi" -> "DLI")
  const location = jobData.district_name.toUpperCase();
  const locationInitials =
    location.length >= 6 ? location.substring(0, 6) : location;

  // 5. Total Vacancies
  const vacancy = jobData.vacanciesInt;

  // 6. Sequence number (should be incremented for each candidate)
  const sequence = sequenceNumber;

  // 7. Date of creation/posting in YYYYMMDD format
  const dateOfCreation = new Date();
  const creationDateStr = `${dateOfCreation.getFullYear()}${String(
    dateOfCreation.getMonth() + 1
  ).padStart(2, "0")}${String(dateOfCreation.getDate()).padStart(2, "0")}`;

  // Combine all parts to generate the client code
  const jobCode = `${sector}-${domain}-${level}-${locationInitials}-${vacancy}-${creationDateStr}-${sequenceNumber}`;
  // console.log("job code", jobCode);

  return jobCode;
}
