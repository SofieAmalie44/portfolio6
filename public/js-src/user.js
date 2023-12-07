const frontPageCreateUserButton = document.querySelector('#front-create-user');
const frontPageLogInUserButton = document.querySelector('#front-log-in');
const headerButtonsElement = document.querySelector('.header-buttons');
const profileButton = document.querySelector('#profile');

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
const modalLoginUsernameOrEmailInput = document.querySelector('#login-username-mail');
const modalLoginUserPasswordInput = document.querySelector('#login-password');
const modalLoginUserCreateUserButton = document.querySelector('#login-user-modal form button');

frontPageCreateUserButton.addEventListener('click', toggleCreateUserModal);
frontPageLogInUserButton.addEventListener('click', toggleLogInUserModal);
modalLoginUserButton.addEventListener('click', loginUser);
modalCancelLoginUserButton.addEventListener('click', toggleLogInUserModal);
modalCancelCreateUserButton.addEventListener('click', toggleCreateUserModal);
modalCreateUserButton.addEventListener('click', createNewUser);
modalCreateUserPasswordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        modalCreateUserButton.click();
    }
});
modalLoginUserCreateUserButton.addEventListener('click', () => {
    toggleLogInUserModal();
    toggleCreateUserModal();
})

modalLoginUserPasswordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        modalLoginUserButton.click();
    }
});

/***************************************************/
/***************************************************/
/***************************************************/

function createNewUser() {
    const username = modalCreateUserUsernameInput.value;
    const email = modalCreatedUserEmailInput.value;
    const birthDate = modalCreateUserBirthdateInput.value;
    // TODO: Password RegEx try catch
    const password = modalCreateUserPasswordInput.value;

    if(isValidCreateUserInput){
        return;
    }

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
            changeToLoggedIn();
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

function isValidCreateUserInput(username, email, birthDate, password) {
    if (isValidUsername(username) === false) {
        console.log('username should be between 8-100 characters')
    }

}

function isValidUsername(username) {
    const regexPatteren = /^[a-zA-Z0-9]+$/; // Only letters and numbers
    const isValidLength = username.length <= 8 && username.length <= 100;

    return regexPatteren.test(username) && isValidLength;
}

function isValidEmail(email) {

}

function loginUser() {
    const usernameOrEmail = modalLoginUsernameOrEmailInput.value;
    const password = modalLoginUserPasswordInput.value;

    fetch("/users/login", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "usernameOrEmail": usernameOrEmail,
            "password": password
        })
    }).then(response => {
        if (response.ok) {
            console.log('User logged in successfully');
            toggleLogInUserModal();
            changeToLoggedIn();
            // TODO: What to do after user logged in?
        } else {
            console.error('Something went wrong:', response.statusText);
            return Promise.reject(response.status); // Reject the promise with the status
        }
    }).catch(error => {
        if (error === 401) {
            console.log('username/email or password is incorrect');
            // TODO: Maybe switch to create user?
        } else {
            console.error('Unhandled error:', error);
        }
    });
}

function changeToLoggedIn() {
    toggleHeaderButtons();
    toggleProfileButton();
    // TODO: Add profile icon and functionality
}

function toggleProfileButton() {
    profileButton.classList.toggle('hidden')
}
function toggleHeaderButtons() {
    headerButtonsElement.classList.toggle('hidden');
}

function toggleCreateUserModal() {
    modalCreateUserUsernameInput.value = '';
    modalCreateUserPasswordInput.value = '';
    userModalElement.classList.toggle('hidden');
    userModalBackdropElement.classList.toggle('hidden');
}

function toggleLogInUserModal() {
    modalLoginUsernameOrEmailInput.value = '';
    modalLoginUserPasswordInput.value = '';
    loginModalElement.classList.toggle('hidden');
    loginModalBackdropElement.classList.toggle('hidden');
}