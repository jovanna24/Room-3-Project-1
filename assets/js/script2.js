document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('open-modal');
    const closeModalButton = document.querySelector('.modal-close');
    const brewerySearchForm = document.getElementById('brewery-search-form');
    const resultsContainer = document.getElementById('search-brewery-info');
    let myMap; // Map variable

    // Initialize the map
    function initMap(lat, lng) {
        if (myMap) myMap.remove(); // Clear existing map instance if exists

        myMap = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(myMap);
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
                displayBreweries(breweries);
            })
            .catch(error => {
                console.error('Error fetching breweries:', error);
                alert('Error fetching breweries data.');
            });
    }

    function displayBreweries(breweries) {
        resultsContainer.innerHTML = ''; // Clear previous results

        if (breweries.length === 0) {
            resultsContainer.innerHTML = '<p>No breweries found in this area.</p>';
            return;
        }

        breweries.forEach(brewery => {
            // Creating HTML structure to display each brewery
            const breweryDiv = document.createElement('div');
            breweryDiv.classList.add('box'); // Using Bulma's box class for styling
            breweryDiv.innerHTML = `
                <h3>${brewery.name}</h3>
                <p>${brewery.street || 'No address available'}, ${brewery.city}, ${brewery.state}</p>
                <a href="${brewery.website_url}" target="_blank" class="button is-link is-small">Visit Website</a><br/>`;
            if (brewery.phone) {
                const cleanedPhoneNumber = brewery.phone.replace(/\D/g, '');
                const formattedPhoneNumber = `(${cleanedPhoneNumber.slice(0, 3)}) ${cleanedPhoneNumber.slice(3, 6)}-${cleanedPhoneNumber.slice(6)}`;
                breweryDiv.innerHTML += `<strong>Phone Number:</strong> ${formattedPhoneNumber}<br/>`;
            } else {
                breweryDiv.innerHTML += `<strong>Phone Number:</strong> Not Available<br/>`;
            }
         
            resultsContainer.appendChild(breweryDiv);
        });
    }
});