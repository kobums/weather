import koreaDistricts from '../../../korea_districts.json';

export interface LocationItem {
  fullName: string;
  name: string; // The last part (e.g., "동부리", "역삼동") - for Title
  displayName: string; // The full address (e.g., "부산광역시 기장군 기장읍 동부리") - for Subtitle
  city?: string;
  district?: string;
  neighborhood?: string;
}

export function parseLocation(location: string): LocationItem {
  const parts = location.split('-');

  // Process parts to handle "OO시OO구" case by adding a space
  const processedParts = parts.map((part) => {
    if (part.includes('시') && part.includes('구')) {
      const siIndex = part.indexOf('시');
      return part.substring(0, siIndex + 1) + ' ' + part.substring(siIndex + 1);
    }
    return part;
  });

  // name: The last part of the address
  let name = processedParts[processedParts.length - 1];

  // If name is "용인시 기흥구", extract just "기흥구" for the title
  if (name.includes('시') && name.includes('구') && name.includes(' ')) {
    name = name.split(' ')[1];
  }

  // displayName: Full address joined by spaces
  const displayName = processedParts.join(' ');

  // Legacy fields parsing (for backward compatibility if needed)
  let district = parts[1];
  let neighborhood = parts[2];

  // Handle 4-part addresses (e.g., Province - County - Town - Village)
  // If there are 4 parts, neighborhood might be better represented as parts[2] + ' ' + parts[3]
  // or just mapping parts to properties loosely.
  if (parts.length > 3) {
    neighborhood = parts.slice(2).join(' ');
  }

  // Handle special case like "용인시기흥구" in parts[1]
  if (district && district.includes('시') && district.includes('구')) {
    const siIndex = district.indexOf('시');
    district = district.substring(0, siIndex + 1); // "용인시"
    // The rest implies logic handled previously but simplified here for now
  }

  // Get the city name for API (usually the last part is most specific)
  let cityForApi = parts[parts.length - 1];

  // Special case: "용인시기흥구" -> "기흥구" (if it appears as the last part, though unlikely in this dataset structure)
  if (cityForApi.includes('시') && cityForApi.includes('구')) {
    const siIndex = cityForApi.indexOf('시');
    cityForApi = cityForApi.substring(siIndex + 1);
  }

  return {
    fullName: location,
    name,
    displayName,
    city: cityForApi,
    district,
    neighborhood,
  };
}

export function searchLocations(query: string): LocationItem[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  const matches = koreaDistricts
    .filter((location) => {
      const normalizedLocation = location.toLowerCase();
      return normalizedLocation.includes(normalizedQuery);
    })
    .slice(0, 20) // Limit to 20 results
    .map(parseLocation);

  return matches;
}
