// Global variables for DOM elements
const openModalButton = document.getElementById('open-modal');
const closeButton = document.getElementById('modal-close');
const modalForm = document.getElementById('modal');
const locationInputModal = document.getElementById('locationInput');
const locationInput = document.getElementById('location');
const resultsContainer = document.getElementById('search-brewery-info');
// Create variable to store map object
let myMap;

// Add event listeners
document.addEventListener('DOMContentLoaded', function () {
    openModalButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    locationInputModal.addEventListener('submit', handleFormSubmit);
});

// Functions to open/close modal 
function openModal() {
    modalForm.classList.add('is-active');
}

function closeModal() {
    modalForm.classList.remove('is-active');
}

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

// Function to store zipcode input for use with APIs
function handleFormSubmit(event) {
    // Prevent form from default clear
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

    // Close modal after submission
    closeModal();
}

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


// // Function to search for breweries using API
// function searchBreweryAPI(zipcode) {
//     const breweryURL = `https://api.openbrewerydb.org/v1/breweries?q=${zipcode}`;

//     fetch(breweryURL)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok.');
//             }
//             return response.json();
//         })
//         .then(breweryData => {
//             // Sanity check
//             console.log('Brewery Data:', breweryData);
//             // Throw error message if no data to return
//             if (!breweryData || breweryData.length === 0) {
//                 console.log('No results found.');
//                 resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
//             } else {
//                 // empty element so that results fetched can fill
//                 resultContentEl.innerHTML = '';
//                 // loop through each to display info per brewery
//                 breweryData.forEach(brewery => {
//                     displayBreweryInfo(brewery);
//                 });
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching data', error);
//         });
// }

// // Append brewery info to page
// function displayBreweryInfo(breweryObj) {
//     // Create new card element to display
//     const resultCard = document.createElement('div');
//     resultCard.classList.add('card');
//     // Append cards to body
//     const resultBody = document.createElement('div');
//     resultBody.classList.add('card-body');
//     resultCard.append(resultBody);
//     // Make name of brewery card title
//     const titleEl = document.createElement('h3');
//     titleEl.textContent = breweryObj.name;
//     // Create new <p> element to hold brewery address
//     const bodyContentEl = document.createElement('p');
//     bodyContentEl.innerHTML +=
//         `<strong>Address:</strong>${breweryObj.address_1}`;
//     // Create button to link brewery website
//     const linkButtonEl = document.createElement('a');
//     linkButtonEl.textContent = 'Read More';
//     linkButtonEl.setAttribute('href', breweryObj.url);
//     linkButtonEl.classList.add('btn', 'btn-dark');
//     // Append brewery name, info, and button containing link
//     resultBody.append(titleEl, bodyContentEl, linkButtonEl);
//     // Append result cards to designated element
//     resultContentEl.append(resultCard);
//     // Sanity check: confirm obj exists
//     console.log('Brewery Object:', breweryObj);
// }


// // Function to set up string in localStorage
// function saveResultToStorage(zipcode) {
//     let results = readResultsFromStorage();

//     if (results.indexOf(zipcode) === -1) {
//         results.push(zipcode);
//         localStorage.setItem('results', JSON.stringify(results));
//         console.log(zipcode + ' New postal code stored.');
//     } else {
//         console.log(zipcode + ' Postal code already exists.');
//     }
// }

// // Retrieve search string
// function readResultsFromStorage() {
//     let results = JSON.parse(localStorage.getItem('results'));
//     if (!results) {
//         results = [];
//     }
//     return results;
// }


// function displaySavedSearches() {
//     // retrieve zipcodes searched
//     const results = readResultsFromStorage();
//     // set var for container where results will display
//     const savedZipcodeList = document.querySelector('#zip-results');
//     // clear any existing content
//     savedZipcodeList.innerHTML = '';
//     // loop through results array,
//     results.forEach(zipcode => {
//         // creating a new button for each
//         const button = document.createElement('button');
//         button.classList.add('btn', 'active');
//         button.textContent = zipcode;
//         // when btn is clicked, fetch breweries function is called
//         button.addEventListener('click', () => {
//             searchBreweryAPI(zipcode);
//         });
//         // append btn to results found in container specified
//         savedZipcodeList.appendChild(button);
//     });
// }