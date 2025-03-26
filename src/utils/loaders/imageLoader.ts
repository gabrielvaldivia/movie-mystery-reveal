
// Helper function to preload all movie images
export const loadAllMovieImages = async (imageUrls: string[]): Promise<void> => {
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
        resolve(); // We still resolve to prevent hanging the promise chain
      };
      img.src = url;
    });
  };

  // Load images in batches to avoid overwhelming the browser
  const batchSize = 5;
  for (let i = 0; i < imageUrls.length; i += batchSize) {
    const batch = imageUrls.slice(i, i + batchSize);
    try {
      await Promise.all(batch.map(url => preloadImage(url)));
    } catch (error) {
      console.error("Error during image preloading:", error);
    }
  }
};
