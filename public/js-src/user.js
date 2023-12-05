const frontPageCreateUserButton = document.querySelector('#front-create-user');
const backdropElement = document.querySelector('#backdrop');

// Create user modal elements here:
const userModalElement = document.querySelector('#create-user-modal');
const modalCreateUserButton = document.querySelector('#create-user');
const modalCancelCreateUserButton = document.querySelector('#create-user-cancel');
const modalCreateUserUsernameInput = document.querySelector('#create-user-modal #username');
const modalCreateUserPasswordInput = document.querySelector('#create-user-modal #password');

frontPageCreateUserButton.addEventListener('click', toggleCreateUserModal);
modalCancelCreateUserButton.addEventListener('click', toggleCreateUserModal);

function toggleCreateUserModal() {
    modalCreateUserUsernameInput.value = '';
    modalCreateUserPasswordInput.value = '';
    userModalElement.classList.toggle('hidden');
    backdropElement.classList.toggle('hidden');
}