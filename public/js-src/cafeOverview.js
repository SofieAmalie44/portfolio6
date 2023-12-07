const cafeUl = document.querySelector('.cafes ul');
const checkEmoji = "✅"
const errorEmoji = "❌"

fetch('/cafes')
    .then(response => response.json())
    .then(cafeArray => {
        console.log(cafeArray);
        cafeArray.forEach(cafeObject => {
            const cafeLi = createCafeLi(cafeObject);
            cafeUl.appendChild(cafeLi);
            console.log(cafeUl);
        });
    });

function getPriceLevel(priceLevel) {
    if (priceLevel === "low") {
        return "Price level: $";
    } else if (priceLevel === "low-medium") {
        return "Price level: $$";
    } else if (priceLevel=== "medium") {
        return "Price level: $$$";
    } else if (priceLevel === "medium-high") {
        return"Price level: $$$$"
    } else if (priceLevel === "high") {
        return "Price level: $$$$$"
    }
}

function createCafeLi(cafeObject) {
    const cafeLi = document.createElement('li');
    cafeLi.setAttribute("class", "cafeLi");
    const spanHeader = document.createElement('span');
    spanHeader.setAttribute("class", "spanCafeName");
    const attributeUl = document.createElement('ul');
    const priceLevelLI = document.createElement('li');
    const noiseLevelLI = document.createElement('li');
    const avaliableWifiLI = document.createElement('li');
    const offersFoodLI = document.createElement('li');
    const descriptionBox = document.createElement("span");
    descriptionBox.setAttribute("class", "descriptionSpan");

    spanHeader.innerText = cafeObject.cafe_name
    priceLevelLI.innerText = getPriceLevel(cafeObject.price_level);
    noiseLevelLI.innerText = "Noise level: " + cafeObject.noise_level;
    avaliableWifiLI.innerText = cafeObject.avaliable_wifi ? checkEmoji : errorEmoji;
    offersFoodLI.innerText = cafeObject.offer_food ? checkEmoji : errorEmoji;
    descriptionBox.innerText = cafeObject.description;

    cafeLi.appendChild(spanHeader);
    attributeUl.appendChild(priceLevelLI);
    attributeUl.appendChild(noiseLevelLI);
    attributeUl.appendChild(avaliableWifiLI);
    attributeUl.appendChild((offersFoodLI));
    cafeLi.appendChild(descriptionBox);
    cafeLi.appendChild(attributeUl);

    return cafeLi;
}