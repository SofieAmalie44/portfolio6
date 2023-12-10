const cafeUl = document.querySelector('.cafes ul');

const spanPriceLevel = document.createElement('span');

function fetchCafes() {
    cafeUl.innerHTML = '';
    // fetch filter options <!-- TODO: Load this dynamically -->
    const priceLevelSelect = document.querySelector("#price-level");
    const noiseLevelSelect = document.querySelector("#noise-level");
    const wifiAvailableSelect = document.querySelector("#wifi-available");
    const foodAvailableSelect = document.querySelector("#food-available");

    const cafeUrl = new URL('http:/localhost:8080/cafe');

    if (priceLevelSelect.value)
        cafeUrl.searchParams.append('priceLevel', priceLevelSelect.value);
    if (noiseLevelSelect.value)
        cafeUrl.searchParams.append('noiseLevel', noiseLevelSelect.value);
    if (wifiAvailableSelect.value)
        cafeUrl.searchParams.append('wifiAvailable', wifiAvailableSelect.value);
    if (foodAvailableSelect.value)
        cafeUrl.searchParams.append('foodAvailable', foodAvailableSelect.value);



    fetch(cafeUrl)
        .then(response => response.json())
        .then(cafeArray => {
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
                const descriptionBox = document.createElement("span");
                descriptionBox.setAttribute("class", "descriptionSpan")
                const favoriteAttribute = document.createElement('span');
                favoriteAttribute.setAttribute("id", "favoriteAttribute");
                const viewDetailsButton = document.createElement("button");
                viewDetailsButton.setAttribute("class", "viewDetailsButton");
                const cafeDetails = document.createElement("div");
                cafeDetails.setAttribute('id', 'cafeDetails_' + cafeObject.cafe_id);

                spanHeader.innerText =  cafeObject.cafe_name
                priceLevelLI.innerText = cafeObject.price_level;
                noiseLevelLI.innerText = "Noise level: " + cafeObject.noise_level;
                avaliableWifiLI.innerText = cafeObject.avaliable_wifi;
                offersFoodLI.innerText = cafeObject.offer_food;
                descriptionBox.innerText = cafeObject.description;
                favoriteAttribute.innerText = "♥️"
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


                if (cafeObject.price_level === "low"){
                    priceLevelLI.innerText = "Price level: $"
                } else if (cafeObject.price_level === "low-medium"){
                    priceLevelLI.innerText = "Price level: $$"
                } else if (cafeObject.price_level === "medium"){
                    priceLevelLI.innerText = "Price level: $$$"
                } else if (cafeObject.price_level === "medium-high"){
                    priceLevelLI.innerText = "Price level: $$$$"
                } else if (cafeObject.price_level === "high") {
                    priceLevelLI.innerText = "Price level: $$$$$"
                }


                console.log(noiseLevelLI)
                console.log(avaliableWifiLI)
                console.log(offersFoodLI)


                cafeLi.appendChild(spanHeader);
                spanHeader.appendChild(favoriteAttribute);
                attributeUl.appendChild(priceLevelLI);
                attributeUl.appendChild(noiseLevelLI);
                attributeUl.appendChild(avaliableWifiLI);
                attributeUl.appendChild((offersFoodLI));
                cafeLi.appendChild(descriptionBox);
                cafeLi.appendChild(attributeUl);
                cafeLi.appendChild(viewDetailsButton);
                cafeUl.appendChild(cafeLi);
                cafeUl.appendChild(cafeDetails);
                viewDetailsButton.addEventListener('click', fetchCafeDetails);
                viewDetailsButton.cafeIdParam = cafeObject.cafe_id;
            });
        });
}

async function fetchCafeDetails(event) {
    const cafeId = event.currentTarget.cafeIdParam;
    console.log("Fetching cafeId:" + cafeId);
    const cafeDetails = document.querySelector("#cafeDetails_" + cafeId);

    const cafeResponse = await fetch("http://localhost:8080/cafe/" + cafeId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).catch(error => {
        console.error('Unhandled error:', error);
        return Promise.reject(response.status);
    });

    if (cafeResponse.ok) {
        const cafe = await cafeResponse.json();
        cafeDetails.innerHTML = cafe[0].cafe_name;

    } else {
        console.error('Something went wrong:', cafeResponse.statusText);
    }


}
// TODO:



