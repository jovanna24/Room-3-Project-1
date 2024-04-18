document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('open-modal');
    const closeModalButton = document.querySelector('.modal-close');
    const brewerySearchForm = document.getElementById('brewery-search-form');
    const resultsContainer = document.getElementById('search-brewery-info');
    let myMap; // Map variable

   // Function to calculate distance
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3958.8;
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }

    // Function to convert degrees to radians
    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }
   
    // Initialize the map
    function initMap(lat, lng) {
        if (myMap) myMap.remove(); // Clear existing map instance if exists

        myMap = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(myMap);
    }

    // Function to remove the map
    function removeMap() {
        if (myMap) {
            myMap.remove();
            myMap = null;
        }
    }

    openModalButton.addEventListener('click', function() {
        modal.classList.add('is-active');
    });

    closeModalButton.addEventListener('click', function() {
        modal.classList.remove('is-active');
    });

    brewerySearchForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const postalCode = document.getElementById('postalCodeInput').value.trim();
        const distance = document.getElementById('distanceInput').value.trim();

        if (!postalCode || !distance) {
            alert('Please input both your zipcode and distance.');
            return;
        }

        fetchLocationAndDisplayBreweries(postalCode, distance);
        modal.classList.remove('is-active');
    });

    function fetchLocationAndDisplayBreweries(zipcode, distance) {
        const apiKey = 'prj_test_pk_46aed3ba8dcbae2e29b726476e62a678b9f18148';  // Replace with your actual Radar API key
        fetch(`https://api.radar.io/v1/geocode/forward?query=${zipcode}`, {
            headers: { Authorization: apiKey }
        })
        .then(response => response.json())
        .then(data => {
            if (data.addresses && data.addresses.length > 0) {
                const { latitude, longitude } = data.addresses[0];
                initMap(latitude, longitude); // Initialize the map with the new center
                searchBreweryApi(zipcode, distance, latitude, longitude); // Now fetch breweries
            } else {
                alert('Failed to retrieve location data.');
            }
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
            alert('Error fetching location data.');
        });
    }

    function searchBreweryApi(zipcode, distance, lat, lng) {
        const breweryURL = `https://api.openbrewerydb.org/breweries?by_dist=${lat},${lng}&per_page=10`;

        fetch(breweryURL)
            .then(response => response.json())
            .then(breweries => {
                displayBreweries(breweries, lat, lng);
            })
            .catch(error => {
                console.error('Error fetching breweries:', error);
                alert('Error fetching breweries data.');
            });
    }

    function displayBreweries(breweries, userLatitude, userLongitude) {
        resultsContainer.innerHTML = ''; // Clear previous results

        if (breweries.length === 0) {
            resultsContainer.innerHTML = '<p>No breweries found in this area.</p>';
            return;
        }

        const distanceInput = parseFloat(document.getElementById('distanceInput').value.trim());


        breweries.forEach((brewery, index) => {
            // Calculating distance between user location and brewery location
            const distance = calculateDistance(userLatitude, userLongitude, brewery.latitude, brewery.longitude);
            
            // Check if the brewery is within the specified distance
            if (distance <= distanceInput) {
                const breweryDiv = document.createElement('div');
                breweryDiv.classList.add('box');
                breweryDiv.innerHTML = `
                    <h3> ${brewery.name}</h3>
                    <p>${brewery.street || 'No address available'}, ${brewery.city}, ${brewery.state}</p>
                    <p>Distance: ${distance.toFixed(2)} miles</p>
                    <a href="${brewery.website_url}" target="_blank" class="button is-link is-small">Visit Website</a>
                `;
                resultsContainer.appendChild(breweryDiv);

                // Add marker for the brewery on the map
                const breweryLatLng = L.latLng(brewery.latitude, brewery.longitude);
                const breweryMarker = L.marker(breweryLatLng).addTo(myMap);
                breweryMarker.bindPopup(`<b> ${brewery.name}</b><br>${brewery.city}, ${brewery.state}`).openPopup();
            }
        });
    }
});