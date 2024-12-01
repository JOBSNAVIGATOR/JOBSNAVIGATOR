export function generateJobCode(jobData, sequenceNumber = "") {
  // 1. Sector
  const sector = jobData.jobSector;

  // 2. Domain initials (e.g., "Software Development" -> "SD")
  const domain = jobData.jobDomain;

  // 3. Level based on current CTC
  const ctc = parseFloat(jobData.jobSalary);
  const quotient = Math.floor(ctc / 5);
  const remainder = ctc % 5;
  const level = remainder === 0 ? quotient : quotient + 1;

  // 4. Location shorthand (e.g., "Delhi" -> "DLI")
  const locationInitials = jobData.jobLocation.substring(0, 3).toUpperCase();

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
