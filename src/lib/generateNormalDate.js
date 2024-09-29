export function generateNormalDate(isoFormattedDate) {
  const dateObject = new Date(isoFormattedDate);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JS
  const day = String(dateObject.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
