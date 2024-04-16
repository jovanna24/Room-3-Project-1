document.addEventListener('DOMContentLoaded', function() {
  const openModalButton = document.getElementById('open-modal');
  const closeButton = document.getElementById('modal-close');
  const modalForm = document.getElementById('modal');

  // Functions to open/close modal 
  function openModal() {
      modalForm.classList.add('is-active');
  }

  function closeModal() {
      modalForm.classList.remove('is-active');
  }

  // Add event listener to openModalBtn
  openModalButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);

  // Function to get location data
  function getLocationData() {
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
          console.log('API Response:', data);
          const { latitude, longitude } = data.addresses[0];
          console.log('Latitude:', latitude, 'Longitude:', longitude);
          const lat = parseFloat(latitude);
          const lng = parseFloat(longitude);
          console.log('Parsed Latitude:', lat, 'Parsed Longitude:', lng);
          // Check if latitude and longitude are valid numbers
          if (isNaN(lat) || isNaN(lng)) {
              throw new Error('Invalid latitude or longitude values');
          }
          return { latitude: lat, longitude: lng };
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          return null;
      });
  }

  document.getElementById('submitButton').addEventListener('click', (event) => {
      event.preventDefault();
      
      // Call getLocationData and handle the returned promise
      getLocationData()
          .then(location => {
              if (location) {
                  // Create a map centered at the coordinates
                  const map = Radar.ui.map({
                      container: 'map',
                      style: 'radar-default-v1',
                      center: [location.longitude, location.latitude],
                      zoom: 11
                  });

                  // Create a marker at the coordinates
                  const marker = Radar.ui.marker({ text: 'Location' })
                      .setLngLat([location.longitude, location.latitude])
                      .addTo(map);

                  closeModal();
              } else {
                  console.log('Failed to retrieve location data.');
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
  });
});

