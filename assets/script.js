//Add variables (global scope)
const selection = document.querySelectorAll('select');
const zipCode = document.getElementById('location');

//Connect buttons to html counterparts
const openModalButton = document.getElementById('open-modal');
const closeButton = document.getElementById('modal-close');
const modalForm = document.getElementById('modal');
const submitSearch = document.getElementById('submit');

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
        category: selection,
        location: zipCode.trim(),
    }

    console.log(searchThis);

    setSearchInLocalStorage(searchThis);
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

// Add event listeners
openModalButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);
submitSearch.addEventListener('submit', handleFormSubmit);