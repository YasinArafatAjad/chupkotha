export function createUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
  return `${timestamp}_${sanitizedName}`;
}