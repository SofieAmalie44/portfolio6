const cafeUl = document.querySelector('.cafes ul');

const spanPriceLevel = document.createElement('span');

function fetchCafes() {
    cafeUl.innerHTML = '';
    // fetch filter options <!-- TODO: Load this dynamically -->
    const priceLevelSelect = document.querySelector("#price-level");
    const noiseLevelSelect = document.querySelector("#noise-level");
    const wifiAvailableSelect = document.querySelector("#wifi-available");
    const foodAvailableSelect = document.querySelector("#food-available");
    const locationAreaSelect = document.querySelector("#location");
    const showFavoritesSelect = document.querySelector("#showFavorites");

    const cafeUrl = new URL('http:/localhost:8080/cafe');

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

    fetch(cafeUrl)
        .then(response => response.json())
        .then(cafeArray => {

            if (cafeArray.length === 0) {
                const noCafeFoundMessage = document.createElement('span');
                noCafeFoundMessage.setAttribute('id', 'noCafeFoundMessage');
                cafeUl.appendChild(noCafeFoundMessage);
                noCafeFoundMessage.innerText = "I'm sorry, there is no cafe found with the selected filters. Please try again!";
                console.log(noCafeFoundMessage);
                return;
            }

            console.log(cafeArray)
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
                const avaliableWifiLI = document.createElement('li');
                const offersFoodLI = document.createElement('li');
                const locationLi = document.createElement('li');
                const descriptionBox = document.createElement("span");
                descriptionBox.setAttribute("class", "descriptionSpan");
                const likeButton = document.createElement('button');
                likeButton.setAttribute('class', 'likeButton');
                const favoriteAttribute = document.createElement('span');
                favoriteAttribute.setAttribute("id", "favoriteAttribute_" + cafeObject.cafe_id);
                const favoriteNumber = document.createElement('span');
                favoriteNumber.setAttribute('id', 'favoriteNumber_' + cafeObject.cafe_id);
                const viewDetailsButton = document.createElement("button");
                viewDetailsButton.setAttribute("class", "viewDetailsButton");
                const cafeDetails = document.createElement("div");
                cafeDetails.setAttribute('id', 'cafeDetails_' + cafeObject.cafe_id);

                spanHeader.innerText = cafeObject.cafe_name
                priceLevelLI.innerText = cafeObject.price_level;
                noiseLevelLI.innerText = "Noise level: " + cafeObject.noise_level;
                avaliableWifiLI.innerText = cafeObject.avaliable_wifi;
                offersFoodLI.innerText = cafeObject.offer_food;
                locationLi.innerText = "Location: " + cafeObject.area;
                descriptionBox.innerText = cafeObject.description;
                favoriteAttribute.innerText = "♥️";
                favoriteNumber.innerText = cafeObject.favorite_count;
                viewDetailsButton.innerText = "View details";


                if (cafeObject.available_wifi === 1) {
                    avaliableWifiLI.innerText = `WIFI: ${checkEmoji}`;
                } else {
                    avaliableWifiLI.innerText = `WIFI: ${errorEmoji}`;
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


                console.log(noiseLevelLI)
                console.log(avaliableWifiLI)
                console.log(offersFoodLI)
                console.log(locationLi)

                cafeDetails.appendChild(attributeUl);
                cafeLi.appendChild(spanHeader);
                spanHeader.appendChild(likeButton);
                likeButton.appendChild(favoriteAttribute);
                spanHeader.appendChild(favoriteNumber);
                attributeUl.appendChild(priceLevelLI);
                attributeUl.appendChild(noiseLevelLI);
                attributeUl.appendChild(avaliableWifiLI);
                attributeUl.appendChild((offersFoodLI));
                attributeUl.appendChild(locationLi)
                cafeLi.appendChild(descriptionBox);
                cafeLi.appendChild(viewDetailsButton);
                cafeLi.appendChild(cafeDetails);
                cafeUl.appendChild(cafeLi);


                viewDetailsButton.addEventListener('click', showCafeDetails);
                viewDetailsButton.cafeIdParam = cafeObject.cafe_id;
                cafeDetails.style.display = 'none';

                likeButton.addEventListener('click', createNewLike)
                likeButton.cafeIdParam = cafeObject.cafe_id;

            });
            updateWithFavorites()
        });
}

// when logged in we are showing witch cafes are your favorites
function updateWithFavorites() {
    if (favorites) {
        favorites.forEach(fav => {
            const favoriteAttribute = document.querySelector("#favoriteAttribute_" + fav.cafe_id);
            if (favoriteAttribute) {
                favoriteAttribute.innerText = "🎉"
            }
        })
    }

}

async function createNewLike(event) {
    if(!user) {
        console.log('User not logged in!');
        return;
    }

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
            console.error('Unhandled error:', error);
        return Promise.reject(response.status);
    })


    const likes = await likeResponse.json();

    const favoriteAttribute = document.querySelector("#favoriteAttribute_" + cafeId);
    if (favoriteAttribute) {
        favoriteAttribute.innerText = "🎉"
    }
    const favoriteNumber = document.querySelector("#favoriteNumber_" + cafeId);
    if (favoriteNumber) {
        favoriteNumber.innerText =  likes[0].count_all;
    }
}

/***********************************************************/
////////////// Cafe details drop down //////////////////////
/*********************************************************/
async function showCafeDetails(event) {
    console.log("cafe clicked");
    const cafeId = event.currentTarget.cafeIdParam;
    console.log("Fetching cafeId:" + cafeId);

    const cafeDetails = document.querySelector("#cafeDetails_" + cafeId);

    // Toggle cafeDetails display
    if (cafeDetails.style.display === 'block') {
        cafeDetails.style.display = 'none';
    } else {
        cafeDetails.style.display = 'block';
    }
}





