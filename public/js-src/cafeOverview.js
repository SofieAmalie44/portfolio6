// Selecting html elements
const cafeUl = document.querySelector('.cafes ul');
const loadingScreen = document.querySelector('#loading-screen')

// Function that returns the selected filters and returns cafes
function fetchCafes() {
    cafeUl.innerHTML = '';
    // fetch filter options <!-- TODO: Load this dynamically -->

    // Selecting all filters from html
    const priceLevelSelect = document.querySelector("#price-level");
    const noiseLevelSelect = document.querySelector("#noise-level");
    const wifiAvailableSelect = document.querySelector("#wifi-available");
    const foodAvailableSelect = document.querySelector("#food-available");
    const locationAreaSelect = document.querySelector("#location");
    const showFavoritesSelect = document.querySelector("#showFavorites");


// created new URL which makes it very reliable way to parse the URL into the variable cafeUrl
    const cafeUrl = new URL('http:/localhost:8080/cafe');

    // Choosing all the input elements and checking if they are not undefined/null
    // cafeURL is the endpoint and the searchParams provides access to the query parameters
    // and makes sure the values selected by the user is added
    if (priceLevelSelect.value)
        cafeUrl.searchParams.append('priceLevel', priceLevelSelect.value);
    if (noiseLevelSelect.value)
        cafeUrl.searchParams.append('noiseLevel', noiseLevelSelect.value);
    if (wifiAvailableSelect.value)
        cafeUrl.searchParams.append('wifiAvailable', wifiAvailableSelect.value);
    if (foodAvailableSelect.value)
        cafeUrl.searchParams.append('foodAvailable', foodAvailableSelect.value);
    if (locationAreaSelect.value)
        cafeUrl.searchParams.append('locationArea', locationAreaSelect.value);
    if (user && showFavoritesSelect.value) {
        cafeUrl.searchParams.append('userId', user.user_id);
        cafeUrl.searchParams.append('favoritesFilter', showFavoritesSelect.value);
    }

    // fetching the /cafe endpoint which returns array of cafes pending on the filters chosen

    fetch(cafeUrl)
        .then(response => response.json())
        .then(cafeArray => {

            // if no cafes found, returns message
            if (cafeArray.length === 0) {
                const noCafeFoundMessage = document.createElement('span');
                noCafeFoundMessage.setAttribute('id', 'noCafeFoundMessage');
                cafeUl.appendChild(noCafeFoundMessage);
                noCafeFoundMessage.innerText = "Sorry, there is no cafe found with the selected filters. Please try again!";
                console.log(noCafeFoundMessage);
                return;
            }

            console.log(cafeArray)

            // forEach that itterates through the cafes and checks is the following elements are available
            cafeArray.forEach(cafeObject => {

                const checkEmoji = "✅"
                const errorEmoji = "❌"

                const cafeLi = document.createElement('li');
                cafeLi.setAttribute("class", "cafeLi");
                const spanHeader = document.createElement('span');
                spanHeader.setAttribute("id", "spanCafeName");

                const attributeUl = document.createElement('ul');
                const priceLevelLI = document.createElement('li');
                const noiseLevelLI = document.createElement('li');
                const availableWifiLI = document.createElement('li');
                const offersFoodLI = document.createElement('li');
                const locationLi = document.createElement('li');
                const descriptionBox = document.createElement("span");
                descriptionBox.setAttribute("class", "descriptionSpan");
                const likeButton = document.createElement('button');
                likeButton.setAttribute('class', 'likeButton');
                likeButton.setAttribute("id", "likeButton_" + cafeObject.cafe_id);
                //const favoriteAttribute = document.createElement('span');
                //favoriteAttribute.setAttribute("id", "favoriteAttribute_" + cafeObject.cafe_id);
                //favoriteAttribute.setAttribute('class', 'favoriteAttribute');
                const favoriteNumber = document.createElement('span');
                favoriteNumber.setAttribute('id', 'favoriteNumber_' + cafeObject.cafe_id);
                favoriteNumber.setAttribute('class', 'favoriteNumber');
                const viewDetailsButton = document.createElement("button");
                viewDetailsButton.setAttribute("class", "viewDetailsButton");
                const cafeDetails = document.createElement("div");
                cafeDetails.setAttribute('id', 'cafeDetails_' + cafeObject.cafe_id);

                spanHeader.innerText = cafeObject.cafe_name
                priceLevelLI.innerText = cafeObject.price_level;
                noiseLevelLI.innerText = "Noise level: " + cafeObject.noise_level;
                availableWifiLI.innerText = cafeObject.avaliable_wifi;
                offersFoodLI.innerText = cafeObject.offer_food;
                locationLi.innerText = "Location: " + cafeObject.area;
                descriptionBox.innerText = cafeObject.description;
                //favoriteAttribute.innerText = "♡";
                likeButton.innerText = "♡";
                favoriteNumber.innerText = cafeObject.favorite_count;
                viewDetailsButton.innerText = "View details";


                if (cafeObject.available_wifi === 1) {
                    availableWifiLI.innerText = `WIFI: ${checkEmoji}`;
                } else {
                    availableWifiLI.innerText = `WIFI: ${errorEmoji}`;
                }

                if (cafeObject.offer_food === 1) {
                    offersFoodLI.innerText = `Food availability: ${checkEmoji}`;
                } else {
                    offersFoodLI.innerText = `Food availability: ${errorEmoji}`;
                }


                if (cafeObject.price_level === "low") {
                    priceLevelLI.innerText = "Price level: $"
                } else if (cafeObject.price_level === "low-medium") {
                    priceLevelLI.innerText = "Price level: $$"
                } else if (cafeObject.price_level === "medium") {
                    priceLevelLI.innerText = "Price level: $$$"
                } else if (cafeObject.price_level === "medium-high") {
                    priceLevelLI.innerText = "Price level: $$$$"
                } else if (cafeObject.price_level === "high") {
                    priceLevelLI.innerText = "Price level: $$$$$"
                }


                cafeLi.appendChild(spanHeader);
                likeButton.appendChild(favoriteNumber);
                spanHeader.appendChild(likeButton);
                //likeButton.appendChild(favoriteAttribute);
                attributeUl.appendChild(priceLevelLI);
                attributeUl.appendChild(noiseLevelLI);
                attributeUl.appendChild(availableWifiLI);
                attributeUl.appendChild((offersFoodLI));
                attributeUl.appendChild(locationLi)
                cafeLi.appendChild(descriptionBox);
                cafeDetails.appendChild(attributeUl);
                cafeLi.appendChild(viewDetailsButton);
                cafeLi.appendChild(cafeDetails);
                cafeUl.appendChild(cafeLi);

                loadingScreen.style.display = 'none';

                viewDetailsButton.addEventListener('click', showCafeDetails);
                viewDetailsButton.cafeIdParam = cafeObject.cafe_id;
                cafeDetails.style.display = 'none';

                likeButton.addEventListener('click', createNewLike);
                likeButton.cafeIdParam = cafeObject.cafe_id;



            });
            // updates the favorites (likes) every filter search
            updateWithFavorites();
        });
}

