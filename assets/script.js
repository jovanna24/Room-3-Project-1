//Add variables (global scope)

//Connect buttons to html counterparts
const openModalButton = document.getElementById('open-modal');
const closeButton = document.getElementById('modal-close');
const modalForm = document.getElementById('modal');

// Functions to open/close modal 
function openModal() {
    modalForm.classList.add('is-active');
}

function closeModal() {
    modalForm.classList.remove('is-active');
}

// Add event listener to openModalBtn
openModalButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);


// Function to create user interest object