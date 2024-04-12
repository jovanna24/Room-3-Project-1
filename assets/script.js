// Global variables for DOM elements
const openModalButton = document.getElementById('open-modal');
const closeButton = document.getElementById('modal-close');
const modalForm = document.getElementById('modal');
const userInterestsForm = document.getElementById('userInterestsForm');
const locationInput = document.getElementById('location');
let map, marker;

document.addEventListener('DOMContentLoaded', function() {
    // Event listeners
    openModalButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    userInterestsForm.addEventListener('submit', handleFormSubmit);
});

function openModal() {
    modalForm.classList.add('is-active');
}

function closeModal() {
    modalForm.classList.remove('is-active');
}

function handleFormSubmit(event) {
    event.preventDefault();
    const location = locationInput.value;
    updateMapLocation(location); // This function will handle showing the map
    closeModal(); // Close modal after submission
}

function updateMapLocation(zip) {
    fetch(`https://api.radar.io/v1/geocode/forward?query=${zip}`, {
        headers: {
            'Authorization': 'prj_live_pk_e64bd1419252c5a7a6a4621aa58ae2e6db9a297e' // Use your publishable key here
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.addresses && data.addresses.length > 0) {
            const coords = [data.addresses[0].latitude, data.addresses[0].longitude];
            if (!map) {
                initMap(coords); // Initialize map if not already initialized
            } else {
                map.setView(coords, 13); // Set map view to new coordinates
            }
            if (marker) {
                marker.setLatLng(coords); // Update marker position
            } else {
                marker = L.marker(coords).addTo(map); // Add new marker
            }
            document.getElementById('map').style.display = 'block'; // Show the map
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
