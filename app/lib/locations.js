export function getLocations(language) {
    const locations = [
      'New York',
      'Paris',
      'Tokyo',
      'London',
      'Sydney'
    ];
  
    if (language === 'hindi') {
      return locations.map(location => `${location} (हिंदी में)`);
    }
  
    return locations;
  }