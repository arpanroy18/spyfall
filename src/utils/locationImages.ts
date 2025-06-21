// Mapping of location names to image filenames
export const locationImageMap: Record<string, string> = {
  "Airplane": "airplane.jpg",
  "Bank": "bank.jpg", 
  "Beach": "beach.jpg",
  "Broadway Theater": "broadway-theater.jpg",
  "Casino": "casino.jpg",
  "Cathedral": "cathedral.jpg",
  "Circus Tent": "circus-tent.jpg",
  "Corporate Party": "corporate-party.jpg",
  "Crusader Army": "crusader-army.jpg",
  "Day Spa": "day-spa.jpg",
  "Embassy": "embassy.jpg",
  "Hospital": "hospital.jpg",
  "Hotel": "hotel.jpg",
  "Military Base": "military-base.jpg",
  "Movie Studio": "movie-studio.jpg",
  "Ocean Liner": "ocean-liner.jpg",
  "Passenger Train": "passenger-train.jpg",
  "Pirate Ship": "pirate-ship.jpg",
  "Polar Station": "polar-station.jpg",
  "Police Station": "police-station.jpg",
  "Restaurant": "restaurant.jpg",
  "School": "school.jpg",
  "Service Station": "service-station.jpg",
  "Space Station": "space-station.jpg",
  "Submarine": "submarine.jpg",
  "Supermarket": "supermarket.jpg",
  "University": "university.jpg"
};

// Function to get image path for a location
export const getLocationImagePath = (location: string): string => {
  const filename = locationImageMap[location];
  return filename ? `/images/locations/${filename}` : '';
};

// Function to check if image exists (for fallback handling)
export const checkImageExists = (imagePath: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
};