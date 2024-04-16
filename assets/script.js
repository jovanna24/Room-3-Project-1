// Add variables (global scope)
const userInterestsForm = document.getElementById('userInterestsForm')
const selection = document.querySelectorAll('select');
const locationInput = document.getElementById('location');
let map, marker;

// Global variables for DOM elements
const openModalButton = document.getElementById('open-modal');
const closeButton = document.getElementById('modal-close');
const modalForm = document.getElementById('modal');
const submitSearch = document.getElementById('submit');

// Add event listeners
document.addEventListener('DOMContentLoaded', function () {
    userInterestsForm.addEventListener('submit', handleFormSubmit);
    submitSearch.addEventListener('submit', saveSearchtoLocalStorage);
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

// Function to save search to local storage
function saveSearchtoLocalStorage(search) {
    console.log(search);
}

function handleFormSubmit(event) {
    event.preventDefault();

    const searchThis = {
        category: selection.value,
        location: locationInput.value,
    }
    // Show the map
    updateMapLocation(location);
    // Set current search as an obj string
    setSearchInLocalStorage(searchThis);
    // Close modal after submission
    closeModal();
}

// Function to set up localStorage
function setSearchInLocalStorage(search) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(search))
}
// Retrieve search object
function getSearchFromLocalStorage() {
    const searchString = localStorage.getItem(SAVE_KEY);
    return searchString ? JSON.parse(searchString) : [];
}

// Function to fetch & show requested location
function updateMapLocation(zip) {
    fetch(`https://api.radar.io/v1/geocode/forward?query=${zip}`, {
        headers: {
            // Input publishable key here
            'Authorization': 'prj_live_pk_e64bd1419252c5a7a6a4621aa58ae2e6db9a297e'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.addresses && data.addresses.length > 0) {
                const coords = [data.addresses[0].latitude, data.addresses[0].longitude];
                if (!map) {
                    // Initialize map if not already initialized
                    initMap(coords);
                } else {
                    // Set map view to new coordinates
                    map.setView(coords, 13);
                }
                if (marker) {
                    // Update marker position
                    marker.setLatLng(coords);
                } else {
                    // Add new marker
                    marker = L.marker(coords).addTo(map);
                }
                // Show the map
                document.getElementById('map').style.display = 'block';
            } else {
                alert('No results found.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to retrieve location data');
        });
}

function initMap(coords) {
    map = L.map('map').setView(coords, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    marker = L.marker(coords).addTo(map);
}

// Function to save selected organizations to local storage
function savedOrgs

// Function to search nonprofits using value given per category
// Limit results to 10 per page
function searchAPI(organization) {
  const publicaAPI = `https://projects.propublica.org/nonprofits/api/v2`;

  fetch(publicaAPI) 
      .then(function(response){
          if (!response.ok) {
              throw new Error('Server response was not ok.');
          } 
          return response.json(); 
      })
      .then(function(organization){
          console.log(organization); 
          displayOrganization(organization); 
      }) 
      .catch(function(error){
          console.log('Error fetching data', error); 
          resultContentEl.innerHTML = '<h3> Error fetching data, please try new search. </h3>';

      })
}

function displayOrganization(organization) {
  if(!organization.name) {
      console.log('No results found.'); 
      resultContentEl.innerHTML = '<h3> Error fetching data, please try new search. </h3>';
  } else {
      resultContentEl.innerHTML= ''; 

      const resultCard = document.createElement('div'); 

      const resultBody = document.createElement('div'); 
      resultCard.append(resultBody); 

      const bodyContentEl = document.createElement('p');
      bodyContentEl.innerHTML +=
      `<strong>Organization Name: </strong> ${organization.sub_name}<br/>` +
      `<strong>Organization Address: </strong> ${organization.address}<br/>` +
      `<strong>Organization City: </strong> ${organization.city}<br/>` +

      resultContentEl.append(resultCard);

  }
}
}