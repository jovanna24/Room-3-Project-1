// This code listens for the entire content of the web page to load before running.
document.addEventListener('DOMContentLoaded', function () {
    // Grabbing elements from the HTML document by their ID or class
    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('open-modal');
    const closeModalButton = document.querySelector('.modal-close');
    const userInterestsForm = document.getElementById('userInterestsForm');
    const resultsContainer = document.getElementById('search-brewery-info');
    let myMap; // Variable to store the map object

    // Function to initialize and display the map
    function initMap(lat, lng) {
        // Check if a map already exists and remove it to prevent multiple maps from initializing
        if (myMap) myMap.remove();

        // Create a new map and set its view to the given latitude and longitude
        myMap = L.map('map').setView([lat, lng], 13);
        // Add OpenStreetMap tiles to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(myMap);
    }

    // Event listener for opening the modal when the "Open Form" button is clicked
    openModalButton.addEventListener('click', function() {
        modal.classList.add('is-active');
    });

    // Event listener for closing the modal when the close button is clicked
    closeModalButton.addEventListener('click', function() {
        modal.classList.remove('is-active');
    });

    // Event listener for form submission
    userInterestsForm.addEventListener('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get values from the form inputs, trimming any extra whitespace
        const postalCode = document.getElementById('postalCodeInput').value.trim();
        const distance = document.getElementById('distanceInput').value.trim();

        // Check if both fields have values before proceeding
        if (!postalCode || !distance) {
            alert('Please input both your zipcode and distance.');
            return;
        }

        // Fetch location and display breweries if valid input is provided
        fetchLocationAndDisplayBreweries(postalCode, distance);
        modal.classList.remove('is-active'); // Close the modal after submission
    });

    // Function to fetch location data and breweries based on user input
    function fetchLocationAndDisplayBreweries(zipcode, distance) {
        const apiKey = 'prj_test_pk_46aed3ba8dcbae2e29b726476e62a678b9f18148'; 
        // Fetching geographical data from Radar using the provided zipcode
        fetch(`https://api.radar.io/v1/geocode/forward?query=${zipcode}`, {
            headers: { Authorization: apiKey }
        })
        .then(response => response.json())
        .then(data => {
            if (data.addresses && data.addresses.length > 0) {
                const { latitude, longitude } = data.addresses[0];
                initMap(latitude, longitude); // Initialize the map with these coordinates
                searchBreweryApi(zipcode, distance, latitude, longitude); // Fetch breweries using these coordinates
            } else {
                alert('Failed to retrieve location data.');
            }
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
            alert('Error fetching location data.');
        });
    }

    // Function to fetch brewery data from the Open Brewery DB API
    function searchBreweryApi(zipcode, distance, lat, lng) {
        const breweryURL = `https://api.openbrewerydb.org/breweries?by_dist=${lat},${lng}&per_page=10`;

        fetch(breweryURL)
            .then(response => response.json())
            .then(breweries => {
                displayBreweries(breweries); // Display fetched breweries in the web page
            })
            .catch(error => {
                console.error('Error fetching breweries:', error);
                alert('Error fetching breweries data.');
            });
    }

    // Function to display breweries in the HTML document
    function displayBreweries(breweries) {
        resultsContainer.innerHTML = ''; // Clear any existing content

        if (breweries.length === 0) {
            resultsContainer.innerHTML = '<p>No breweries found in this area.</p>';
            return;
        }

        breweries.forEach(brewery => {
            const breweryDiv = document.createElement('div');
            breweryDiv.classList.add('box'); // Styling the display box using Bulma CSS
            breweryDiv.innerHTML = `
                <h3>${brewery.name}</h3>
                <p>${brewery.street || 'No address available'}, ${brewery.city}, ${brewery.state}</p>
                <a href="${brewery.website_url}" target="_blank" class="button is-link is-small">Visit Website</a>
            `;
            resultsContainer.appendChild(breweryDiv);
        });
    }
});
