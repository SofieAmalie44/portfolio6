const frontPageCreateUserButton = document.querySelector('#front-create-user');
const frontPageLogInUserButton = document.querySelector('#front-log-in');
const headerButtonsElement = document.querySelector('.header-buttons');
const profile = document.querySelector("#profile");
const profileButton = document.querySelector('#profileButton');
const profileDetails = document.querySelector("#profile-details");

const favoritesFilter = document.querySelector(".showFavorites");

// Create user modal elements here:
const userModalElement = document.querySelector('#create-user-modal');
const userModalBackdropElement = document.querySelector('#create-backdrop');
const modalCreateUserButton = document.querySelector('#create-user');
const modalCancelCreateUserButton = document.querySelector('#create-user-cancel');
const modalCreateUserUsernameInput = document.querySelector('#create-username');
const modalCreatedUserEmailInput = document.querySelector('#create-email');
const modalCreateUserPasswordInput = document.querySelector('#create-password');
const modalCreateUserBirthdateInput = document.querySelector('#create-user-modal #date-of-birth');
const modalCreateUserUsernameLabel = document.querySelector('#create-user-modal form label');

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

profileButton.addEventListener("click", toggleProfileDetails)

let favorites = undefined;
let user = undefined;
/***************************************************/
/***************************************************/
/***************************************************/

function createNewUser() {
    const username = modalCreateUserUsernameInput.value;
    const email = modalCreatedUserEmailInput.value;
    const birthDate = modalCreateUserBirthdateInput.value;
    const password = modalCreateUserPasswordInput.value;

    if(!isValidCreateUserInput(username, email, birthDate, password)){
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
            modalCreateUserUsernameLabel.innerText = 'Username - name or email already in use';
        } else {
            console.error('Unhandled error:', error);
        }
    });
}

function isValidCreateUserInput(username, email, birthDate, password) {
    let hasError = false;

    if (!isValidUsername(username)) {
        displayInputfieldError(modalCreateUserUsernameInput, 'a-z, A-Z, 8-24 characters.');
        hasError = true;
    }

    if (!isValidEmail(email)) {
        displayInputfieldError(modalCreatedUserEmailInput, 'Invalid email format');
        hasError = true;
    }

    if (!isValidBirthDate(birthDate)) {
        displayInputfieldError(modalCreateUserBirthdateInput, 'Invalid birth date');
        hasError = true;
    }

    if (!isValidPassword(password)) {
        displayInputfieldError(modalCreateUserPasswordInput, '8 or more characters');
        hasError = true;
    }

    return !hasError;
}

function isValidUsername(username) {
    const regexPatteren = /^[a-zA-Z0-9]+$/; // allowed: a-z, A-Z, 0-9
    const isValidLength = username.length <= 8 && username.length <= 24;

    return !(regexPatteren.test(username) && isValidLength);
}

/**
Uppercase: (A-Z)
Lowercase: (a-z)
Digits: (0-9)
Characters: ! # $ % & ' * + - / = ? ^ _ ` { | } ~
Character: period or dot check
RegEx found here: https://www.w3resource.com/javascript/form/email-validation.php
*/
function isValidEmail(email) {
    const regexPatteren = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// reguler expression (testing if the email is valid
    return regexPatteren.test(email);
}

function isValidBirthDate(birthDate) {
    // TODO: what to check for here?
    return true;
}

function isValidPassword(password) {
    return password.length >= 8;
}

function displayInputfieldError(inputElement, errorMessage) {
    inputElement.value = '';
    inputElement.classList.add('error-inputfield');
    inputElement.placeholder = errorMessage;
}

async function fetchUserFavorites(user_id) {
    const favResponse = await fetch("http://localhost:8080/cafeFavorites/" + user_id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).catch(error => {
        console.error('Unhandled error:', error);
        return Promise.reject(response.status);
    });

    if (favResponse.ok) {
        favorites = await favResponse.json();
        console.log("Favorites:" + favorites);
    } else {
        console.error('Something went wrong:', userResponse.statusText);
    }
}

async function loginUser() {
    const usernameOrEmail = modalLoginUsernameOrEmailInput.value;
    const password = modalLoginUserPasswordInput.value;

    const userResponse = await fetch("http://localhost:8080/users/login", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "usernameOrEmail": usernameOrEmail,
            "password": password
        })
    }).catch(error => {
        if (error === 401) {
            console.log('username/email or password is incorrect');
        } else {
            console.error('Unhandled error:', error);
        }
        return Promise.reject(response.status);
    });

    // TODO: What to do after user logged in?

    if (userResponse.ok) {
        console.log('User logged in successfully');
        toggleLogInUserModal();
        changeToLoggedIn();
        toggleFilterFavorites();

        user = await userResponse.json();

        console.log("User: " + user.username);
        console.log("Email: " + user.email);
        console.log("Phone number: " + user.phone_number);
        console.log("Postal code" + user.postalcode);
        console.log("Birthday: " + user.date_of_birth);

        document.querySelector("#profile-user-name").innerHTML = user.username;
        document.querySelector("#profile-email").innerHTML = user.email;
        document.querySelector("#profile-phone-number").innerHTML = user.phone_number;
        document.querySelector("#profile-postal-code").innerHTML = user.postalcode;
        document.querySelector("#profile-date-of-birth").innerHTML = user.date_of_birth;
        await fetchUserFavorites(user.user_id);
        updateWithFavorites();
    } else {
        console.error('Something went wrong:', userResponse.statusText);
        alert("User does not exist. Try again");
    }

}

function changeToLoggedIn() {
    toggleHeaderButtons();
    toggleProfile();
}

function toggleProfile() {
    profile.classList.toggle('hidden');
}

function toggleFilterFavorites() {
    favoritesFilter.classList.toggle('hidden');
}

function toggleProfileDetails() {
    profileDetails.classList.toggle("hidden");
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