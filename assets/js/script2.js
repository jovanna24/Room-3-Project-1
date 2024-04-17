// Add variables (global scope)
const userInterestsForm = document.getElementById('userInterestsForm')
const locationInput = document.getElementById('postalCodeInput');



// Global variables for DOM elements
const openModalButton = document.getElementById('open-modal');
const closeButton = document.getElementById('modal-close');
const modalForm = document.getElementById('modal');
const submitSearch = document.getElementById('submit');
const resultsListEl = document.getElementById('results');
const resultContentEl = document.getElementById('brewery-info');
const resultTextEl= document.getElementById('result-text');

// Add event listeners
document.addEventListener('DOMContentLoaded', function () {
    userInterestsForm.addEventListener('submit', handleFormSubmit);
    submitSearch.addEventListener('submit', saveResultToStorage);
    openModalButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
});

// Functions to open/close modal 
function openModal() {
    modalForm.classList.add('is-active');
}

function closeModal() {
    modalForm.classList.remove('is-active');
}

// On form submit, save search values for APIs
const SAVE_KEY = "search";

function handleFormSubmit(event) {
    event.preventDefault();

    const searchInputVal = document.querySelector('#postalCodeInput').value; 

    if (!searchInputVal) {
        console.error('Please input your zipcode.'); 
        return;
    }

    const zipcode = searchInputVal.trim(); 
    searchBreweryApi(zipcode); 
    getLocationData(zipcode);
    saveResultToStorage(zipcode);
    
    closeModal();
} 

function searchBreweryApi (zipcode) {
    const breweryURL = `https://api.openbrewerydb.org/v1/breweries?q=${zipcode}`;

    fetch(breweryURL) 
        .then(function(response) {
            if(!response.ok) {
                throw new Error(`Network response was not okay`);
            }
            return response.json();
        }) 
    .then(function(breweryData){
        console.log('Brewery Data:', breweryData); 

        if(!breweryData.length) {
            console.log('No results found.');
            resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        } else {
            resultContentEl.innerHTML= ''; 
            breweryData.forEach(brewery =>{
                displayBreweryInfo(brewery);
            });
        }
    })
        // .then(function(map) {
        //     console.log('Brewery Data:',map); 
        //     displayBreweryInfo(map);
        // })
        .catch(function(error) {
            console.error('Error fetching data:', error);
            resultContentEl.innerHTML = '<h3>Error fetching data. Please try again later.</h3>';
        });
}

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
        if (isNaN(lat) || isNaN(lng)) {
            throw new Error('Invalid latitude or longitude values');
        }
        return { latitude: lat, longitude: lng };
    })
    .then(function(coords){
        console.log('Location Coordinates:',coords); 
        displayLocationData(coords);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    });
} 


function displaySavedSearches () {
    const results = readResultsFromStorage(); 
    const savedZipcodeList = document.querySelector('#zip-results'); 

    savedZipcodeList.innerHTML = ''; 

    results.forEach(zipcode => {
        const button = document.createElement('button'); 
        button.classList.add('btn', 'active'); 
        button.textContent= zipcode;

        button.addEventListener('click', ()=>{
            searchBreweryApi(zipcode); 
            
        }); 

        savedZipcodeList.appendChild(button);
    });
}

function displayBreweryInfo(breweryObj){
    console.log(breweryObj); 

    const resultCard = document.createElement('div'); 
    resultCard.classList.add('card'); 

    const resultBody = document.createElement('div'); 
    resultBody.classList.add('card-body'); 
    resultCard.append(resultBody); 

    const titleEl= document.createElement('h3'); 
    titleEl.textContent= breweryObj.name;

    const bodyContentEl = document.createElement('p'); 
    bodyContentEl.innerHTML += 
        `<strong>Address:</strong>${breweryObj.address_1}`; 

    const linkButtonEl = document.createElement('a'); 
    linkButtonEl.textContent= 'Read More'; 
    linkButtonEl.setAttribute('href', breweryObj.url); 
    linkButtonEl.classList.add('btn', 'btn-dark'); 

    resultBody.append(titleEl, bodyContentEl, linkButtonEl); 

    resultContentEl.append(resultCard);

    console.log('Brewery Object:', breweryObj);
    
}

function displayLocationData(locationInfo) { 
    console.log(locationInfo); 

    document.getElementById('submit').addEventListener('click', (event) => {
        event.preventDefault();
        
        // Call getLocationData and handle the return
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

  };


// Function to set up string in localStorage
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


document.addEventListener('DOMContentLoaded', function(){
    displaySavedSearches();
});