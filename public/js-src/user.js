const frontPageCreateUserButton = document.querySelector('#front-create-user');
const backdropElement = document.querySelector('#backdrop');

// Create user modal elements here:
const userModalElement = document.querySelector('#create-user-modal');
const modalCreateUserButton = document.querySelector('#create-user');
const modalCancelCreateUserButton = document.querySelector('#create-user-cancel');
const modalCreateUserUsernameInput = document.querySelector('#create-user-modal #username');
const modalCreatedUserEmailInput = document.querySelector('#create-user-modal #email');
const modalCreateUserPasswordInput = document.querySelector('#create-user-modal #password');
const modalCreateUserBirthdateInput = document.querySelector('#create-user-modal #date-of-birth');

frontPageCreateUserButton.addEventListener('click', toggleCreateUserModal);
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

function toggleCreateUserModal() {
    modalCreateUserUsernameInput.value = '';
    modalCreateUserPasswordInput.value = '';
    userModalElement.classList.toggle('hidden');
    backdropElement.classList.toggle('hidden');
}