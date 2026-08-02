export async function optimizeImage(file: File, maxDimension = 1800, quality = 0.84): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('Sélectionnez un fichier image valide.');
  if (file.size > 15 * 1024 * 1024) throw new Error("L'image ne doit pas dépasser 15 Mo.");

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Impossible de lire l'image."));
      element.src = objectUrl;
    });

    const ratio = Math.min(1, maxDimension / image.naturalWidth, maxDimension / image.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
    const context = canvas.getContext('2d');
    if (!context) throw new Error("Impossible d'optimiser l'image.");

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Impossible d'encoder l'image."))),
        'image/webp',
        quality,
      );
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}