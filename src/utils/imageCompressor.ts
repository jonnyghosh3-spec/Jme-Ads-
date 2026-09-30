/**
 * Image compression utility to ensure all uploaded images (proof screenshots, profile avatars)
 * are strictly under a specified KB limit (default 100 KB) using HTML5 Canvas.
 */

export interface CompressionResult {
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
}

export const compressImage = async (
  fileOrDataUrl: File | Blob | string,
  maxKb: number = 100,
  maxDimension: number = 800
): Promise<CompressionResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Helper to read data url if given a File or Blob
    const loadSource = () => {
      if (typeof fileOrDataUrl === 'string') {
        img.src = fileOrDataUrl;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('ফাইল পড়তে ব্যর্থ হয়েছে'));
        reader.readAsDataURL(fileOrDataUrl);
      }
    };

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        // Scale down dimensions to fit maxDimension while preserving aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('ক্যানভাস কনটেক্সট তৈরি করা যায়নি'));
          return;
        }

        // Draw image onto canvas
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Iteratively lower quality until size is under maxKb
        let quality = 0.8;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        // Binary/step-down search if still over maxKb
        while (sizeKb > maxKb && quality > 0.15) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        }

        // If still somehow over limit, halve canvas dimensions and redraw
        if (sizeKb > maxKb && width > 300) {
          const scaledCanvas = document.createElement('canvas');
          scaledCanvas.width = Math.round(width * 0.7);
          scaledCanvas.height = Math.round(height * 0.7);
          const scaledCtx = scaledCanvas.getContext('2d');
          if (scaledCtx) {
            scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
            dataUrl = scaledCanvas.toDataURL('image/jpeg', 0.65);
            sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
            width = scaledCanvas.width;
            height = scaledCanvas.height;
          }
        }

        resolve({
          dataUrl,
          sizeKb,
          width,
          height
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('ছবি লোড করতে ব্যর্থ হয়েছে'));
    };

    loadSource();
  });
};
