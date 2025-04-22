// Calculate distance between two points using the Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  try {
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return Infinity;
    }

    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distance = R * c;
    return isNaN(distance) ? Infinity : Math.min(distance, 1609.34); // Cap at 1 mile (1609.34m)
  } catch (error) {
    console.error('Error calculating distance:', error);
    return Infinity;
  }
};

// Check if items are nearby (radius in meters)
export const findNearbyItems = (userLocation, items, radiusInMeters = 402) => {
  if (!userLocation || !items || !Array.isArray(items)) return [];
  
  try {
    // Ensure radius doesn't exceed 1 mile (1609.34m)
    const safeRadius = Math.min(radiusInMeters, 1609.34);
    
    const nearbyItems = items.filter(item => {
      if (!item?.location?.coordinates?.lat || !item?.location?.coordinates?.lng) {
        return false;
      }
      
      try {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          item.location.coordinates.lat,
          item.location.coordinates.lng
        );
        
        return distance <= safeRadius && distance !== Infinity;
      } catch {
        return false;
      }
    });

    // Sort by distance with error handling
    return nearbyItems.sort((a, b) => {
      try {
        const distA = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          a.location.coordinates.lat,
          a.location.coordinates.lng
        );
        const distB = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          b.location.coordinates.lat,
          b.location.coordinates.lng
        );
        return distA - distB;
      } catch {
        return 0; // Keep original order if calculation fails
      }
    });
  } catch (error) {
    console.error('Error finding nearby items:', error);
    return [];
  }
}; 