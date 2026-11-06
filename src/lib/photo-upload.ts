/**
 * Shared profile-photo upload handling for the create form and the edit
 * dashboard. The server only accepts PNG/JPEG/WebP/GIF data URLs up to
 * 1 MiB, so validate the same rules on the client and surface failures
 * instead of silently doing nothing.
 */

export const SUPPORTED_PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export const MAX_PHOTO_BYTES = 1024 * 1024;

/** Returns a user-facing error message, or null when the file is acceptable. */
export function validatePhotoFile(file: { type: string; size: number }): string | null {
  if (!SUPPORTED_PHOTO_TYPES.includes(file.type)) {
    return 'Unsupported image type — use PNG, JPEG, WebP, or GIF';
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return 'Image too large (max 1MB)';
  }
  return null;
}

/** Read a file as a data URL, rejecting (not silently swallowing) read errors. */
export function readPhotoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Could not read that image'));
    };
    reader.onerror = () => reject(new Error('Could not read that image'));
    reader.readAsDataURL(file);
  });
}

/** Validate + read in one step; resolves to the data URL or throws with a displayable message. */
export async function processPhotoUpload(file: File): Promise<string> {
  const error = validatePhotoFile(file);
  if (error) throw new Error(error);
  return readPhotoFile(file);
}
