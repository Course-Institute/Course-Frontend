/**
 * Generates a random 6-digit serial number
 * @returns A string containing exactly 6 digits (000000-999999)
 */
export const generateSerialNumber = (): string => {
  // Generate a random number between 0 and 999999
  const randomNum = Math.floor(Math.random() * 1000000);
  // Pad with leading zeros to ensure it's always 6 digits
  return randomNum.toString().padStart(6, '0');
};

