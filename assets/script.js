// Grab elements from the DOM
const submitButton = document.getElementById('submit');
const postalCodeInput = document.getElementById('postalCodeInput');
const breweryInfoContainer = document.getElementById('search-brewery-info');

// Initialize the map variable globally
let myMap;

// Add event listener to the search button
submitButton.addEventListener('click', function () {
    const zipCode = postalCodeInput.value.trim();
    if (!zipCode) {
        alert("Please enter a valid ZIP code.");
        return;
    }
    fetchLocationData(zipCode);
});

// Function to fetch location data from Radar API
function fetchLocationData(zipCode) {
    const apiKey = 'prj_test_pk_46aed3ba8dcbae2e29b726476e62a678b9f18148'; //  Radar API key
    fetch(`https://api.radar.io/v1/geocode/forward?query=${zipCode}`, {
        headers: {
            Authorization: apiKey
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (data.addresses.length === 0) throw new Error('No location found');
        const coords = data.addresses[0];
        displayMap(coords.latitude, coords.longitude);
        searchBreweryApi(zipCode);
    })
    .catch(error => {
        console.error('Error fetching location data:', error);
        alert('Failed to retrieve location data. Please try again.');
    });
}

// Function to display the map using Leaflet
function displayMap(latitude, longitude) {
    if (myMap) myMap.remove(); // Remove previous map instance if exists
    myMap = L.map('map').setView([latitude, longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(myMap);
    L.marker([latitude, longitude]).addTo(myMap)
        .bindPopup('You are here!').openPopup();
}

// Function to fetch brewery data from the Open Brewery DB API
function searchBreweryApi(zipCode) {
    fetch(`https://api.openbrewerydb.org/breweries?by_postal=${zipCode}`)
    .then(response => response.json())
    .then(breweries => {
        displayBreweries(breweries);
    })
    .catch(error => {
        console.error('Error fetching breweries:', error);
        breweryInfoContainer.innerHTML = '<p>Failed to retrieve brewery information.</p>';
    });
}

// Function to display breweries information
function displayBreweries(breweries) {
    breweryInfoContainer.innerHTML = ''; // Clear previous results
    if (breweries.length === 0) {
        breweryInfoContainer.innerHTML = '<p>No breweries found in this area.</p>';
        return;
    }
    breweries.forEach(brewery => {
        const element = document.createElement('div');
        element.innerHTML = `<h3>${brewery.name}</h3><p>${brewery.street}, ${brewery.city}, ${brewery.state}</p>`;
        breweryInfoContainer.appendChild(element);
    });
}