/********************************************************************************************/
////////////// Updating favorite everytime making new request for cafes//////////////////////
/******************************************************************************************/

// when logged in we are showing witch cafes are your favorites
function updateWithFavorites() {
    if (favorites) {
        favorites.forEach(fav => {
            const favoriteNumber = document.querySelector("#favoriteNumber_" + fav.cafe_id);
            const likeButton = document.querySelector("#likeButton_" + fav.cafe_id);
            if (likeButton) {
                likeButton.innerText = "♥️"
                likeButton.appendChild(favoriteNumber);
                likeButton.addEventListener('click', unLike);
            }
        })
    }

}

/***********************************************************/
/////////////// Create new like event //////////////////////
/*********************************************************/

// async function that returns console message if no user_id found
async function createNewLike(event) {
    if(!user) {
        console.log('User not logged in!');
        return;
    }

    // Fetching endpoint which post the like in the database and colors the empty heart red
    const cafeId = event.currentTarget.cafeIdParam;
    const likeResponse = await fetch("http://localhost:8080/favorites/new", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "cafeId": cafeId,
            "userId": user.user_id
        })
    }).catch(error => {
        console.error('Unhandled error:' + error);
        return Promise.reject(likeResponse.status);
    })

    // waiting for the response
    const likes = await likeResponse.json();

    // when response converted to json then change the favoriteNumber element to the new count_all value
    const favoriteNumber = document.querySelector("#favoriteNumber_" + cafeId);
    if (favoriteNumber) {
        favoriteNumber.innerText =  likes[0].count_all;
    }

    // eventListener that changes color of the likeButton and removes it again it clicked again
    const likeButton = document.querySelector("#likeButton_" + cafeId);
    if (likeButton) {
        likeButton.innerText = "♥️"
        likeButton.appendChild(favoriteNumber);
        likeButton.removeEventListener('click', createNewLike);
        likeButton.addEventListener('click', unLike);
    }
}

/***********************************************************/
////////////////// Un like cafe event //////////////////////
/*********************************************************/

// unLike function that makes sure user cant unLike unless logged in
async function unLike(event) {
    if(!user) {
        console.log('User not logged in!');
        return;
    }

    // fetching the endpoint that can delete a favorite (like) from the database
    const cafeId = event.currentTarget.cafeIdParam;
    const unlikeResponse = await fetch("http://localhost:8080/favorites/delete", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "cafeId": cafeId,
            "userId": user.user_id
        })
    }).catch(error => {
        console.error('Unhandled error:' + error);
        return Promise.reject(unlikeResponse.status);
    })

    // awaiting response
    const likes = await unlikeResponse.json();

    // changing the count_all number on page to the new lower number
    const favoriteNumber = document.querySelector("#favoriteNumber_" + cafeId);
    if (favoriteNumber) {
        favoriteNumber.innerText =  likes[0].count_all;
    }

    // changing the likeButton back to un liked heart by removing event listener
    const likeButton = document.querySelector("#likeButton_" + cafeId);
    if (likeButton) {
        likeButton.innerText = "♡";
        likeButton.appendChild(favoriteNumber);
        likeButton.removeEventListener('click', unLike);
        likeButton.addEventListener('click', createNewLike);
    }
}

/***********************************************************/
////////////// Cafe details drop down //////////////////////
/*********************************************************/

// function that shows the cafe details through param cafe_id called in click event listener
async function showCafeDetails(event) {
    console.log("cafe clicked");
    const cafeId = event.currentTarget.cafeIdParam;
    console.log("Fetching cafeId:" + cafeId);

    const cafeDetails = document.querySelector("#cafeDetails_" + cafeId);

    // Toggle none/block cafeDetails display
    if (cafeDetails.style.display === 'block') {
        cafeDetails.style.display = 'none';
    } else {
        cafeDetails.style.display = 'block';
    }
}





