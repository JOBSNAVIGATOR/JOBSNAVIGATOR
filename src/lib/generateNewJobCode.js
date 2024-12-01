export function generateNewJobCode(jobData, sequenceNumber = "") {
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

  // Combine all parts to generate the client code
  const jobCode = `${sector}-${domain}-${level}-${locationInitials}-${vacancy}`;
  // console.log("job code", jobCode);

  return jobCode;
}
