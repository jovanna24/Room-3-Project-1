document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('open-modal');
    const closeModalButton = document.querySelector('.modal-close');
    const userInterestsForm = document.getElementById('userInterestsForm'); // Updated ID
    const resultsContainer = document.getElementById('search-brewery-info');
    let myMap;

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3958.8;
        const lat1Rad = lat1 * Math.PI / 180; 
        const lon1Rad = lon1 * Math.PI / 180; 
        const lat2Rad = lat2 * Math.PI / 180; 
        const lon2Rad = lon2 * Math.PI / 180; 
        const dLat = lat2Rad - lat1Rad;
        const dLon = lon2Rad - lon1Rad;
        const a = Math.pow(Math.sin(dLat / 2), 2) + 
                  Math.pow(Math.sin(dLon / 2), 2) * 
                  Math.cos(lat1Rad) * 
                  Math.cos(lat2Rad);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }

    function initMap(lat, lng) {
        if (myMap) myMap.remove(); 

        myMap = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(myMap);
    }

    function removeMap() {
        if (myMap) {
            myMap.remove();
            myMap = null;
        }
    }

    openModalButton.addEventListener('click', function () {
        modal.classList.add('is-active');
        removeMap();
    });

    closeModalButton.addEventListener('click', function () {
        modal.classList.remove('is-active');
    });

    userInterestsForm.addEventListener('submit', function (event) { // Updated ID
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
        const apiKey = 'prj_test_pk_46aed3ba8dcbae2e29b726476e62a678b9f18148'; 
        fetch(`https://api.radar.io/v1/geocode/forward?query=${zipcode}`, {
            headers: { Authorization: apiKey }
        })
        .then(response => response.json())
        .then(data => {
            if (data.addresses && data.addresses.length > 0) {
                const { latitude, longitude } = data.addresses[0];
                initMap(latitude, longitude); 
                searchBreweryApi(zipcode, distance, latitude, longitude); 
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

    function saveResultToStorage(zipcode) {
        let results = readResultsFromStorage();
     
     
        if (results.indexOf(zipcode)=== -1) {
            results.push(zipcode);
            localStorage.setItem('results', JSON.stringify(results));
            console.log(zipcode + ' New postal code stored.');
        } else {
            console.log(zipcode + ' Postal code already exists.');
        }
     }
     
     
     // Retrieve search string
     function readResultsFromStorage () {
        let results = JSON.parse(localStorage.getItem('results'));
        if (!results) {
            results = [];
        }
        return results;
     }

     function displaySavedSearches () {
        const results = readResultsFromStorage();
        const savedZipcodeList = document.querySelector('#zip-results');
   
        savedZipcodeList.innerHTML = '';
   
        results.forEach(zipcode => {
            const button = document.createElement('button');
            button.classList.add('btn', 'active');
            button.textContent= `Previous searches: ${zipcode}`;
   
            button.addEventListener('click', ()=>{
                searchBreweryApi(zipcode);
                fetchLocationAndDisplayBreweries(zipcode);
                //displayBreweries(zipcode);
            });
   
            savedZipcodeList.appendChild(button);
        });
    }
 

     displaySavedSearches();

    function displayBreweries(breweries, userLatitude, userLongitude) {
        resultsContainer.innerHTML = '';

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
                    <p>Est. Distance: ${distance.toFixed(2)} miles</p>
                    <a href="${brewery.website_url}" target="_blank" class="button is-link is-small">Visit Website</a>
                `;
                if (brewery.phone) {
                    const cleanedPhoneNumber = brewery.phone.replace(/\D/g, '');
                    const formattedPhoneNumber = `(${cleanedPhoneNumber.slice(0, 3)}) ${cleanedPhoneNumber.slice(3, 6)}-${cleanedPhoneNumber.slice(6)}`;
                    breweryDiv.innerHTML += `<p>Phone Number: ${formattedPhoneNumber}</p>`;
                } else {
                    breweryDiv.innerHTML += `<p>Phone Number: Not Available</p>`;
                }
             
                resultsContainer.appendChild(breweryDiv);

                // Add marker for the brewery on the map
                const breweryLatLng = L.latLng(brewery.latitude, brewery.longitude);
                const breweryMarker = L.marker(breweryLatLng).addTo(myMap);
                breweryMarker.bindPopup(`<b> ${brewery.name}</b><br>${brewery.city}, ${brewery.state}`).openPopup();
            }
        });
    }
});