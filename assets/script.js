// Global variables for DOM elements
const openModalButton = document.getElementById('open-modal');
const closeButton = document.getElementById('modal-close');
const modalForm = document.getElementById('modal');
const userInterestsForm = document.getElementById('userInterestsForm');
const locationInput = document.getElementById('location');
let map, marker;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Leaflet map on page load
    map = L.map('map').setView([40.7128, -74.0060], 13);  // Default location (New York)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    marker = L.marker([40.7128, -74.0060]).addTo(map);

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
    const selectedOptions = Array.from(userInterestsForm.querySelector('select').selectedOptions).map(option => option.value);
    const location = locationInput.value;
    console.log('Selected Categories:', selectedOptions);
    console.log('Location:', location);
    updateMapLocation(location);
    closeModal();
}

function updateMapLocation(zip) {
    fetch(`https://api.radar.io/v1/geocode/forward?query=${zip}`, {
        headers: {
            'Authorization': 'prj_live_pk_e64bd1419252c5a7a6a4621aa58ae2e6db9a297e'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.addresses && data.addresses.length > 0) {
            const coords = [data.addresses[0].latitude, data.addresses[0].longitude];
            map.setView(coords, 13);
            marker.setLatLng(coords);
        } else {
            alert('No results found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to retrieve location data');
    });
}
