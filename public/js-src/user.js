const frontPageCreateUserButton = document.querySelector('#front-create-user');
const frontPageLogInUserButton = document.querySelector('#front-log-in');

// Create user modal elements here:
const userModalElement = document.querySelector('#create-user-modal');
const userModalBackdropElement = document.querySelector('#create-backdrop');
const modalCreateUserButton = document.querySelector('#create-user');
const modalCancelCreateUserButton = document.querySelector('#create-user-cancel');
const modalCreateUserUsernameInput = document.querySelector('#create-username');
const modalCreatedUserEmailInput = document.querySelector('#create-email');
const modalCreateUserPasswordInput = document.querySelector('#create-password');
const modalCreateUserBirthdateInput = document.querySelector('#create-user-modal #date-of-birth');

// Log in user modal elements here:
const loginModalElement = document.querySelector('#login-user-modal');
const loginModalBackdropElement = document.querySelector('#login-backdrop');
const modalLoginUserButton = document.querySelector('#login-user');
const modalCancelLoginUserButton = document.querySelector('#login-cancel');
const modalLoginUserNameInput = document.querySelector('#login-username-mail');
const modalLoginUserPasswordInput = document.querySelector('#login-password');

frontPageCreateUserButton.addEventListener('click', toggleCreateUserModal);
frontPageLogInUserButton.addEventListener('click', toggleLogInUserModal);
modalLoginUserButton.addEventListener('click', loginUser);
modalCancelLoginUserButton.addEventListener('click', toggleLogInUserModal);
modalCancelCreateUserButton.addEventListener('click', toggleCreateUserModal);
modalCreateUserButton.addEventListener('click', createNewUser);

function createNewUser() {
    const username = modalCreateUserUsernameInput.value;
    const email = modalCreatedUserEmailInput.value;
    const birthDate = modalCreateUserBirthdateInput.value;
    // TODO: Password RegEx try catch
    const password = modalCreateUserPasswordInput.value;

    fetch("/users/new", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "email": email,
            "birthDate": birthDate,
            "password": password
        })
    }).then(response => {
        if (response.ok) {
            console.log('User created successfully');
            toggleCreateUserModal();
            // TODO: What to do after user creation?
        } else {
            console.error('Something went wrong:', response.statusText);
            return Promise.reject(response.status); // Reject the promise with the status
        }
    }).catch(error => {
        if (error === 403) {
            console.log('User exists');
        } else {
            console.error('Unhandled error:', error);
        }
    });
}

function loginUser() {

}

function toggleCreateUserModal() {
    modalCreateUserUsernameInput.value = '';
    modalCreateUserPasswordInput.value = '';
    userModalElement.classList.toggle('hidden');
    userModalBackdropElement.classList.toggle('hidden');
}

function toggleLogInUserModal() {
    modalLoginUserNameInput.value = '';
    modalLoginUserPasswordInput.value = '';
    loginModalElement.classList.toggle('hidden');
    loginModalBackdropElement.classList.toggle('hidden');
}