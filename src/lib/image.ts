const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.75;

/**
 * Read an image file, downscale it so it fits comfortably in localStorage,
 * and return a JPEG data URL. Rejects with a friendly message on failure.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("That file is not an image. Please choose a photo."));
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      reject(
        new Error("Photo is too large (over 12 MB). Please pick a smaller one.")
      );
      return;
    }
    const reader = new FileReader();
    reader.onerror = () =>
      reject(new Error("Could not read that file. Please try another photo."));
    reader.onload = () => {
      const src = String(reader.result);
      const img = new Image();
      img.onerror = () => {
        // Fall back to the raw data URL if canvas processing fails.
        resolve(src);
      };
      img.onload = () => {
        try {
          const scale = Math.min(
            1,
            MAX_DIMENSION / Math.max(img.width, img.height)
          );
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(src);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
        } catch {
          resolve(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
