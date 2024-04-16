// Add variables (global scope)
const userInterestsForm = document.getElementById('userInterestsForm')
const selection = document.querySelectorAll('select');
const locationInput = document.getElementById('postalCodeInput');
let map, marker;

// Global variables for DOM elements
const openModalButton = document.getElementById('open-modal');
const closeButton = document.getElementById('modal-close');
const modalForm = document.getElementById('modal');
const submitSearch = document.getElementById('submit');
const resultsListEl = document.getElementById('results');

// Add event listeners
document.addEventListener('DOMContentLoaded', function () {
    userInterestsForm.addEventListener('submit', handleFormSubmit);
    submitSearch.addEventListener('submit', setSearchInLocalStorage);
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

    const searchThis = {
        category: selection.value,
        location: locationInput.value
    };
    // Set current search as an obj string
    setSearchInLocalStorage(searchThis);
    // Call function to fetch organizations based on category from <select>
    // searchOrgs(searchThis.category);
    // Show the map
    // updateMapLocation(searchThis.location);
    // Close modal after submission
    closeModal();
}

// Function to set up string in localStorage
function setSearchInLocalStorage(search) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(search))
}
// Retrieve search string
function getSearchFromLocalStorage() {
    const searchString = localStorage.getItem(SAVE_KEY);
    return searchString ? JSON.parse(searchString) : [];
}

// Function to fetch organizations by selected category - limit # per page
function searchOrgs(category) {
    fetch(`https://projects.propublica.org/nonprofits/api/v2/search.json?q=propublica`, {
        method: "GET",
        headers: {
            'Content-type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                console.log('No results found.');
            } else {
                displayOrganization(data);
            }
        })
        .catch(error => {
            console.error('Error fetching data', error);
            resultsListEl.innerHTML = '<h3> Error fetching data, please try a new search. </h3>';
        });
}
// Display results list
function displayOrganization(organizations) {
    if (!organizations || organizations.length === 0) {
        console.log('No results found.');
        resultContentEl.innerHTML = '<h3> Error fetching data, please try new search. </h3>';
    } else {
        resultContentEl.innerHTML = '';
        // Create list to hold organizations
        const resultsList = document.createElement('ul');
        // Loop through results, creating a li for each
        organizations.forEach(organization => {
            const result = document.createElement('li');
            result.textContent = organization.name;
            // Append the list item to the list
            resultsList.appendChild(result);
            // Append list created to DOM element
            resultsListEl.appendChild(resultsList);
        })
    };
}

// Function to fetch location data