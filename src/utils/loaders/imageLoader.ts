
// Helper function to preload all movie images
export const loadAllMovieImages = async (imageUrls: string[]): Promise<void> => {
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      // Skip TMDB URLs as they're consistently failing
      if (url.includes('image.tmdb.org')) {
        console.log(`Skipping TMDB image preload: ${url}`);
        resolve();
        return;
      }
      
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
        resolve(); // We still resolve to prevent hanging the promise chain
      };
      img.src = url;
    });
  };

  // Load the first 5 images first (for immediate display)
  const initialImages = imageUrls.slice(0, 5).map(url => preloadImage(url));
  await Promise.all(initialImages);

  // Then load the rest in the background
  const remainingImages = imageUrls.slice(5).map(url => preloadImage(url));
  Promise.all(remainingImages).catch(err => {
    console.error("Error preloading remaining images:", err);
  });
};
