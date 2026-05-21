/**
 * QR Code Utilities
 * Handles parsing and validation of QR Code data
 */

export interface QRData {
  nisn: string;
  name: string;
  className: string;
}

/**
 * Parses the raw QR code string into structured data
 * Expected format: NISN|FullName|ClassName
 * @param rawData The raw string from the QR code scanner
 * @returns QRData object or null if invalid format
 */
export const parseQRData = (rawData: string): QRData | null => {
  if (!rawData || typeof rawData !== "string") {
    return null;
  }

  const parts = rawData.split("|");
  if (parts.length !== 3) {
    return null;
  }

  const [nisn, name, className] = parts;

  // Basic validation
  if (!nisn.trim() || !name.trim() || !className.trim()) {
    return null;
  }

  return {
    nisn: nisn.trim(),
    name: name.trim(),
    className: className.trim(),
  };
};

/**
 * Formats data into a QR code string
 * @param data The QRData object
 * @returns formatted string
 */
export const formatQRData = (data: QRData): string => {
  return `${data.nisn}|${data.name}|${data.className}`;
};
