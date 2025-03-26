
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

  try {
    // Try to load first few images first for immediate display
    const initialImages = imageUrls.slice(0, 5).map(url => preloadImage(url));
    await Promise.all(initialImages);

    // Then load the rest in the background
    imageUrls.slice(5).forEach(url => {
      preloadImage(url).catch(() => {
        // Silently fail individual images
      });
    });
  } catch (error) {
    console.error("Error during image preloading:", error);
    // Continue execution even if some images fail to load
  }
};
