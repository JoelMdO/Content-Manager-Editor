// Function to check valid image file headers (magic numbers)
export function isValidImage(bytes: Uint8Array): boolean {
  const pngHeader = [0x89, 0x50, 0x4e, 0x47]; // PNG: 89 50 4E 47
  const jpegHeader = [0xff, 0xd8, 0xff]; // JPEG: FF D8 FF
  const gifHeader = [0x47, 0x49, 0x46, 0x38]; // GIF: 47 49 46 38

  return (
    startsWith(bytes, pngHeader) ||
    startsWith(bytes, jpegHeader) ||
    startsWith(bytes, gifHeader)
  );
}

// Utility function to check if bytes start with a given signature
function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte);
}
