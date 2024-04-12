function getLocationData() {
  // Initialize Radar with your publishable API key
  Radar.initialize('prj_test_pk_46aed3ba8dcbae2e29b726476e62a678b9f18148');
  
  const postalCode = document.getElementById('postalCodeInput').value;
  const apiKey = 'prj_test_pk_46aed3ba8dcbae2e29b726476e62a678b9f18148';

  // Make the API request
  return fetch(`https://api.radar.io/v1/geocode/forward?query=${postalCode}`, {
    headers: {
      Authorization: apiKey
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('API Response:', data); // Log the entire API response
    // Extract latitude and longitude from the API response
    const { latitude, longitude } = data.addresses[0];
    console.log('Latitude:', latitude, 'Longitude:', longitude); // Log latitude and longitude
    // Parse latitude and longitude into floats
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    console.log('Parsed Latitude:', lat, 'Parsed Longitude:', lng); // Log parsed latitude and longitude
    // Check if latitude and longitude are valid numbers
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid latitude or longitude values');
    }
    // Return an object containing parsed latitude and longitude
    return { latitude: lat, longitude: lng };
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    // Return null or handle the error as needed
    return null;
  });
}

// Event listener for the submit button
document.getElementById('submitButton').addEventListener('click', () => {
  // Call getLocationData and handle the returned promise
  getLocationData()
    .then(location => {
      // Check if location is not null
      if (location) {
        // Create a map centered at the coordinates
        const map = Radar.ui.map({
          container: 'map',
          style: 'radar-default-v1', // Use a default style or specify a custom style if needed
          center: [location.longitude, location.latitude],
          zoom: 11
        });

        // Create a marker at the coordinates
        const marker = Radar.ui.marker({ text: 'Location' })
          .setLngLat([location.longitude, location.latitude])
          .addTo(map);
      } else {
        // Handle the case where location is null (API request failed)
        console.log('Failed to retrieve location data.');
      }
    });
});